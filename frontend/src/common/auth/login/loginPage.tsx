import { Link } from "react-router-dom";
import { Alert, AlertDescription, Input } from "../../ui";
import { useLogin } from "./loginHook";

export default function LoginPage() {
  const {
    username,
    password,
    rememberMe,
    feedbackMessage,
    feedbackType,
    isSubmitting,
    setUsername,
    setPassword,
    setRememberMe,
    onSubmit,
  } = useLogin();

  return (
    <section className="w-full max-w-md">
      <div className="rounded-none border border-slate-200 bg-white shadow-panel p-6 md:p-7 space-y-6">
        <div className="space-y-2 pb-4 border-b border-slate-200">
          <h2 className="text-xl md:text-2xl font-bold text-brand-dark">
            로그인
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            다사랑교회 서비스 이용을 위해 계정으로 로그인해 주세요.
          </p>
        </div>

        {feedbackMessage && (
          <Alert
            variant={feedbackType === "success" ? "success" : "destructive"}
          >
            <AlertDescription>{feedbackMessage}</AlertDescription>
          </Alert>
        )}

        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-1.5">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              아이디
            </label>
            <Input
              id="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="아이디를 입력하세요"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              비밀번호
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="비밀번호를 입력하세요"
              required
            />
          </div>

          <div className="flex items-start justify-between gap-3 pt-1">
            <label
              className="inline-flex items-center gap-2 text-sm text-gray-600"
              htmlFor="rememberMe"
            >
              <input
                id="rememberMe"
                type="checkbox"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
              />
              <span>로그인 상태 유지</span>
            </label>
            <div className="flex gap-3 text-sm whitespace-nowrap">
              <Link
                to="/auth/find-id"
                className="text-brand-primary hover:underline"
              >
                아이디 찾기
              </Link>
              <Link
                to="/auth/find-password"
                className="text-brand-primary hover:underline"
              >
                비밀번호 찾기
              </Link>
            </div>
          </div>

          <button
            className="w-full bg-brand-primary text-white rounded-md py-2.5 text-sm font-semibold hover:bg-brand-primary/90 disabled:opacity-40 transition-colors"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "로그인 중..." : "로그인"}
          </button>
        </form>

        <div className="relative flex items-center text-sm text-gray-400">
          <div className="flex-1 border-t border-slate-200" />
          <span className="px-3">또는</span>
          <div className="flex-1 border-t border-slate-200" />
        </div>

        <div className="text-sm text-center text-gray-500">
          아직 회원이 아니신가요?
          <Link
            to="/auth/register"
            className="ml-1 text-brand-primary hover:underline font-medium"
          >
            회원가입
          </Link>
        </div>
      </div>
    </section>
  );
}
