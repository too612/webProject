/**
 * File Name   : pastorPage
 * Description : 목회자소개 조회/편집 화면
 * -----------------------------------------------------------------------------
 * React 단일 컴포넌트 기준으로 초기화, 라이프사이클, 로직, 이벤트, 렌더링 섹션을 구분한다.
 */

import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import EditorViewer from '../../../common/editor/editorViewer';
import { Attachment, useAttachment } from '../../../common/attachment';
import { usePastorProfile } from './pastorHook';
import type { PastorDisplayMode, PastorRequest } from './pastorModel';

const LazyEditor = lazy(() => import('../../../common/editor/editor'));

/****************************************************************************************************
 * config/constant method (상수, 타입가드, 값 보정 유틸)
 ****************************************************************************************************/

const DEFAULT_DISPLAY_MODE: PastorDisplayMode = 'split-editor-image';

const isDisplayMode = (value?: string): value is PastorDisplayMode => {
  return value === 'single-image' || value === 'split-editor-image';
};

const resolveDisplayMode = (value?: string): PastorDisplayMode => {
  return isDisplayMode(value) ? value : DEFAULT_DISPLAY_MODE;
};

const buildDownloadUrl = (fileId: string | number) => `/api/common/files/${fileId}/download`;

const INITIAL_FORM: PastorRequest = {
  corpName: '기관정보',
  businessRegistrationNumber: '-',
  chiefName: '담임목사',
  displayMode: DEFAULT_DISPLAY_MODE,
  introduction: '',
  updatedBy: 'system',
};

const INTRO_DESCRIPTION = '말씀과 섬김으로 공동체를 이끄는 담임목사 소개와 사역 방향을 안내합니다.';

/****************************************************************************************************
 * component method (state, hook 초기화)
 ****************************************************************************************************/

