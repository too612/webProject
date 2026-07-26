import type { FormEvent } from "react";
import { useState } from "react";
import { findIdApi } from "./findIdApi";
import type { FindIdStep } from "./findIdModel";

export function useFindId() {
  const [step, setStep] = useState<FindIdStep>(1);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [userId, setUserId] = useState("");
  const [expiresInMinutes, setExpiresInMinutes] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmitUserInfo = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");

    if (!userName.trim() || !email.trim()) {
      setMessageType("error");
      setMessage("이름과 이메일을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await findIdApi.sendCode({
        userName: userName.trim(),
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
      const result = await findIdApi.verifyCode({ code: code.trim() });
      setUserId(result.userId);
      setStep(3);
      setMessageType("success");
      setMessage("아이디 확인이 완료되었습니다.");
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

  return {
    step,
    userName,
    email,
    code,
    userId,
    expiresInMinutes,
    message,
    messageType,
    isSubmitting,
    setUserName,
    setEmail,
    setCode,
    setStep,
    onSubmitUserInfo,
    onSubmitCode,
  };
}
