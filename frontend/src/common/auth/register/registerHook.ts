import type { FormEvent } from 'react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerApi } from './registerApi';
import { PASSWORD_PATTERN, PHONE_PATTERN, USERNAME_PATTERN, type ValidationType } from './registerModel';

export function useRegister() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState<'M' | 'F' | ''>('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeMarketing, setAgreeMarketing] = useState(false);
  const [userIdChecked, setUserIdChecked] = useState(false);
  const [emailChecked, setEmailChecked] = useState(false);
  const [userIdValidation, setUserIdValidation] = useState('');
  const [userIdValidationType, setUserIdValidationType] = useState<ValidationType>('');
  const [emailValidation, setEmailValidation] = useState('');
  const [emailValidationType, setEmailValidationType] = useState<ValidationType>('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('error');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const passwordValidation = useMemo(() => {
    if (!password) {
      return { text: '', type: '' as ValidationType };
    }

    const valid = PASSWORD_PATTERN.test(password);
    return {
      text: valid ? '사용 가능한 비밀번호 형식입니다.' : '8-20자의 영문, 숫자, 특수문자를 조합해주세요.',
      type: valid ? ('success' as const) : ('error' as const),
    };
  }, [password]);

  const passwordConfirmValidation = useMemo(() => {
    if (!passwordConfirm) {
      return { text: '', type: '' as ValidationType };
    }

    return {
      text: password === passwordConfirm ? '비밀번호가 일치합니다.' : '비밀번호가 일치하지 않습니다.',
      type: password === passwordConfirm ? ('success' as const) : ('error' as const),
    };
  }, [password, passwordConfirm]);

  const agreeAll = agreeTerms && agreePrivacy && agreeMarketing;

  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length < 4) return digits;
    if (digits.length < 8) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  };

  const onUsernameChange = (value: string) => {
    setUsername(value);
    setUserIdChecked(false);
    setUserIdValidation('');
    setUserIdValidationType('');
  };

  const onEmailChange = (value: string) => {
    setEmail(value);
    setEmailChecked(false);
    setEmailValidation('');
    setEmailValidationType('');
  };

  const handleCheckUserId = async () => {
    if (!USERNAME_PATTERN.test(username.trim())) {
      setUserIdValidation('아이디를 4-20자의 영문, 숫자로 입력해주세요.');
      setUserIdValidationType('error');
      setUserIdChecked(false);
      return;
    }

    try {
      const available = await registerApi.checkUserId(username.trim());
      setUserIdValidation(available ? '사용 가능한 아이디입니다.' : '이미 사용중인 아이디입니다.');
      setUserIdValidationType(available ? 'success' : 'error');
      setUserIdChecked(available);
    } catch (error) {
      setUserIdValidation(error instanceof Error ? error.message : '중복 확인 중 오류가 발생했습니다.');
      setUserIdValidationType('error');
      setUserIdChecked(false);
    }
  };

  const handleCheckEmail = async () => {
    if (!email.includes('@')) {
      setEmailValidation('올바른 이메일을 입력해주세요.');
      setEmailValidationType('error');
      setEmailChecked(false);
      return;
    }

    try {
      const available = await registerApi.checkEmail(email.trim());
      setEmailValidation(available ? '사용 가능한 이메일입니다.' : '이미 사용중인 이메일입니다.');
      setEmailValidationType(available ? 'success' : 'error');
      setEmailChecked(available);
    } catch (error) {
      setEmailValidation(error instanceof Error ? error.message : '중복 확인 중 오류가 발생했습니다.');
      setEmailValidationType('error');
      setEmailChecked(false);
    }
  };

  const handleToggleAgreeAll = (checked: boolean) => {
    setAgreeTerms(checked);
    setAgreePrivacy(checked);
    setAgreeMarketing(checked);
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');
    setMessageType('error');

    if (!USERNAME_PATTERN.test(username.trim())) {
      setMessage('아이디는 4-20자의 영문, 숫자 조합이어야 합니다.');
      return;
    }

    if (!userIdChecked) {
      setMessage('아이디 중복확인을 완료해주세요.');
      return;
    }

    if (!PASSWORD_PATTERN.test(password)) {
      setMessage('비밀번호는 8-20자의 영문, 숫자, 특수문자 조합이어야 합니다.');
      return;
    }

    if (password !== passwordConfirm) {
      setMessage('비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    if (!userName.trim()) {
      setMessage('이름을 입력해주세요.');
      return;
    }

    if (!email.trim()) {
      setMessage('이메일을 입력해주세요.');
      return;
    }

    if (!emailChecked) {
      setMessage('이메일 중복확인을 완료해주세요.');
      return;
    }

    if (!PHONE_PATTERN.test(phone)) {
      setMessage('휴대폰 번호를 정확히 입력해주세요.');
      return;
    }

    if (!agreeTerms || !agreePrivacy) {
      setMessage('필수 약관 동의가 필요합니다.');
      return;
    }

    setIsSubmitting(true);

    try {
      await registerApi.register({
        username: username.trim(),
        userName: userName.trim(),
        email: email.trim(),
        phone,
        password,
        birthDate: birthDate || undefined,
        gender,
        agreeTerms,
        agreePrivacy,
        agreeMarketing,
      });

      navigate('/auth/login', {
        replace: true,
        state: { registeredMessage: '회원가입이 완료되었습니다. 로그인해주세요.' },
      });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '회원가입 처리 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    username,
    userName,
    email,
    phone,
    password,
    passwordConfirm,
    birthDate,
    gender,
    agreeTerms,
    agreePrivacy,
    agreeMarketing,
    userIdValidation,
    userIdValidationType,
    emailValidation,
    emailValidationType,
    passwordValidation,
    passwordConfirmValidation,
    agreeAll,
    message,
    messageType,
    isSubmitting,
    setUserName,
    setPassword,
    setPasswordConfirm,
    setBirthDate,
    setGender,
    setAgreeTerms,
    setAgreePrivacy,
    setAgreeMarketing,
    setPhone,
    onUsernameChange,
    onEmailChange,
    formatPhoneNumber,
    handleCheckUserId,
    handleCheckEmail,
    handleToggleAgreeAll,
    onSubmit,
  };
}
