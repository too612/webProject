import { useEffect, useMemo, useState } from 'react';
import { usePastorProfile } from './usePastorProfile';
import type { PastorRequest } from './PastorModel';

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
    <section className="space-y-4">
      <div className="bg-white rounded-panel shadow-panel border border-gray-100 p-6 space-y-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h2 className="text-2xl font-bold text-brand-dark">담임목사</h2>
          <div className="flex items-center gap-2">
            {!isEditMode && (
              <button
                type="button"
                className="px-3 py-2 text-sm rounded-md bg-brand-primary text-white"
                onClick={handleEditStart}
              >
                편집
              </button>
            )}
            {isEditMode && (
              <>
                <button
                  type="button"
                  className="px-3 py-2 text-sm rounded-md bg-brand-primary text-white"
                  onClick={handleSave}
                  disabled={loading}
                >
                  저장
                </button>
                <button
                  type="button"
                  className="px-3 py-2 text-sm rounded-md border border-gray-300 text-gray-700"
                  onClick={handleEditCancel}
                  disabled={loading}
                >
                  취소
                </button>
                {profile?.corpId && (
                  <button
                    type="button"
                    className="px-3 py-2 text-sm rounded-md bg-red-600 text-white"
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
          <div className={`rounded-md px-3 py-2 text-sm ${error ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
            {error ?? actionMessage}
          </div>
        )}

        {!isEditMode && (
          <div className="grid grid-cols-1 md:grid-cols-[1fr_220px] gap-6 items-start">
            <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
              <p className="text-base font-semibold text-brand-primary">
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
                className="w-52 h-auto rounded-lg object-cover"
              />
            </div>
          </div>
        )}

        {isEditMode && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="space-y-1 text-sm">
              <span className="text-gray-600">기관명</span>
              <input
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                value={form.corpName}
                onChange={(e) => handleInputChange('corpName', e.target.value)}
              />
            </label>

            <label className="space-y-1 text-sm">
              <span className="text-gray-600">사업자등록번호</span>
              <input
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                value={form.businessRegistrationNumber}
                onChange={(e) => handleInputChange('businessRegistrationNumber', e.target.value)}
              />
            </label>

            <label className="space-y-1 text-sm">
              <span className="text-gray-600">담임목사 이름</span>
              <input
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                value={form.chiefName}
                onChange={(e) => handleInputChange('chiefName', e.target.value)}
              />
            </label>

            <label className="space-y-1 text-sm">
              <span className="text-gray-600">프로필 이미지 경로</span>
              <input
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                value={form.chiefImagePath ?? ''}
                onChange={(e) => handleInputChange('chiefImagePath', e.target.value)}
              />
            </label>

            <label className="space-y-1 text-sm md:col-span-2">
              <span className="text-gray-600">소개</span>
              <textarea
                className="w-full border border-gray-300 rounded-md px-3 py-2 min-h-40"
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
