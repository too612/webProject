import { useCallback, useMemo, useState } from 'react';
import { mypageWithdrawApi } from './withdrawApi';
import {
  EMPTY_MYPAGE_WITHDRAW_STATE,
  type MypageWithdrawAgreementKey,
  type MypageWithdrawState,
} from './withdrawModel';

export function useMypageWithdrawPage() {
  const [state, setState] = useState<MypageWithdrawState>(EMPTY_MYPAGE_WITHDRAW_STATE);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const canSubmit = useMemo(() => {
    return state.noticeChecked && state.irreversibleChecked && state.password.trim().length > 0;
  }, [state]);

  const handleAgreementChange = useCallback((key: MypageWithdrawAgreementKey, value: boolean) => {
    setState((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handlePasswordChange = useCallback((value: string) => {
    setState((prev) => ({ ...prev, password: value }));
  }, []);

  const handleCancel = useCallback(() => {
    setState(EMPTY_MYPAGE_WITHDRAW_STATE);
    setError('');
    setMessage('');
  }, []);

  const handleSubmit = useCallback(() => {
    if (!canSubmit) {
      setError('안내 확인 및 비밀번호 입력 후 진행해 주세요.');
      return;
    }

    setSubmitting(true);
    setError('');
    setMessage('');

    mypageWithdrawApi
      .withdraw(state.password)
      .then(() => {
        setMessage('회원 탈퇴 요청이 접수되었습니다.');
      })
      .catch((e) => {
        const nextMessage = e instanceof Error ? e.message : '회원 탈퇴를 진행하지 못했습니다.';
        setError(nextMessage);
      })
      .finally(() => {
        setSubmitting(false);
      });
  }, [canSubmit, state.password]);

  return {
    state,
    canSubmit,
    submitting,
    error,
    message,
    handleAgreementChange,
    handlePasswordChange,
    handleCancel,
    handleSubmit,
  };
}
