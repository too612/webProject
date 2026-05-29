import { Link } from 'react-router-dom';
import { useRegister } from './registerHook';

export default function RegisterPage() {
  const {
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
  } = useRegister();

  return (
    <section>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-brand-dark">회원가입</h2>
        <p className="text-sm text-gray-400 mt-1">다사랑교회의 회원이 되어 다양한 서비스를 이용하세요</p>
      </div>

      {message && <div className={`text-sm rounded-lg px-4 py-3 mb-4 ${messageType === 'success' ? 'text-green-700 bg-green-50' : 'text-red-600 bg-red-50'}`}>{message}</div>}

      <form className="space-y-4" onSubmit={onSubmit}>
        <div className="flex items-end gap-2">
          <div className="space-y-1 flex-1">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">아이디<span className="text-red-500">*</span></label>
            <input
              id="username"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
              value={username}
              onChange={(event) => {
                onUsernameChange(event.target.value);
              }}
              placeholder="4-20자의 영문, 숫자"
              required
              maxLength={20}
            />
            <span className="text-xs text-gray-400">영문, 숫자 조합 4-20자</span>
            {userIdValidation && <span className={`text-xs mt-0.5 ${userIdValidationType === 'success' ? 'text-green-600' : 'text-red-600'}`}>{userIdValidation}</span>}
          </div>
          <button className="shrink-0 bg-gray-100 text-gray-700 rounded-lg px-3 py-2 text-sm border border-gray-200 hover:bg-gray-200 transition-colors" type="button" onClick={handleCheckUserId}>중복확인</button>
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">비밀번호<span className="text-red-500">*</span></label>
          <input
            id="password"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="8자 이상의 영문, 숫자, 특수문자 조합"
            required
            maxLength={20}
          />
          <span className="text-xs text-gray-400">8-20자의 영문, 숫자, 특수문자 조합</span>
          {passwordValidation.text && <span className={`text-xs mt-0.5 ${passwordValidation.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>{passwordValidation.text}</span>}
        </div>

        <div className="space-y-1">
          <label htmlFor="passwordConfirm" className="block text-sm font-medium text-gray-700">비밀번호 확인<span className="text-red-500">*</span></label>
          <input
            id="passwordConfirm"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
            type="password"
            value={passwordConfirm}
            onChange={(event) => setPasswordConfirm(event.target.value)}
            placeholder="비밀번호를 한번 더 입력하세요"
            required
            maxLength={20}
          />
          {passwordConfirmValidation.text && <span className={`text-xs mt-0.5 ${passwordConfirmValidation.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>{passwordConfirmValidation.text}</span>}
        </div>

        <div className="space-y-1">
          <label htmlFor="userName" className="block text-sm font-medium text-gray-700">이름<span className="text-red-500">*</span></label>
          <input
            id="userName"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
            value={userName}
            onChange={(event) => setUserName(event.target.value)}
            placeholder="이름을 입력하세요"
            required
          />
        </div>

        <div className="flex items-end gap-2">
          <div className="space-y-1 flex-1">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">이메일<span className="text-red-500">*</span></label>
            <input
              id="email"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
              type="email"
              value={email}
              onChange={(event) => {
                onEmailChange(event.target.value);
              }}
              placeholder="example@email.com"
              required
              maxLength={100}
            />
            {emailValidation && <span className={`text-xs mt-0.5 ${emailValidationType === 'success' ? 'text-green-600' : 'text-red-600'}`}>{emailValidation}</span>}
          </div>
          <button className="shrink-0 bg-gray-100 text-gray-700 rounded-lg px-3 py-2 text-sm border border-gray-200 hover:bg-gray-200 transition-colors" type="button" onClick={handleCheckEmail}>중복확인</button>
        </div>

        <div className="space-y-1">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">휴대폰 번호<span className="text-red-500">*</span></label>
          <input
            id="phone"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
            type="tel"
            value={phone}
            onChange={(event) => setPhone(formatPhoneNumber(event.target.value))}
            placeholder="010-0000-0000"
            required
            maxLength={13}
          />
          <span className="text-xs text-gray-400">숫자만 입력하시면 자동으로 하이픈(-)이 추가됩니다</span>
        </div>

        <div className="space-y-1">
          <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">생년월일</label>
          <input
            id="birthDate"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
            type="date"
            value={birthDate}
            onChange={(event) => setBirthDate(event.target.value)}
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700">성별</label>
          <select id="gender" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" value={gender} onChange={(event) => setGender(event.target.value as 'M' | 'F' | '')}>
            <option value="">선택안함</option>
            <option value="M">남성</option>
            <option value="F">여성</option>
          </select>
        </div>

        <div className="space-y-2 border border-gray-200 rounded-lg p-4">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700" htmlFor="agreeAll">
            <input
              id="agreeAll"
              type="checkbox"
              checked={agreeAll}
              onChange={(event) => handleToggleAgreeAll(event.target.checked)}
            />
            <span>전체 약관에 동의합니다</span>
          </label>

          <label className="flex items-center gap-2 text-sm text-gray-700" htmlFor="agreeTerms">
            <input
              id="agreeTerms"
              type="checkbox"
              checked={agreeTerms}
              onChange={(event) => setAgreeTerms(event.target.checked)}
            />
            <span>이용약관 동의 (필수)<span className="text-red-500">*</span></span>
          </label>

          <label className="flex items-center gap-2 text-sm text-gray-700" htmlFor="agreePrivacy">
            <input
              id="agreePrivacy"
              type="checkbox"
              checked={agreePrivacy}
              onChange={(event) => setAgreePrivacy(event.target.checked)}
            />
            <span>개인정보 수집 및 이용 동의 (필수)<span className="text-red-500">*</span></span>
          </label>

          <label className="flex items-center gap-2 text-sm text-gray-700" htmlFor="agreeMarketing">
            <input
              id="agreeMarketing"
              type="checkbox"
              checked={agreeMarketing}
              onChange={(event) => setAgreeMarketing(event.target.checked)}
            />
            <span>마케팅 정보 수신 동의 (선택)</span>
          </label>
        </div>

        <button className="w-full bg-brand-primary text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-[#4e5caf] disabled:opacity-40 transition-colors" type="submit" disabled={isSubmitting}>
          {isSubmitting ? '회원가입 처리 중...' : '회원가입'}
        </button>
      </form>

      <div className="text-sm text-center text-gray-500 mt-4">
        이미 회원이신가요?
        <Link to="/auth/login" className="ml-1 text-brand-primary hover:underline font-medium">로그인</Link>
      </div>
    </section>
  );
}
