import { useCallback, useState } from 'react';
import type { AttachmentFile, AttachmentState } from './attachmentModel';

export function useAttachment(initialFiles: AttachmentFile[] = []): AttachmentState {
  const [existingFiles, setExistingFiles] = useState<AttachmentFile[]>(initialFiles);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [deletedFileIds, setDeletedFileIds] = useState<(string | number)[]>([]);

  const addFiles = useCallback((files: File[]) => {
    setNewFiles((prev) => [...prev, ...files]);
  }, []);

  const removeExisting = useCallback((fileId: string | number) => {
    setExistingFiles((prev) => prev.filter((f) => f.fileId !== fileId));
    setDeletedFileIds((prev) => [...prev, fileId]);
  }, []);

  const removeNew = useCallback((index: number) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const appendToFormData = useCallback(
    (formData: FormData, fieldName = 'files') => {
      newFiles.forEach((file) => formData.append(fieldName, file));
      deletedFileIds.forEach((id) => formData.append('deletedFileIds', String(id)));
    },
    [newFiles, deletedFileIds]
  );

  const reset = useCallback((nextExisting: AttachmentFile[] = []) => {
    setExistingFiles(nextExisting);
    setNewFiles([]);
    setDeletedFileIds([]);
  }, []);

  return {
    existingFiles,
    newFiles,
    deletedFileIds,
    addFiles,
    removeExisting,
    removeNew,
    appendToFormData,
    reset,
  };
}
