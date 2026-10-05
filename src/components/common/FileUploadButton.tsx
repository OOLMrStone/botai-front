'use client';

import { useRef } from 'react';
import { Button } from '@/components/ui/button';

interface FileUploadButtonProps {
  onAdd: (files: File[]) => void;
  label: string;
  accept: string;
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
}
export function FileUploadButton({
  onAdd,
  label,
  accept,
  multiple = false,
  disabled = false,
  className,
}: FileUploadButtonProps) {
  const input = useRef<HTMLInputElement>(null);
  return (
    <>
      <Button disabled={disabled} className={className} onClick={() => input.current?.click()}>
        {label}
      </Button>
      <input
        ref={input}
        type="file"
        multiple={multiple}
        accept={accept}
        hidden
        onChange={(event) => {
          onAdd(Array.from(event.currentTarget.files ?? []));
          event.currentTarget.value = '';
        }}
      />
    </>
  );
}