export default function PastorPage() {
  const { profile, loading, error, loadProfile, saveProfile, removeProfile } = usePastorProfile();
  const [isEditMode, setIsEditMode] = useState(false);
  const [form, setForm] = useState<PastorRequest>(INITIAL_FORM);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const latestIntroductionRef = useRef<string>(INITIAL_FORM.introduction ?? '');
  const profileImageAttachment = useAttachment();
  const [newImagePreviewUrl, setNewImagePreviewUrl] = useState<string | null>(null);

  const selectedDisplayMode = resolveDisplayMode(form.displayMode);
  const isSingleImageMode = selectedDisplayMode === 'single-image';
  const persistedImageSrc =
    profile?.fileList && profile.fileList.length > 0
      ? buildDownloadUrl(profile.fileList[0].fileId)
      : null;
  const viewImageSrc = isEditMode
    ? (newImagePreviewUrl ??
      (profileImageAttachment.existingFiles.length > 0
        ? buildDownloadUrl(profileImageAttachment.existingFiles[0].fileId)
        : null))
    : persistedImageSrc;

  /****************************************************************************************************
   * initial/lifecycle method (onload 및 데이터 동기화)
   ****************************************************************************************************/

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  useEffect(() => {
    if (!profile) {
      setForm(INITIAL_FORM);
      profileImageAttachment.reset();
      return;
    }

    setForm({
      corpName: profile.corpName ?? '기관정보',
      businessRegistrationNumber: profile.businessRegistrationNumber ?? INITIAL_FORM.businessRegistrationNumber,
      chiefName: profile.chiefName ?? INITIAL_FORM.chiefName,
      displayMode: resolveDisplayMode(profile.displayMode),
      phoneNumber: profile.phoneNumber ?? '',
      postalCode: profile.postalCode ?? '',
      addressLine1: profile.addressLine1 ?? '',
      addressLine2: profile.addressLine2 ?? '',
      introduction: profile.introduction ?? '',
      updatedBy: 'system',
    });
    latestIntroductionRef.current = profile.introduction ?? '';
    profileImageAttachment.reset(profile.fileList ?? []);
  }, [profile]);

  useEffect(() => {
    if (profileImageAttachment.newFiles.length === 0) {
      setNewImagePreviewUrl(null);
      return;
    }

    const previewUrl = URL.createObjectURL(profileImageAttachment.newFiles[0]);
    setNewImagePreviewUrl(previewUrl);

    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [profileImageAttachment.newFiles]);

  /****************************************************************************************************
   * logic method (업무 검증 및 값 계산)
   ****************************************************************************************************/

  const validateForm = (payload: PastorRequest): string | null => {
    // 편집 UI에서 노출하지 않는 필드는 기본값으로 유지하고, 현재 노출 필드만 저장한다.
    if (!payload.corpName?.trim()) {
      payload.corpName = INITIAL_FORM.corpName;
    }
    if (!payload.chiefName?.trim()) {
      payload.chiefName = INITIAL_FORM.chiefName;
    }
    if (!payload.businessRegistrationNumber?.trim()) {
      payload.businessRegistrationNumber = INITIAL_FORM.businessRegistrationNumber;
    }
    return null;
  };

  const handleInputChange = (key: keyof PastorRequest, value: string) => {
    if (key === 'introduction') {
      latestIntroductionRef.current = value;
    }
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  /****************************************************************************************************
   * event method (버튼/저장/삭제/취소 등 사용자 액션)
   ****************************************************************************************************/

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
        businessRegistrationNumber: profile.businessRegistrationNumber ?? INITIAL_FORM.businessRegistrationNumber,
        chiefName: profile.chiefName ?? INITIAL_FORM.chiefName,
        displayMode: resolveDisplayMode(profile.displayMode),
        phoneNumber: profile.phoneNumber ?? '',
        postalCode: profile.postalCode ?? '',
        addressLine1: profile.addressLine1 ?? '',
        addressLine2: profile.addressLine2 ?? '',
        introduction: profile.introduction ?? '',
        updatedBy: 'system',
      });
    } else {
      setForm(INITIAL_FORM);
      profileImageAttachment.reset();
    }
  };

  const handleSave = async () => {
    const payload: PastorRequest = {
      ...form,
      introduction: latestIntroductionRef.current,
    };

    const validationMessage = validateForm(payload);
    if (validationMessage) {
      setActionMessage(validationMessage);
      return;
    }

    if (selectedDisplayMode === 'single-image' && profileImageAttachment.existingFiles.length === 0 && profileImageAttachment.newFiles.length === 0) {
      setActionMessage('단일이미지 모드에서는 이미지를 1개 이상 등록해 주세요.');
      return;
    }

    try {
      await saveProfile(payload, profileImageAttachment.newFiles, profileImageAttachment.deletedFileIds);
      setIsEditMode(false);
      profileImageAttachment.reset();
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

  /****************************************************************************************************
   * render method (조회 모드/편집 모드 UI 렌더링)
   ****************************************************************************************************/

  return (
    <section className="space-y-5">
      <div className="rounded-none border border-slate-200 bg-white shadow-panel p-6 md:p-7 space-y-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-2 border-l-4 border-brand-primary pl-4 md:pl-5">
            <h2 className="text-xl md:text-2xl font-bold text-brand-dark">목회자소개</h2>
            <p className="text-sm text-gray-600 leading-relaxed">{INTRO_DESCRIPTION}</p>
          </div>
          <div className="flex items-center gap-2">
            {!isEditMode && (
              <button
                type="button"
                className="px-4 py-2.5 text-sm rounded-md bg-brand-primary text-white font-semibold hover:bg-brand-primary/90 transition-colors"
                onClick={handleEditStart}
              >
                편집
              </button>
            )}
            {isEditMode && (
              <>
                <button
                  type="button"
                  className="px-4 py-2.5 text-sm rounded-md bg-brand-primary text-white font-semibold hover:bg-brand-primary/90 transition-colors"
                  onClick={handleSave}
                  disabled={loading}
                >
                  저장
                </button>
                <button
                  type="button"
                  className="px-4 py-2.5 text-sm rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
                  onClick={handleEditCancel}
                  disabled={loading}
                >
                  취소
                </button>
                {profile?.corpId && (
                  <button
                    type="button"
                    className="px-4 py-2.5 text-sm rounded-md bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors"
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
          <div className={`rounded-none px-4 py-3 text-sm ${error ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>
            {error ?? actionMessage}
          </div>
        )}

        {!isEditMode && (
          <>
            {isSingleImageMode ? (
              <div className="rounded-none border border-slate-100 bg-slate-50/70 p-5 md:p-6">
                {viewImageSrc ? (
                  <img
                    src={viewImageSrc}
                    alt="목회자 소개 이미지"
                    className="w-full h-auto max-h-[720px] rounded-none border border-slate-200 bg-white object-contain shadow-sm"
                  />
                ) : (
                  <div className="w-full min-h-56 rounded-none border border-dashed border-slate-300 bg-white text-slate-500 text-sm flex items-center justify-center">
                    등록된 단일 소개 이미지가 없습니다.
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-[1fr_240px] gap-6 items-start rounded-none border border-slate-100 bg-slate-50/70 p-5 md:p-6">
                <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
                  <EditorViewer value={profile?.introduction ?? ''} emptyText="담임목사 소개문이 아직 등록되지 않았습니다." />
                </div>
                <div className="shrink-0 flex justify-center md:justify-end">
                  {viewImageSrc ? (
                    <img
                      src={viewImageSrc}
                      alt={profile?.chiefName ? `담임목사 ${profile.chiefName}` : '담임목사 이미지'}
                      className="w-56 h-auto rounded-none border border-slate-200 bg-white object-cover shadow-sm"
                    />
                  ) : (
                    <div className="w-56 min-h-56 rounded-none border border-dashed border-slate-300 bg-white text-slate-500 text-sm flex items-center justify-center">
                      등록된 목사 이미지가 없습니다.
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {isEditMode && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-none border border-slate-100 bg-slate-50/60 p-5 md:p-6">
            <div className="space-y-2 text-sm md:col-span-2">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <span className="text-slate-700 font-semibold">노출 방식 선택</span>
                <span className="text-xs text-slate-500">운영 편의에 맞는 방식으로 선택하세요.</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className={`flex items-start gap-3 rounded-md border bg-white px-4 py-3 cursor-pointer transition-colors ${selectedDisplayMode === 'single-image' ? 'border-brand-primary bg-brand-primary/5' : 'border-slate-200 hover:border-slate-300'}`}>
                  <input
                    type="radio"
                    name="displayMode"
                    value="single-image"
                    checked={selectedDisplayMode === 'single-image'}
                    onChange={(event) => handleInputChange('displayMode', event.target.value)}
                    className="mt-0.5"
                  />
                  <span className="leading-relaxed">
                    <span className="font-semibold text-slate-800">통합 이미지형</span>
                    <span className="block text-slate-500 text-xs mt-1">교회소개와 담임목사 내용을 이미지 1장으로 등록해 전체 영역에 크게 노출합니다.</span>
                  </span>
                </label>
                <label className={`flex items-start gap-3 rounded-md border bg-white px-4 py-3 cursor-pointer transition-colors ${selectedDisplayMode === 'split-editor-image' ? 'border-brand-primary bg-brand-primary/5' : 'border-slate-200 hover:border-slate-300'}`}>
                  <input
                    type="radio"
                    name="displayMode"
                    value="split-editor-image"
                    checked={selectedDisplayMode === 'split-editor-image'}
                    onChange={(event) => handleInputChange('displayMode', event.target.value)}
                    className="mt-0.5"
                  />
                  <span className="leading-relaxed">
                    <span className="font-semibold text-slate-800">분리 편집형</span>
                    <span className="block text-slate-500 text-xs mt-1">소개글은 직접 편집하고, 담임목사 이미지는 별도로 업로드해 현재 레이아웃으로 노출합니다.</span>
                  </span>
                </label>
              </div>
            </div>

            {selectedDisplayMode === 'split-editor-image' && (
              <div className="space-y-1 text-sm md:col-span-2">
                <span className="text-slate-600 font-medium">소개</span>
                <Suspense fallback={<div className="w-full min-h-40 border border-slate-300 rounded-none bg-white px-3 py-2.5 text-sm text-slate-500">에디터 불러오는 중...</div>}>
                  <LazyEditor
                    value={form.introduction ?? ''}
                    onChange={(nextValue) => handleInputChange('introduction', nextValue)}
                  />
                </Suspense>
              </div>
            )}

            <div className="space-y-1 text-sm md:col-span-2">
              <span className="text-slate-600 font-medium">
                {selectedDisplayMode === 'single-image' ? '단일 소개 이미지' : '담임목사 이미지'}
              </span>
              <Attachment
                existingFiles={profileImageAttachment.existingFiles}
                newFiles={profileImageAttachment.newFiles}
                onAdd={(files) => profileImageAttachment.addFiles(files)}
                onRemoveExisting={(fileId) => profileImageAttachment.removeExisting(fileId)}
                onRemoveNew={(index) => profileImageAttachment.removeNew(index)}
                accept="image/*"
                maxFiles={1}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
