import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [keepLogin, setKeepLogin] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    if (username.trim().length < 3 || password.trim().length < 4) {
      setError('아이디와 비밀번호를 확인해 주세요.');
      return;
    }
    void keepLogin;
    navigate('/admin/admin');
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center py-10">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold text-brand-dark">관리자 로그인</h2>
          <p className="text-sm text-gray-500">관리자 계정으로 로그인하세요</p>
        </div>
        <div className="bg-white rounded-panel shadow-panel border border-gray-100 p-8 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="admin-username" className="text-sm font-medium text-gray-700">아이디</label>
              <input id="admin-username" value={username} onChange={(e) => setUsername(e.target.value)} required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/40 focus:border-brand-primary" />
            </div>
            <div className="space-y-1">
              <label htmlFor="admin-password" className="text-sm font-medium text-gray-700">비밀번호</label>
              <input id="admin-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/40 focus:border-brand-primary" />
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input id="keep-login" type="checkbox" checked={keepLogin} onChange={(e) => setKeepLogin(e.target.checked)} className="accent-brand-primary w-4 h-4" />
              로그인 상태 유지
            </label>
            {error && <p className="text-xs text-red-600">{error}</p>}
            <button type="submit" className="w-full bg-brand-primary text-white py-2.5 rounded-lg font-medium hover:bg-brand-primary/90 transition-colors">로그인</button>
          </form>
          <p className="text-center text-sm text-gray-500">
            <Link to="/admin/register" className="text-brand-primary hover:underline">관리자 계정 생성</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
