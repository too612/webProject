import { FormEvent, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authApi } from '../../api/authApi';
import { useAuth } from '../../hooks/useAuth';

type LoginLocationState = {
    from?: string;
    registeredMessage?: string;
} | null;

export default function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const locationState = location.state as LoginLocationState;
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState(locationState?.registeredMessage ?? '');
    const [feedbackType, setFeedbackType] = useState<'success' | 'error'>(locationState?.registeredMessage ? 'success' : 'error');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const backendOrigin = import.meta.env.VITE_BACKEND_ORIGIN
        ?? (window.location.port === '5173' ? 'http://localhost:8080' : window.location.origin);

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
            const result = await authApi.login({ username, password, rememberMe });

            login({
                userId: result.userId,
                userName: result.username,
                username: result.username,
            }, result.token ?? null);

            const nextPath = locationState?.from ?? '/';
            navigate(nextPath, { replace: true });
        } catch (error) {
            setFeedbackType('error');
            setFeedbackMessage(error instanceof Error ? error.message : '아이디 또는 비밀번호를 확인해 주세요.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section>
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-brand-dark">로그인</h2>
                <p className="text-sm text-gray-400 mt-1">다사랑교회에 오신 것을 환영합니다</p>
            </div>

            {feedbackMessage && (
                <div className={`text-sm rounded-lg px-4 py-3 mb-4 ${feedbackType === 'success' ? 'text-green-700 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                    {feedbackMessage}
                </div>
            )}

            <form className="space-y-4" onSubmit={onSubmit}>
                <div className="space-y-1">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">아이디</label>
                    <input
                        id="username"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        placeholder="아이디를 입력하세요"
                        required
                    />
                </div>

                <div className="space-y-1">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">비밀번호</label>
                    <input
                        id="password"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="비밀번호를 입력하세요"
                        required
                    />
                </div>

                <div className="flex items-center justify-between">
                    <label className="inline-flex items-center gap-2 text-sm text-gray-600" htmlFor="rememberMe">
                        <input
                            id="rememberMe"
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(event) => setRememberMe(event.target.checked)}
                        />
                        <span>로그인 상태 유지</span>
                    </label>
                    <div className="flex gap-3 text-sm">
                        <a href={`${backendOrigin}/user/find-id`} className="text-brand-primary hover:underline">아이디 찾기</a>
                        <a href={`${backendOrigin}/user/find-password`} className="text-brand-primary hover:underline">비밀번호 찾기</a>
                    </div>
                </div>

                <button className="w-full bg-brand-primary text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-[#4e5caf] disabled:opacity-40 transition-colors" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? '로그인 중...' : '로그인'}
                </button>
            </form>

            <div className="relative flex items-center my-4 text-sm text-gray-400">
                <div className="flex-1 border-t border-gray-200" />
                <span className="px-3">또는</span>
                <div className="flex-1 border-t border-gray-200" />
            </div>

            <div className="text-sm text-center text-gray-500">
                아직 회원이 아니신가요?
                <Link to="/auth/register" className="ml-1 text-brand-primary hover:underline font-medium">회원가입</Link>
            </div>
        </section>
    );
}
