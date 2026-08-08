import { Link } from "react-router-dom";
import { Alert, AlertDescription, Input } from "../../common/ui";
import { useRegister } from "./registerHook";

export default function RegisterPage() {
  const {
    username,
    userName,
    email,
    phone,
    postalCode,
    addressLine1,
    addressLine2,
    password,
    passwordConfirm,
    birthDate,
    gender,
    agreeTerms,
    agreePrivacy,
    agreeMarketing,
    userIdValidation,
    userIdValidationType,
    isCheckingUserId,
    emailValidation,
    emailValidationType,
    isCheckingEmail,
    passwordValidation,
    passwordConfirmValidation,
    agreeAll,
    isLoadingTerms,
    termsPolicies,
    message,
    messageType,
    isSubmitting,
    setUserName,
    setPassword,
    setPasswordConfirm,
    setBirthDate,
    setGender,
    setAddressLine2,
    setAgreeTerms,
    setAgreePrivacy,
    setAgreeMarketing,
    setPhone,
    onUsernameChange,
    onEmailChange,
    formatPhoneNumber,
    handleCheckUserId,
    handleCheckEmail,
    handleSearchAddress,
    handleToggleAgreeAll,
    onSubmit,
  } = useRegister();

  const terms = termsPolicies.TERMS;
  const privacy = termsPolicies.PRIVACY;
  const marketing = termsPolicies.MARKETING;

  return (
    <section className="w-full max-w-2xl">
      <div className="rounded-none border border-slate-200 bg-white shadow-panel p-6 md:p-7 space-y-6">
        <div className="space-y-2 pb-4 border-b border-slate-200">
          <h2 className="text-xl md:text-2xl font-bold text-brand-dark">
            회원가입
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            기본 정보를 입력하고 계정을 생성해 주세요.
          </p>
        </div>

        {message && (
          <Alert
            variant={messageType === "success" ? "success" : "destructive"}
          >
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <form className="space-y-6" onSubmit={onSubmit}>
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
              계정 정보
            </h3>
            <div className="space-y-1.5">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                아이디<span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2 items-start">
                <div className="space-y-1.5">
                  <Input
                    id="username"
                    value={username}
                    onChange={(event) => {
                      onUsernameChange(event.target.value);
                    }}
                    placeholder="4-20자의 영문, 숫자"
                    required
                    maxLength={20}
                  />
                  <span className="text-xs text-gray-500">
                    영문, 숫자 조합 4-20자
                  </span>
                  {userIdValidation && (
                    <span
                      className={`text-xs mt-0.5 ${userIdValidationType === "success" ? "text-green-600" : "text-red-600"}`}
                    >
                      {userIdValidation}
                    </span>
                  )}
                </div>
                <button
                  className="h-[42px] shrink-0 bg-slate-100 text-slate-700 rounded-md px-3 text-sm border border-slate-200 hover:bg-slate-200 transition-colors"
                  type="button"
                  onClick={handleCheckUserId}
                  disabled={isCheckingUserId}
                >
                  {isCheckingUserId ? "확인중..." : "중복확인"}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                비밀번호<span className="text-red-500">*</span>
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="8자 이상의 영문, 숫자, 특수문자 조합"
                required
                maxLength={20}
              />
              <span className="text-xs text-gray-500">
                8-20자의 영문, 숫자, 특수문자 조합
              </span>
              {passwordValidation.text && (
                <span
                  className={`text-xs mt-0.5 ${passwordValidation.type === "success" ? "text-green-600" : "text-red-600"}`}
                >
                  {passwordValidation.text}
                </span>
              )}
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="passwordConfirm"
                className="block text-sm font-medium text-gray-700"
              >
                비밀번호 확인<span className="text-red-500">*</span>
              </label>
              <Input
                id="passwordConfirm"
                type="password"
                value={passwordConfirm}
                onChange={(event) => setPasswordConfirm(event.target.value)}
                placeholder="비밀번호를 한번 더 입력하세요"
                required
                maxLength={20}
              />
              {passwordConfirmValidation.text && (
                <span
                  className={`text-xs mt-0.5 ${passwordConfirmValidation.type === "success" ? "text-green-600" : "text-red-600"}`}
                >
                  {passwordConfirmValidation.text}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-4 pt-1">
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
              개인 정보
            </h3>

            <div className="space-y-1.5">
              <label
                htmlFor="userName"
                className="block text-sm font-medium text-gray-700"
              >
                이름<span className="text-red-500">*</span>
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
                이메일<span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2 items-start">
                <div className="space-y-1.5">
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => {
                      onEmailChange(event.target.value);
                    }}
                    placeholder="example@email.com"
                    required
                    maxLength={100}
                  />
                  {emailValidation && (
                    <span
                      className={`text-xs mt-0.5 ${emailValidationType === "success" ? "text-green-600" : "text-red-600"}`}
                    >
                      {emailValidation}
                    </span>
                  )}
                </div>
                <button
                  className="h-[42px] shrink-0 bg-slate-100 text-slate-700 rounded-md px-3 text-sm border border-slate-200 hover:bg-slate-200 transition-colors"
                  type="button"
                  onClick={handleCheckEmail}
                  disabled={isCheckingEmail}
                >
                  {isCheckingEmail ? "확인중..." : "중복확인"}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                휴대폰 번호<span className="text-red-500">*</span>
              </label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(event) =>
                  setPhone(formatPhoneNumber(event.target.value))
                }
                placeholder="010-0000-0000"
                required
                maxLength={13}
              />
              <span className="text-xs text-gray-500">
                숫자만 입력하시면 자동으로 하이픈(-)이 추가됩니다
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="birthDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  생년월일
                </label>
                <Input
                  id="birthDate"
                  type="date"
                  value={birthDate ?? ""}
                  onChange={(e) => setBirthDate(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium text-gray-700"
                >
                  성별
                </label>
                <select
                  id="gender"
                  className="w-full border border-slate-200 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white"
                  value={gender}
                  onChange={(event) =>
                    setGender(event.target.value as "M" | "F" | "")
                  }
                >
                  <option value="">선택안함</option>
                  <option value="M">남성</option>
                  <option value="F">여성</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                주소
              </label>
              <div className="flex items-end gap-2">
                <div className="space-y-1.5 flex-1">
                  <label
                    htmlFor="postalCode"
                    className="block text-xs text-gray-500"
                  >
                    우편번호
                  </label>
                  <Input
                    id="postalCode"
                    value={postalCode}
                    placeholder="우편번호 검색"
                    className="bg-muted"
                    readOnly
                  />
                </div>
                <button
                  type="button"
                  className="shrink-0 bg-slate-100 text-slate-700 rounded-md px-3 py-2.5 text-sm border border-slate-200 hover:bg-slate-200 transition-colors"
                  onClick={handleSearchAddress}
                >
                  주소 검색
                </button>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="addressLine1"
                  className="block text-xs text-gray-500"
                >
                  기본 주소
                </label>
                <Input
                  id="addressLine1"
                  value={addressLine1}
                  placeholder="주소 검색으로 입력됩니다"
                  className="bg-muted"
                  readOnly
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="addressLine2"
                  className="block text-xs text-gray-500"
                >
                  상세 주소
                </label>
                <Input
                  id="addressLine2"
                  value={addressLine2}
                  onChange={(event) => setAddressLine2(event.target.value)}
                  placeholder="동/호수 등 상세 주소를 입력하세요"
                  maxLength={255}
                />
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-1">
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
              약관 동의
            </h3>
            <div className="space-y-3 border border-slate-200 rounded-md p-4 bg-slate-50/50">
              <label
                className="flex items-center gap-2 text-sm font-semibold text-gray-700"
                htmlFor="agreeAll"
              >
                <input
                  id="agreeAll"
                  type="checkbox"
                  checked={agreeAll}
                  onChange={(event) =>
                    handleToggleAgreeAll(event.target.checked)
                  }
                />
                <span>전체 약관에 동의합니다</span>
              </label>

              <div className="rounded-md border border-slate-200 bg-white p-3 space-y-2">
                <label
                  className="flex items-center gap-2 text-sm text-gray-700 font-medium"
                  htmlFor="agreeTerms"
                >
                  <input
                    id="agreeTerms"
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(event) => setAgreeTerms(event.target.checked)}
                  />
                  <span>
                    이용약관 동의 (필수)<span className="text-red-500">*</span>
                  </span>
                </label>
                <div className="text-xs text-gray-600 leading-relaxed bg-slate-50 border border-slate-200 rounded p-2.5 max-h-24 overflow-y-auto">
                  {isLoadingTerms
                    ? "약관 정보를 불러오는 중입니다."
                    : (terms?.content ??
                      "회원가입 시 제공되는 계정 정보는 서비스 운영 및 본인 확인 목적에 한해 사용됩니다. 비정상적인 접근 또는 타인 명의 도용이 확인될 경우 계정 이용이 제한될 수 있습니다. 서비스 정책 위반 시 게시물 또는 계정이 제한될 수 있으며, 관련 절차는 운영 정책을 따릅니다.")}
                </div>
              </div>

              <div className="rounded-md border border-slate-200 bg-white p-3 space-y-2">
                <label
                  className="flex items-center gap-2 text-sm text-gray-700 font-medium"
                  htmlFor="agreePrivacy"
                >
                  <input
                    id="agreePrivacy"
                    type="checkbox"
                    checked={agreePrivacy}
                    onChange={(event) => setAgreePrivacy(event.target.checked)}
                  />
                  <span>
                    개인정보 수집 및 이용 동의 (필수)
                    <span className="text-red-500">*</span>
                  </span>
                </label>
                <div className="text-xs text-gray-600 leading-relaxed bg-slate-50 border border-slate-200 rounded p-2.5 max-h-24 overflow-y-auto">
                  {isLoadingTerms
                    ? "약관 정보를 불러오는 중입니다."
                    : (privacy?.content ??
                      "수집 항목: 아이디, 이름, 이메일, 휴대폰 번호, 주소(선택 입력 항목 포함). 이용 목적: 회원 식별, 공지 전달, 문의 응대, 서비스 제공 및 품질 개선. 보관 기간: 관계 법령 또는 내부 정책에 따른 보관 기간 경과 시 지체 없이 파기합니다.")}
                </div>
              </div>

              <div className="rounded-md border border-slate-200 bg-white p-3 space-y-2">
                <label
                  className="flex items-center gap-2 text-sm text-gray-700 font-medium"
                  htmlFor="agreeMarketing"
                >
                  <input
                    id="agreeMarketing"
                    type="checkbox"
                    checked={agreeMarketing}
                    onChange={(event) =>
                      setAgreeMarketing(event.target.checked)
                    }
                  />
                  <span>마케팅 정보 수신 동의 (선택)</span>
                </label>
                <div className="text-xs text-gray-600 leading-relaxed bg-slate-50 border border-slate-200 rounded p-2.5 max-h-24 overflow-y-auto">
                  {isLoadingTerms
                    ? "약관 정보를 불러오는 중입니다."
                    : (marketing?.content ??
                      "행사, 소식, 이벤트 정보를 이메일 또는 문자로 받아볼 수 있습니다. 선택 항목이므로 동의하지 않아도 회원가입 및 기본 서비스 이용에는 제한이 없습니다. 수신 동의는 마이페이지에서 언제든지 변경할 수 있습니다.")}
                </div>
              </div>
            </div>
          </div>

          <button
            className="w-full bg-brand-primary text-white rounded-md py-2.5 text-sm font-semibold hover:bg-brand-primary/90 disabled:opacity-40 transition-colors"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "회원가입 처리 중..." : "회원가입"}
          </button>

          <div className="text-sm text-center text-gray-500">
            이미 회원이신가요?
            <Link
              to="/auth/login"
              className="ml-1 text-brand-primary hover:underline font-medium"
            >
              로그인
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
}
