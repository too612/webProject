import { useEffect, useMemo, useState } from 'react';
import { usePastorProfile } from './pastorHook';
import type { PastorRequest } from './pastorModel';

const INITIAL_FORM: PastorRequest = {
  corpName: '기관정보',
  businessRegistrationNumber: '',
  chiefName: '',
  chiefImagePath: '/img/pastor-profile.svg',
  introduction: '',
  updatedBy: 'system',
  updatedIp: '127.0.0.1',
};

export default function PastorPage() {
  const { profile, loading, error, loadProfile, saveProfile, removeProfile } = usePastorProfile();
  const [isEditMode, setIsEditMode] = useState(false);
  const [form, setForm] = useState<PastorRequest>(INITIAL_FORM);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  useEffect(() => {
    if (!profile) {
      setForm(INITIAL_FORM);
      return;
    }

    setForm({
      corpName: profile.corpName ?? '기관정보',
      businessRegistrationNumber: profile.businessRegistrationNumber ?? '',
      chiefName: profile.chiefName ?? '',
      chiefImagePath: profile.chiefImagePath ?? '/img/pastor-profile.svg',
      phoneNumber: profile.phoneNumber ?? '',
      postalCode: profile.postalCode ?? '',
      addressLine1: profile.addressLine1 ?? '',
      addressLine2: profile.addressLine2 ?? '',
      introduction: profile.introduction ?? '',
      updatedBy: 'system',
      updatedIp: '127.0.0.1',
    });
  }, [profile]);

  const introLines = useMemo(() => {
    if (!profile?.introduction) {
      return [];
    }
    return profile.introduction.split('\n').filter(Boolean);
  }, [profile?.introduction]);

  const validateForm = (payload: PastorRequest): string | null => {
    if (!payload.chiefName.trim()) {
      return '담임목사 이름을 입력해 주세요.';
    }
    if (!payload.businessRegistrationNumber.trim()) {
      return '사업자등록번호를 입력해 주세요.';
    }
    return null;
  };

  const handleInputChange = (key: keyof PastorRequest, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleEditStart = () => {
    setActionMessage(null);
    setIsEditMode(true);
  };

  const handleEditCancel = () => {
    setActionMessage(null);
    setIsEditMode(false);
    if (profile) {
      setForm({
        corpName: profile.corpName ?? '기관정보',
        businessRegistrationNumber: profile.businessRegistrationNumber ?? '',
        chiefName: profile.chiefName ?? '',
        chiefImagePath: profile.chiefImagePath ?? '/img/pastor-profile.svg',
        phoneNumber: profile.phoneNumber ?? '',
        postalCode: profile.postalCode ?? '',
        addressLine1: profile.addressLine1 ?? '',
        addressLine2: profile.addressLine2 ?? '',
        introduction: profile.introduction ?? '',
        updatedBy: 'system',
        updatedIp: '127.0.0.1',
      });
    } else {
      setForm(INITIAL_FORM);
    }
  };

  const handleSave = async () => {
    const validationMessage = validateForm(form);
    if (validationMessage) {
      setActionMessage(validationMessage);
      return;
    }

    try {
      await saveProfile(form);
      setIsEditMode(false);
      setActionMessage('담임목사 정보를 저장했습니다.');
    } catch {
      // usePastorProfile.error에서 메시지를 보여준다.
    }
  };

  const handleDelete = async () => {
    if (!profile?.corpId) {
      return;
    }
    if (!window.confirm('담임목사 정보를 삭제하시겠습니까?')) {
      return;
    }

    try {
      await removeProfile();
      setIsEditMode(false);
      setForm(INITIAL_FORM);
      setActionMessage('담임목사 정보를 삭제했습니다.');
    } catch {
      // usePastorProfile.error에서 메시지를 보여준다.
    }
  };

  return (
    <section className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white shadow-panel p-6 md:p-7 space-y-5">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="space-y-1">
            <p className="text-xs font-semibold tracking-[0.14em] uppercase text-brand-primary/80">교회 소개</p>
            <h2 className="text-2xl md:text-3xl font-bold text-brand-dark">담임목사</h2>
          </div>
          <div className="flex items-center gap-2">
            {!isEditMode && (
              <button
                type="button"
                className="px-4 py-2.5 text-sm rounded-full bg-brand-primary text-white font-semibold hover:bg-brand-primary/90 transition-colors"
                onClick={handleEditStart}
              >
                편집
              </button>
            )}
            {isEditMode && (
              <>
                <button
                  type="button"
                  className="px-4 py-2.5 text-sm rounded-full bg-brand-primary text-white font-semibold hover:bg-brand-primary/90 transition-colors"
                  onClick={handleSave}
                  disabled={loading}
                >
                  저장
                </button>
                <button
                  type="button"
                  className="px-4 py-2.5 text-sm rounded-full border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
                  onClick={handleEditCancel}
                  disabled={loading}
                >
                  취소
                </button>
                {profile?.corpId && (
                  <button
                    type="button"
                    className="px-4 py-2.5 text-sm rounded-full bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors"
                    onClick={handleDelete}
                    disabled={loading}
                  >
                    삭제
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {(error || actionMessage) && (
          <div className={`rounded-xl px-4 py-3 text-sm ${error ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>
            {error ?? actionMessage}
          </div>
        )}

        {!isEditMode && (
          <div className="grid grid-cols-1 md:grid-cols-[1fr_240px] gap-6 items-start rounded-2xl border border-slate-100 bg-slate-50/70 p-5 md:p-6">
            <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
              <p className="inline-flex items-center rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-semibold text-brand-primary">
                담임목사 프로필
              </p>
              <p className="text-lg font-bold text-brand-dark">
                {profile?.chiefName || '담임목사 이름을 등록해 주세요.'}
              </p>
              {introLines.length > 0 ? (
                introLines.map((line, index) => <p key={`${line}-${index}`}>{line}</p>)
              ) : (
                <p>담임목사 소개문이 아직 등록되지 않았습니다.</p>
              )}
            </div>
            <div className="shrink-0 flex justify-center md:justify-end">
              <img
                src={profile?.chiefImagePath || '/img/pastor-profile.svg'}
                alt={profile?.chiefName ? `담임목사 ${profile.chiefName}` : '담임목사 이미지'}
                className="w-56 h-auto rounded-2xl border border-slate-200 bg-white object-cover shadow-sm"
              />
            </div>
          </div>
        )}

        {isEditMode && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-5 md:p-6">
            <label className="space-y-1 text-sm">
              <span className="text-slate-600 font-medium">기관명</span>
              <input
                className="w-full border border-slate-300 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                value={form.corpName}
                onChange={(e) => handleInputChange('corpName', e.target.value)}
              />
            </label>

            <label className="space-y-1 text-sm">
              <span className="text-slate-600 font-medium">사업자등록번호</span>
              <input
                className="w-full border border-slate-300 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                value={form.businessRegistrationNumber}
                onChange={(e) => handleInputChange('businessRegistrationNumber', e.target.value)}
              />
            </label>

            <label className="space-y-1 text-sm">
              <span className="text-slate-600 font-medium">담임목사 이름</span>
              <input
                className="w-full border border-slate-300 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                value={form.chiefName}
                onChange={(e) => handleInputChange('chiefName', e.target.value)}
              />
            </label>

            <label className="space-y-1 text-sm">
              <span className="text-slate-600 font-medium">프로필 이미지 경로</span>
              <input
                className="w-full border border-slate-300 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                value={form.chiefImagePath ?? ''}
                onChange={(e) => handleInputChange('chiefImagePath', e.target.value)}
              />
            </label>

            <label className="space-y-1 text-sm md:col-span-2">
              <span className="text-slate-600 font-medium">소개</span>
              <textarea
                className="w-full border border-slate-300 rounded-xl px-3 py-2.5 min-h-40 bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                value={form.introduction ?? ''}
                onChange={(e) => handleInputChange('introduction', e.target.value)}
              />
            </label>
          </div>
        )}
      </div>
    </section>
  );
}
