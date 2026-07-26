import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { findPasswordApi } from "./findPasswordApi";
import { PASSWORD_PATTERN, type FindPasswordStep } from "./findPasswordModel";

export function useFindPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState<FindPasswordStep>(1);
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [expiresInMinutes, setExpiresInMinutes] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const passwordValidation = useMemo(() => {
    if (!newPassword) {
      return "";
    }
    return PASSWORD_PATTERN.test(newPassword)
      ? "사용 가능한 비밀번호 형식입니다."
      : "8-20자의 영문, 숫자, 특수문자를 조합해주세요.";
  }, [newPassword]);

  const onSubmitUserInfo = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");

    if (!userId.trim() || !email.trim()) {
      setMessageType("error");
      setMessage("아이디와 이메일을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await findPasswordApi.sendCode({
        userId: userId.trim(),
        email: email.trim(),
      });
      setExpiresInMinutes(result.expiresInMinutes);
      setStep(2);
      setMessageType("success");
      setMessage("입력 정보가 일치하면 인증코드를 발송합니다.");
    } catch (error) {
      setMessageType("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "인증코드 발송에 실패했습니다.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmitCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");

    if (!code.trim()) {
      setMessageType("error");
      setMessage("인증코드를 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      await findPasswordApi.verifyCode({ code: code.trim() });
      setStep(3);
      setMessageType("success");
      setMessage("본인 인증이 완료되었습니다.");
    } catch (error) {
      setMessageType("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "인증코드 확인에 실패했습니다.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmitReset = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");

    if (!PASSWORD_PATTERN.test(newPassword)) {
      setMessageType("error");
      setMessage("비밀번호는 8-20자의 영문, 숫자, 특수문자 조합이어야 합니다.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessageType("error");
      setMessage("비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    setIsSubmitting(true);
    try {
      await findPasswordApi.resetPassword({ newPassword, confirmPassword });
      navigate("/auth/login", {
        replace: true,
        state: {
          registeredMessage:
            "비밀번호가 재설정되었습니다. 다시 로그인해주세요.",
        },
      });
    } catch (error) {
      setMessageType("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "비밀번호 재설정에 실패했습니다.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    step,
    userId,
    email,
    code,
    newPassword,
    confirmPassword,
    expiresInMinutes,
    message,
    messageType,
    isSubmitting,
    passwordValidation,
    setUserId,
    setEmail,
    setCode,
    setNewPassword,
    setConfirmPassword,
    setStep,
    onSubmitUserInfo,
    onSubmitCode,
    onSubmitReset,
  };
}
