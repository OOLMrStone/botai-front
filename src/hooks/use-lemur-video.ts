'use client';

import { useEffect, useEffectEvent, useState } from 'react';

import { LEMUR_COPY, LEMUR_PLAYBACK } from '@/config/lemur-copy';
import { useLemurVideoBuffer } from '@/hooks/use-lemur-video-buffer';
import type { LemurVideoRequest } from '@/hooks/use-lemur-video-buffer';

interface LemurVideoOptions extends LemurVideoRequest {
  prepared?: LemurVideoRequest;
  paused: boolean;
  playbackRate: number;
  loop: boolean;
  loopFrom?: number;
  onFinish?: () => void;
  onError?: (message: string) => void;
}

export function useLemurVideo({
  source,
  startAt,
  prepared,
  paused,
  playbackRate,
  loop,
  loopFrom,
  onFinish,
  onError,
}: LemurVideoOptions) {
  const [failure, setFailure] = useState({ source, message: '' });
  const [ended, setEnded] = useState(false);
  const [blockedSource, setBlockedSource] = useState<string | null>(null);
  const requiresInteraction = blockedSource === source;
  const error = failure.source === source ? failure.message : '';
  const buffer = useLemurVideoBuffer({
    source,
    startAt,
    prepared,
    onReady: () => {
      setEnded(false);
      setFailure({ source, message: '' });
    },
    onError: (message) => {
      setFailure({ source, message });
      onError?.(message);
    },
  });
  const { ref, firstRef, secondRef, activeSlot, ready } = buffer;
  const finishReaction = useEffectEvent(() => {
    if (!onFinish) return false;
    onFinish();
    return true;
  });
  const reportFailure = useEffectEvent((message: string) => {
    setFailure({ source, message });
    onError?.(message);
  });
  function isCurrent(video: HTMLVideoElement) {
    return (
      video === (buffer.pendingRef.current ?? ref.current) &&
      (video === buffer.firstRef.current || video === buffer.secondRef.current) &&
      video.getAttribute('src') === source
    );
  }

  function play(video: HTMLVideoElement) {
    if (document.hidden) return;

    video.playbackRate = playbackRate;
    video.loop = loop;
    void video
      .play()
      .then(() => {
        if (!isCurrent(video)) return;
        setBlockedSource(null);
        setFailure({ source, message: '' });
      })
      .catch((reason: unknown) => {
        if (!isCurrent(video) || (reason instanceof DOMException && reason.name === 'AbortError')) {
          return;
        }

        setBlockedSource(source);
        if (reason instanceof DOMException && reason.name === 'NotAllowedError') return;
        setFailure({ source, message: LEMUR_COPY.playError });
        onError?.(LEMUR_COPY.playError);
      });
  }
  const playAutomatically = useEffectEvent(play);

  useEffect(() => {
    const first = firstRef.current;
    const second = secondRef.current;

    return () => {
      first?.pause();
      second?.pause();
    };
  }, [firstRef, secondRef]);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const sync = () => {
      video.playbackRate = playbackRate;
      video.loop = loop;
      if (!ready || requiresInteraction || paused || ended || video.ended || document.hidden) {
        video.pause();
        return;
      }
      if (video.paused) playAutomatically(video);
    };
    const fail = () => reportFailure(LEMUR_COPY.loadError);
    const finish = () => {
      if (!ready || finishReaction()) return;
      if (loopFrom === undefined) {
        setEnded(true);
        return;
      }

      video.currentTime = loopFrom;
      sync();
    };

    sync();
    video.addEventListener('canplay', sync);
    video.addEventListener('error', fail);
    video.addEventListener('ended', finish);
    video.addEventListener('seeked', sync);
    document.addEventListener('visibilitychange', sync);
    return () => {
      video.removeEventListener('canplay', sync);
      video.removeEventListener('error', fail);
      video.removeEventListener('ended', finish);
      video.removeEventListener('seeked', sync);
      document.removeEventListener('visibilitychange', sync);
    };
  }, [
    ref,
    activeSlot,
    ready,
    source,
    paused,
    playbackRate,
    ended,
    loop,
    loopFrom,
    requiresInteraction,
  ]);

  function start() {
    const video = buffer.pendingRef.current ?? ref.current;
    if (!video) return;

    setBlockedSource(null);
    // Safari должен получить play в самом нажатии, до обновления состояния и эффектов.
    play(video);
  }

  function replay() {
    const video = ref.current;
    if (!video) return;

    video.currentTime = startAt ?? LEMUR_PLAYBACK.start;
    setEnded(false);
    start();
  }

  return { ...buffer, error, ended, requiresInteraction, start, replay };
}
