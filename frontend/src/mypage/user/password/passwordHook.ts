import { FormEvent, useCallback, useState } from 'react';
import { EMPTY_MYPAGE_PASSWORD, type MypagePasswordData } from './passwordModel';
import { mypagePasswordApi } from './passwordApi';

export function useMypagePasswordPage() {
  const [form, setForm] = useState<MypagePasswordData>(EMPTY_MYPAGE_PASSWORD);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleChange = useCallback((field: keyof MypagePasswordData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = useCallback((event: FormEvent) => {
    event.preventDefault();
    setError('');
    setMessage('');

    if (form.newPassword.length < 8) {
      setError('새 비밀번호는 8자 이상이어야 합니다.');
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError('새 비밀번호와 확인 값이 일치하지 않습니다.');
      return;
    }

    setSaving(true);
    mypagePasswordApi
      .updatePassword(form)
      .then(() => {
        setForm(EMPTY_MYPAGE_PASSWORD);
        setMessage('비밀번호가 변경되었습니다.');
      })
      .catch((e) => {
        const nextMessage = e instanceof Error ? e.message : '비밀번호를 변경하지 못했습니다.';
        setError(nextMessage);
      })
      .finally(() => {
        setSaving(false);
      });
  }, [form]);

  const handleReset = useCallback(() => {
    setForm(EMPTY_MYPAGE_PASSWORD);
    setError('');
    setMessage('');
  }, []);

  return {
    form,
    saving,
    error,
    message,
    handleChange,
    handleSubmit,
    handleReset,
  };
}
