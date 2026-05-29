import type { FormEvent } from 'react';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../authHook';
import { loginApi } from './loginApi';
import type { LoginFeedbackType, LoginLocationState } from './loginModel';

export function useLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const locationState = location.state as LoginLocationState;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState(locationState?.registeredMessage ?? '');
  const [feedbackType, setFeedbackType] = useState<LoginFeedbackType>(locationState?.registeredMessage ? 'success' : 'error');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const backendOrigin =
    import.meta.env.VITE_BACKEND_ORIGIN ?? (window.location.port === '5173' ? 'http://localhost:8080' : window.location.origin);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedbackMessage('');

    if (!username.trim()) {
      setFeedbackType('error');
      setFeedbackMessage('아이디를 입력해주세요.');
      return;
    }

    if (!password.trim()) {
      setFeedbackType('error');
      setFeedbackMessage('비밀번호를 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await loginApi.login({ username, password, rememberMe });

      login(
        {
          userId: result.userId,
          userName: result.username,
          username: result.username,
        },
        result.token ?? null
      );

      const nextPath = locationState?.from ?? '/';
      navigate(nextPath, { replace: true });
    } catch (error) {
      setFeedbackType('error');
      setFeedbackMessage(error instanceof Error ? error.message : '아이디 또는 비밀번호를 확인해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    username,
    password,
    rememberMe,
    feedbackMessage,
    feedbackType,
    isSubmitting,
    backendOrigin,
    setUsername,
    setPassword,
    setRememberMe,
    onSubmit,
  };
}
