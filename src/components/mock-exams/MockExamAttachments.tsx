'use client';

import { X } from 'lucide-react';
import { useRef } from 'react';

import { Button } from '@/components/ui/button';
import { MOCK_EXAM_COPY, MOCK_EXAM_FILE_ACCEPT, MOCK_EXAM_LAYOUT } from '@/config/mock-exams';

interface MockExamAttachmentsProps {
  onAdd: (names: string[]) => void;
}

export function MockExamAttachmentStrip({
  names,
  onRemove,
}: {
  names: string[];
  onRemove: (name: string) => void;
}) {
  if (names.length === 0) return null;

  return (
    <div aria-label={MOCK_EXAM_COPY.attachments} className={MOCK_EXAM_LAYOUT.attachmentStrip}>
      {names.map((name) => (
        <span key={name} className={MOCK_EXAM_LAYOUT.attachment} title={name}>
          <span className={MOCK_EXAM_LAYOUT.attachmentName}>{name}</span>
          <button
            type="button"
            className={MOCK_EXAM_LAYOUT.attachmentRemove}
            aria-label={MOCK_EXAM_COPY.removeAttachment(name)}
            onClick={() => onRemove(name)}
          >
            <X aria-hidden="true" className={MOCK_EXAM_LAYOUT.attachmentRemoveIcon} />
          </button>
        </span>
      ))}
    </div>
  );
}

export function MockExamAttachments({ onAdd }: MockExamAttachmentsProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <Button className={MOCK_EXAM_LAYOUT.footerAction} onClick={() => inputRef.current?.click()}>
        {MOCK_EXAM_COPY.attach}
      </Button>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={MOCK_EXAM_FILE_ACCEPT}
        hidden
        onChange={(event) => {
          onAdd(Array.from(event.currentTarget.files ?? [], (file) => file.name));
          event.currentTarget.value = '';
        }}
      />
    </>
  );
}
