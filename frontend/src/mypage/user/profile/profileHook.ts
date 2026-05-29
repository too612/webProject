import { FormEvent, useCallback, useEffect, useState } from 'react';
import { EMPTY_MYPAGE_PROFILE, type MypageProfileData } from './profileModel';
import { mypageProfileApi } from './profileApi';

export function useMypageProfilePage() {
  const [form, setForm] = useState<MypageProfileData>(EMPTY_MYPAGE_PROFILE);
  const [initialForm, setInitialForm] = useState<MypageProfileData>(EMPTY_MYPAGE_PROFILE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError('');

    mypageProfileApi
      .getProfileData()
      .then((data) => {
        if (!mounted) return;
        setForm(data);
        setInitialForm(data);
      })
      .catch((e) => {
        if (!mounted) return;
        const nextMessage = e instanceof Error ? e.message : '프로필 정보를 불러오지 못했습니다.';
        setError(nextMessage);
        setForm(EMPTY_MYPAGE_PROFILE);
        setInitialForm(EMPTY_MYPAGE_PROFILE);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleChange = useCallback((field: keyof MypageProfileData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = useCallback((event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');

    mypageProfileApi
      .updateProfileData(form)
      .then(() => {
        setInitialForm(form);
        setMessage('프로필 정보가 저장되었습니다.');
      })
      .catch((e) => {
        const nextMessage = e instanceof Error ? e.message : '프로필 정보를 저장하지 못했습니다.';
        setError(nextMessage);
      })
      .finally(() => {
        setSaving(false);
      });
  }, [form]);

  const handleReset = useCallback(() => {
    setForm(initialForm);
    setError('');
    setMessage('');
  }, [initialForm]);

  return {
    form,
    loading,
    saving,
    error,
    message,
    handleChange,
    handleSubmit,
    handleReset,
  };
}
