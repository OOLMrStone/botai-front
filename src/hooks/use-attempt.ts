'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { INTEGRATION, LEARNING_COPY as C } from '@/config/integration';
import { ApiError, requestErrorMessage } from '@/lib/api/client';
import {
  cancelSubmission,
  checkAttempt,
  createSubmission,
  deleteImage,
  fetchAttempt,
  fetchSubmission,
  finalizeSubmission,
  patchAttempt,
  reportClientRejection,
  uploadImage,
} from '@/lib/api/learning';
import type { Attempt, AttemptPatch, Submission } from '@/lib/api/learning-types';
import { imageRejection } from '@/lib/image-validation';
import { attemptDraft, ownsAttemptDraft } from '@/lib/attempt-drafts';
import { itemLocked } from '@/lib/attempt';
import { invalidateAttempts } from '@/lib/learning-resources';
import { useTasksStore } from '@/stores/tasks-store';

export function useAttempt(id: string) {
  const session = useMemo(() => attemptDraft(id), [id]);
  const [attempt, setAttempt] = useState<Attempt | null>(session.snapshot);
  const [answers, setAnswers] = useState<Record<string, string>>(session.answers);
  const [busy, setBusy] = useState(Boolean(session.pending));
  const [editingBusy, setEditingBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conflict, setConflict] = useState(false);
  const active = useRef(true);
  const keys = useRef(new Map<string, string>());
  const savedDrawings = useTasksStore((state) => state.savedDrawings);
  const hasDraft = useCallback(() => {
    const state = useTasksStore.getState();
    return (
      Object.keys(session.answers).length > 0 ||
      Boolean(
        session.snapshot?.items.some(
          (item) => Object.hasOwn(state.savedDrawings, item.id) || state.editingDrawings[item.id],
        ),
      )
    );
  }, [session]);
  const accept = useCallback(
    (next: Attempt) => {
      if (!ownsAttemptDraft(id, session)) return next;
      if (session.snapshot && next.revision < session.snapshot.revision) return session.snapshot;
      session.accept(next);
      if (active.current) {
        setAttempt(next);
        setAnswers({ ...session.answers });
        useTasksStore.getState().hydrate(next.items);
        invalidateAttempts();
      }
      return next;
    },
    [id, session],
  );
  const requestKey = (scope: string) => {
    if (!keys.current.has(scope)) keys.current.set(scope, crypto.randomUUID());
    return keys.current.get(scope)!;
  };
  const refresh = useCallback(async () => {
    const generation = session.generation;
    const sequence = session.startFetch();
    let next: Attempt;
    try {
      next = await fetchAttempt(id);
    } catch (cause) {
      if (generation !== session.generation || sequence !== session.fetchSequence) {
        if (session.snapshot) return session.snapshot;
      }
      throw cause;
    }
    if (
      !ownsAttemptDraft(id, session) ||
      generation !== session.generation ||
      sequence !== session.fetchSequence
    )
      return session.snapshot ?? next;
    if (hasDraft() && session.snapshot && next.revision !== session.snapshot.revision)
      throw new ApiError(409, C.conflict);
    return accept(next);
  }, [accept, hasDraft, id, session]);
  const fail = useCallback(
    (cause: unknown) => {
      if (!active.current || !ownsAttemptDraft(id, session)) return;
      const collision = cause instanceof ApiError && cause.status === 409;
      setConflict(collision);
      setError(collision ? C.conflict : requestErrorMessage(cause, C.saveError));
    },
    [id, session],
  );
  useEffect(() => {
    active.current = true;
    void (async () => {
      await session.pending;
      if (active.current && ownsAttemptDraft(id, session)) await refresh();
    })()
      .catch(fail)
      .finally(() => {
        if (active.current) setBusy(false);
      });
    return () => {
      active.current = false;
    };
  }, [refresh, fail, id, session]);
  const run = async <T>(action: () => Promise<T>, lockEditing = true): Promise<T | null> => {
    if (session.pending || !ownsAttemptDraft(id, session)) return null;
    session.startMutation();
    setBusy(true);
    setEditingBusy(lockEditing);
    setError(null);
    const operation = (async () => {
      try {
        return await action();
      } catch (cause) {
        fail(cause);
        return null;
      } finally {
        session.finishMutation();
        if (active.current) {
          setBusy(false);
          setEditingBusy(false);
        }
      }
    })();
    session.track(operation);
    return operation;
  };
  const persist = async (currentIndex?: number) => {
    const previous = session.snapshot;
    if (!previous) throw new Error(C.loadError);
    if (conflict) throw new ApiError(409, C.conflict);
    const drawingState = useTasksStore.getState();
    const items: NonNullable<AttemptPatch['items']> = previous.items.flatMap((item) => {
      if (itemLocked(item) || drawingState.editingDrawings[item.id]) return [];
      const answer = session.answers[item.id];
      const drawing = drawingState.savedDrawings[item.id];
      if (answer === undefined && drawing === undefined) return [];
      if (
        (answer === undefined || answer === item.answer) &&
        (!drawing || JSON.stringify(drawing) === JSON.stringify(item.drawing))
      ) {
        session.acknowledge(item.id, answer);
        if (drawing) drawingState.acknowledge(item.id, drawing);
        return [];
      }
      return [{ id: item.id, answer, drawing }];
    });
    if (!items.length && (currentIndex === undefined || currentIndex === previous.currentIndex)) {
      setAnswers({ ...session.answers });
      return previous;
    }
    const next = await patchAttempt(id, { revision: previous.revision, currentIndex, items });
    if (!ownsAttemptDraft(id, session)) return next;
    for (const item of items) {
      session.acknowledge(item.id, item.answer);
      if (item.drawing) useTasksStore.getState().acknowledge(item.id, item.drawing);
    }
    setAnswers({ ...session.answers });
    return accept(next);
  };
  const save = () => run(() => persist(), false);
  const select = (index: number) => run(() => persist(index), false);
  const setAnswer = (itemId: string, answer: string) => {
    session.setAnswer(itemId, answer);
    setAnswers(session.answers);
  };
  useEffect(() => {
    if (
      conflict ||
      error ||
      busy ||
      (!Object.keys(answers).length && !Object.keys(savedDrawings).length)
    )
      return;
    const timeout = setTimeout(() => {
      void save();
    }, INTEGRATION.autosaveMs);
    return () => clearTimeout(timeout);
  });
  useEffect(() => {
    if (
      !attempt?.items.some((item) => ['queued', 'running'].includes(item.submission?.status ?? ''))
    )
      return;
    const timer = setInterval(() => {
      if (!session.pending) void refresh().catch(fail);
    }, INTEGRATION.pollMs);
    return () => clearInterval(timer);
  }, [attempt, refresh, fail, session]);
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (
        !Object.keys(session.answers).length &&
        !Object.keys(useTasksStore.getState().savedDrawings).length &&
        !session.pending
      )
        return;
      event.preventDefault();
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [session]);
  const reload = () =>
    run(async () => {
      // Неудачный GET не должен удалять местные правки даже при явном отказе от них.
      const next = await fetchAttempt(id);
      if (!ownsAttemptDraft(id, session)) return next;
      session.clear();
      useTasksStore.getState().resetTaskProgress(next.items.map((item) => item.id));
      setConflict(false);
      return accept(next);
    });
  const retry = () => (attempt ? save() : run(refresh, false));
  const draftSubmission = async (itemId: string, retry = false): Promise<Submission> => {
    const state = await persist();
    const item = state.items.find((candidate) => candidate.id === itemId);
    if (!item) throw new Error(C.loadError);
    if (item.submission?.status === 'draft') return fetchSubmission(item.submission.id);
    if (item.submission && !retry) throw new Error(C.retryCheck);
    const previous = item.submission?.id;
    const submission = await createSubmission(
      id,
      itemId,
      item.answerRevision,
      requestKey(`intent:${itemId}:${item.answerRevision}:${previous ?? ''}`),
      previous,
    );
    await refresh();
    return submission;
  };
  const upload = (itemId: string, files: File[]) =>
    run(async () => {
      let submission = await draftSubmission(itemId);
      for (const file of files) {
        const reason =
          submission.images.length >= INTEGRATION.maxImages
            ? 'image_count'
            : await imageRejection(file);
        if (reason) {
          await reportClientRejection(submission.id, submission.revision, reason);
          await refresh();
          throw new Error(C[reason]);
        }
        await uploadImage(submission.id, file);
        submission = await fetchSubmission(submission.id);
      }
      return refresh();
    });
  const retrySubmission = (itemId: string) =>
    run(async () => {
      await draftSubmission(itemId, true);
      return refresh();
    });
  const removeImage = (submissionId: string, imageId: string) =>
    run(async () => {
      await deleteImage(submissionId, imageId);
      return refresh();
    });
  const cancel = (submissionId: string) =>
    run(async () => {
      await cancelSubmission(submissionId);
      return refresh();
    });
  const check = () =>
    run(async () => {
      let state = await persist();
      const issues: string[] = [];
      for (const item of state.items) {
        if (item.submission?.status !== 'draft' || !item.submission.images.length) continue;
        const submission = await fetchSubmission(item.submission.id);
        try {
          await finalizeSubmission(submission.id, submission.revision);
        } catch (cause) {
          issues.push(requestErrorMessage(cause, C.saveError));
        }
      }
      state = await refresh();
      const next = await checkAttempt(id, state.revision, requestKey(`check:${state.revision}`));
      invalidateAttempts();
      if (issues.length) setError(issues.join(' · '));
      return accept(next);
    });
  return {
    attempt,
    answers,
    busy,
    editingBusy,
    unsaved:
      Object.keys(answers).length > 0 ||
      Boolean(attempt?.items.some((item) => savedDrawings[item.id])),
    error,
    conflict,
    setAnswer,
    select,
    save,
    reload,
    retry,
    upload,
    removeImage,
    retrySubmission,
    cancel,
    check,
  };
}
