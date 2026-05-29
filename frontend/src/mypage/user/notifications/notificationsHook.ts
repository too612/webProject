import { useCallback, useEffect, useState } from 'react';
import { mypageNotificationsApi } from './notificationsApi';
import {
  EMPTY_MYPAGE_NOTIFICATION_SETTINGS,
  type MypageNotificationSettings,
} from './notificationsModel';

export function useMypageNotificationsPage() {
  const [settings, setSettings] = useState<MypageNotificationSettings>(EMPTY_MYPAGE_NOTIFICATION_SETTINGS);
  const [initialSettings, setInitialSettings] = useState<MypageNotificationSettings>(EMPTY_MYPAGE_NOTIFICATION_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError('');

    mypageNotificationsApi
      .getNotificationSettings()
      .then((data) => {
        if (!mounted) return;
        setSettings(data);
        setInitialSettings(data);
      })
      .catch((e) => {
        if (!mounted) return;
        const nextMessage = e instanceof Error ? e.message : '알림 설정을 불러오지 못했습니다.';
        setError(nextMessage);
        setSettings(EMPTY_MYPAGE_NOTIFICATION_SETTINGS);
        setInitialSettings(EMPTY_MYPAGE_NOTIFICATION_SETTINGS);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleToggle = useCallback((key: keyof MypageNotificationSettings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const handleSave = useCallback(() => {
    setSaving(true);
    setError('');
    setMessage('');

    mypageNotificationsApi
      .updateNotificationSettings(settings)
      .then(() => {
        setInitialSettings(settings);
        setMessage('알림 설정이 저장되었습니다.');
      })
      .catch((e) => {
        const nextMessage = e instanceof Error ? e.message : '알림 설정을 저장하지 못했습니다.';
        setError(nextMessage);
      })
      .finally(() => {
        setSaving(false);
      });
  }, [settings]);

  const handleReset = useCallback(() => {
    setSettings(initialSettings);
    setError('');
    setMessage('');
  }, [initialSettings]);

  return {
    settings,
    loading,
    saving,
    error,
    message,
    handleToggle,
    handleSave,
    handleReset,
  };
}
