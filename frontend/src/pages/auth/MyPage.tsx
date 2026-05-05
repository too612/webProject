import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function MyPage() {
    const { user, isAuthenticated, logout } = useAuth();

    if (!isAuthenticated) {
        return (
            <section className="bg-white rounded-panel shadow-panel border border-gray-100 p-8 text-center space-y-3">
                <h2 className="text-xl font-bold text-brand-dark">마이페이지</h2>
                <p className="text-sm text-gray-500">로그인이 필요합니다.</p>
                <Link to="/auth/login" className="inline-flex items-center bg-brand-primary text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-[#4e5caf] transition-colors">로그인으로 이동</Link>
            </section>
        );
    }

    return (
        <section className="bg-white rounded-panel shadow-panel border border-gray-100 p-8 space-y-4">
            <h2 className="text-xl font-bold text-brand-dark">마이페이지</h2>
            <p className="text-sm text-gray-600">아이디: {user?.userId}</p>
            <p className="text-sm text-gray-600">이름: {user?.userName ?? user?.username ?? '-'}</p>
            <button type="button" className="inline-flex items-center bg-gray-100 text-gray-700 rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-200 transition-colors" onClick={logout}>로그아웃</button>
        </section>
    );
}
