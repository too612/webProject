import { Link } from "react-router-dom";
import { Alert, AlertDescription, Input } from "../../ui";
import { useFindId } from "./findIdHook";

export default function FindIdPage() {
  const {
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
  } = useFindId();

  return (
    <section className="w-full max-w-md">
      <div className="rounded-none border border-slate-200 bg-white shadow-panel p-6 md:p-7 space-y-6">
        <div className="space-y-2 pb-4 border-b border-slate-200">
          <h2 className="text-xl md:text-2xl font-bold text-brand-dark">
            아이디 찾기
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            이름과 이메일을 입력한 뒤 인증코드를 확인해 주세요.
          </p>
        </div>

        {message && (
          <Alert
            variant={messageType === "success" ? "success" : "destructive"}
          >
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        {step === 1 && (
          <form className="space-y-4" onSubmit={onSubmitUserInfo}>
            <div className="space-y-1.5">
              <label
                htmlFor="userName"
                className="block text-sm font-medium text-gray-700"
              >
                이름
              </label>
              <Input
                id="userName"
                value={userName}
                onChange={(event) => setUserName(event.target.value)}
                placeholder="이름을 입력하세요"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                이메일
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="example@email.com"
                required
              />
            </div>

            <button
              className="w-full bg-brand-primary text-white rounded-md py-2.5 text-sm font-semibold hover:bg-brand-primary/90 disabled:opacity-40 transition-colors"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "발송 중..." : "인증코드 발송"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form className="space-y-4" onSubmit={onSubmitCode}>
            <div className="text-xs text-gray-500">
              인증코드는 {expiresInMinutes ?? 10}분 동안 유효합니다.
            </div>
            <div className="space-y-1.5">
              <label
                htmlFor="code"
                className="block text-sm font-medium text-gray-700"
              >
                인증코드
              </label>
              <Input
                id="code"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                placeholder="6자리 인증코드"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                className="w-full bg-slate-100 text-slate-700 rounded-md py-2.5 text-sm font-semibold hover:bg-slate-200 transition-colors"
                type="button"
                onClick={() => setStep(1)}
                disabled={isSubmitting}
              >
                이전
              </button>
              <button
                className="w-full bg-brand-primary text-white rounded-md py-2.5 text-sm font-semibold hover:bg-brand-primary/90 disabled:opacity-40 transition-colors"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "확인 중..." : "인증코드 확인"}
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-sm text-slate-700">확인된 아이디</p>
              <p className="mt-1 text-lg font-semibold text-brand-dark">
                {userId}
              </p>
            </div>
            <Link
              to="/auth/login"
              className="block w-full text-center bg-brand-primary text-white rounded-md py-2.5 text-sm font-semibold hover:bg-brand-primary/90 transition-colors"
            >
              로그인으로 이동
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
