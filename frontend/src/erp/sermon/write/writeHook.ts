import { useCallback, useState } from 'react';
import { sermonWriteApi } from './writeApi';
import { INITIAL_SERMON_WRITE_FORM, type SermonWriteForm } from './writeModel';

export function useSermonWrite() {
  const [form, setForm] = useState<SermonWriteForm>(INITIAL_SERMON_WRITE_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const updateField = useCallback((name: keyof SermonWriteForm, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const submit = useCallback(async () => {
    setSubmitting(true);
    setError('');
    try {
      await sermonWriteApi.createSermon(form);
      return true;
    } catch (e) {
      const message = e instanceof Error ? e.message : '저장에 실패했습니다. 다시 시도해주세요.';
      setError(message);
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [form]);

  return {
    form,
    submitting,
    error,
    updateField,
    submit,
  };
}
