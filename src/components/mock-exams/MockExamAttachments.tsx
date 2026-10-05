'use client';

import { X } from 'lucide-react';

import { FileUploadButton } from '@/components/common/FileUploadButton';
import { MOCK_EXAM_COPY, MOCK_EXAM_FILE_ACCEPT, MOCK_EXAM_LAYOUT } from '@/config/mock-exams';

interface MockExamAttachmentsProps {
  onAdd: (files: File[]) => void;
  disabled?: boolean;
  label?: string;
  accept?: string;
  multiple?: boolean;
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

export function MockExamAttachments({
  onAdd,
  disabled = false,
  label = MOCK_EXAM_COPY.attach,
  accept = MOCK_EXAM_FILE_ACCEPT,
  multiple = true,
}: MockExamAttachmentsProps) {
  return (
    <FileUploadButton
      onAdd={onAdd}
      disabled={disabled}
      label={label}
      accept={accept}
      multiple={multiple}
      className={MOCK_EXAM_LAYOUT.footerAction}
    />
  );
}
