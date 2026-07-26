import { useFindPassword } from "./findPasswordHook";

export default function FindPasswordPage() {
  const {
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
  } = useFindPassword();

  return (
    <section className="w-full max-w-md">
      <div className="rounded-none border border-slate-200 bg-white shadow-panel p-6 md:p-7 space-y-6">
        <div className="space-y-2 pb-4 border-b border-slate-200">
          <h2 className="text-xl md:text-2xl font-bold text-brand-dark">
            비밀번호 찾기
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            본인 인증 후 새로운 비밀번호를 설정해 주세요.
          </p>
        </div>

        {message && (
          <div
            className={`text-sm rounded-md px-4 py-3 ${messageType === "success" ? "text-green-700 bg-green-50 border border-green-200" : "text-red-600 bg-red-50 border border-red-200"}`}
          >
            {message}
          </div>
        )}

        {step === 1 && (
          <form className="space-y-4" onSubmit={onSubmitUserInfo}>
            <div className="space-y-1.5">
              <label
                htmlFor="userId"
                className="block text-sm font-medium text-gray-700"
              >
                아이디
              </label>
              <input
                id="userId"
                className="w-full border border-slate-200 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white"
                value={userId}
                onChange={(event) => setUserId(event.target.value)}
                placeholder="아이디를 입력하세요"
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
              <input
                id="email"
                type="email"
                className="w-full border border-slate-200 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white"
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
              <input
                id="code"
                className="w-full border border-slate-200 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white"
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
          <form className="space-y-4" onSubmit={onSubmitReset}>
            <div className="space-y-1.5">
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700"
              >
                새 비밀번호
              </label>
              <input
                id="newPassword"
                type="password"
                className="w-full border border-slate-200 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                placeholder="새 비밀번호를 입력하세요"
                required
              />
              {passwordValidation && (
                <p
                  className={`text-xs ${passwordValidation.includes("사용 가능") ? "text-green-600" : "text-red-600"}`}
                >
                  {passwordValidation}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                새 비밀번호 확인
              </label>
              <input
                id="confirmPassword"
                type="password"
                className="w-full border border-slate-200 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="새 비밀번호를 다시 입력하세요"
                required
              />
            </div>

            <button
              className="w-full bg-brand-primary text-white rounded-md py-2.5 text-sm font-semibold hover:bg-brand-primary/90 disabled:opacity-40 transition-colors"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "변경 중..." : "비밀번호 재설정"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
