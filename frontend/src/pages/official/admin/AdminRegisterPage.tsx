import { FormEvent, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function AdminRegisterPage() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [message, setMessage] = useState('');

  const passwordMatched = useMemo(() => passwordConfirm.length > 0 && password === passwordConfirm, [password, passwordConfirm]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');
    if (userId.trim().length < 4) { setMessage('아이디는 4자 이상이어야 합니다.'); return; }
    if (!passwordMatched || password.length < 6) { setMessage('비밀번호 확인 또는 길이를 확인해 주세요.'); return; }
    if (!agreeTerms) { setMessage('이용약관 동의가 필요합니다.'); return; }
    void userName; void email;
    navigate('/admin/login');
  };

  const inputCls = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/40 focus:border-brand-primary';

  return (
    <div className="min-h-[60vh] flex items-center justify-center py-10">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold text-brand-dark">관리자 등록</h2>
          <p className="text-sm text-gray-500">새로운 관리자 계정을 등록합니다</p>
        </div>
        <div className="bg-white rounded-panel shadow-panel border border-gray-100 p-8 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="admin-user-id" className="text-sm font-medium text-gray-700">아이디</label>
              <input id="admin-user-id" value={userId} onChange={(e) => setUserId(e.target.value)} required className={inputCls} />
            </div>
            <div className="space-y-1">
              <label htmlFor="admin-user-name" className="text-sm font-medium text-gray-700">이름</label>
              <input id="admin-user-name" value={userName} onChange={(e) => setUserName(e.target.value)} required className={inputCls} />
            </div>
            <div className="space-y-1">
              <label htmlFor="admin-email" className="text-sm font-medium text-gray-700">이메일</label>
              <input id="admin-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputCls} />
            </div>
            <div className="space-y-1">
              <label htmlFor="admin-password" className="text-sm font-medium text-gray-700">비밀번호</label>
              <input id="admin-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className={inputCls} />
            </div>
            <div className="space-y-1">
              <label htmlFor="admin-password-confirm" className="text-sm font-medium text-gray-700">비밀번호 확인</label>
              <input id="admin-password-confirm" type="password" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} required className={inputCls} />
              {passwordConfirm.length > 0 && (
                <p className={`text-xs mt-0.5 ${passwordMatched ? 'text-green-600' : 'text-red-500'}`}>
                  {passwordMatched ? '비밀번호가 일치합니다.' : '비밀번호가 일치하지 않습니다.'}
                </p>
              )}
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input id="admin-agree" type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} className="accent-brand-primary w-4 h-4" />
              이용약관에 동의합니다.
            </label>
            {message && <p className="text-xs text-red-600">{message}</p>}
            <button type="submit" className="w-full bg-brand-primary text-white py-2.5 rounded-lg font-medium hover:bg-brand-primary/90 transition-colors">가입하기</button>
          </form>
          <p className="text-center text-sm text-gray-500">
            <Link to="/admin/login" className="text-brand-primary hover:underline">이미 계정이 있으신가요? 로그인</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
