import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { managerApi } from "./managerApi";
import { focusFirstInvalid, type FieldErrors } from "../../../common/ui/form/formValidation";
import type { ManagerBasicInfoRequest, ManagerPersonDetail, ManagerRow } from "./managerModel";
import {
  equalManagerBasicInfo,
  normalizeManagerBasicInfo,
  toManagerBasicInfo,
  validateManagerBasicInfo,
  validateProfilePhoto,
} from "./managerValidation";

const EMPTY_BASIC: ManagerBasicInfoRequest = {
  nameKo: "", nameEn: "", nameHanja: "", birthDate: "", genderCode: "",
  postalCode: "", addressLine1: "", addressLine2: "",
};

type Options = {
  person: ManagerPersonDetail | null;
  onPersonUpdated: (person: ManagerPersonDetail) => void;
  onRowUpdated: (personKey: string, patch: Partial<ManagerRow>) => void;
};

/** 성도 상세의 기본정보 저장과 프로필 사진 추가·삭제·적용 상태를 관리한다. */
export function useManagerEdit({ person, onPersonUpdated, onRowUpdated }: Options) {
  const personKey = person?.personKey ?? null;
  const currentKey = useRef(personKey);
  currentKey.current = personKey;
  const personRef = useRef(person);
  personRef.current = person;

  const [basicBase, setBasicBase] = useState<ManagerBasicInfoRequest>(EMPTY_BASIC);
  const [basicForm, setBasicForm] = useState<ManagerBasicInfoRequest>(EMPTY_BASIC);
  const [basicErrors, setBasicErrors] = useState<FieldErrors<ManagerBasicInfoRequest>>({});
  const [basicError, setBasicError] = useState("");
  const [basicMessage, setBasicMessage] = useState("");
  const [basicSaving, setBasicSaving] = useState(false);
  const basicInFlight = useRef(false);

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoRemove, setPhotoRemove] = useState(false);
  const [photoError, setPhotoError] = useState("");
  const [photoMessage, setPhotoMessage] = useState("");
  const [photoSaving, setPhotoSaving] = useState(false);
  const photoInFlight = useRef(false);

  const clearPhotoDraft = useCallback(() => {
    setPhotoFile(null);
    setPhotoPreview(null);
    setPhotoRemove(false);
    setPhotoError("");
  }, []);

  const reset = useCallback(() => {
    const current = personRef.current;
    const base = current ? toManagerBasicInfo(current) : EMPTY_BASIC;
    setBasicBase(base);
    setBasicForm(base);
    setBasicErrors({});
    setBasicError("");
    setBasicMessage("");
    setPhotoMessage("");
    clearPhotoDraft();
  }, [clearPhotoDraft]);

  // 사진만 바뀐 응답으로 편집 중인 기본정보가 초기화되지 않도록 대상이 바뀔 때만 초기화한다.
  useEffect(reset, [personKey, reset]);

  useEffect(() => () => {
    if (photoPreview) URL.revokeObjectURL(photoPreview);
  }, [photoPreview]);

  const basicDirty = !equalManagerBasicInfo(basicForm, basicBase);
  const photoDirty = photoFile !== null || photoRemove;

  const updateBasic = useCallback((key: keyof ManagerBasicInfoRequest, value: string) => {
    setBasicForm((current) => ({ ...current, [key]: value }));
    setBasicErrors((current) => ({ ...current, [key]: undefined }));
    setBasicError("");
    setBasicMessage("");
  }, []);

  const cancelBasic = useCallback(() => {
    setBasicForm(basicBase);
    setBasicErrors({});
    setBasicError("");
  }, [basicBase]);

  const submitBasic = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!personKey || basicInFlight.current) return;
    const errors = validateManagerBasicInfo(basicForm);
    setBasicErrors(errors);
    if (Object.keys(errors).length > 0) {
      const form = event.currentTarget;
      setBasicError("입력 내용을 확인하세요.");
      requestAnimationFrame(() => focusFirstInvalid(form));
      return;
    }
    if (!basicDirty) return;
    basicInFlight.current = true;
    setBasicSaving(true);
    setBasicError("");
    setBasicMessage("");
    try {
      const saved = await managerApi.updateBasicInfo(personKey, normalizeManagerBasicInfo(basicForm));
      if (currentKey.current !== personKey) return;
      const base = toManagerBasicInfo(saved);
      setBasicBase(base);
      setBasicForm(base);
      setBasicMessage("기본정보를 저장했습니다.");
      onPersonUpdated(saved);
      onRowUpdated(personKey, { nameKo: saved.nameKo, nameEn: saved.nameEn });
    } catch (error) {
      if (currentKey.current !== personKey) return;
      setBasicError(error instanceof Error ? error.message : "기본정보 저장에 실패했습니다.");
    } finally {
      basicInFlight.current = false;
      setBasicSaving(false);
    }
  }, [personKey, basicForm, basicDirty, onPersonUpdated, onRowUpdated]);

  const choosePhoto = useCallback((file: File | null | undefined) => {
    if (!file) return;
    const error = validateProfilePhoto(file);
    setPhotoMessage("");
    if (error) {
      setPhotoError(error);
      return;
    }
    setPhotoError("");
    setPhotoRemove(false);
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }, []);

  const markPhotoRemove = useCallback(() => {
    setPhotoFile(null);
    setPhotoPreview(null);
    setPhotoError("");
    setPhotoMessage("");
    setPhotoRemove(Boolean(person?.profilePhotoUrl));
  }, [person?.profilePhotoUrl]);

  const applyPhoto = useCallback(async () => {
    if (!personKey || !person || photoInFlight.current || (!photoFile && !photoRemove)) return;
    photoInFlight.current = true;
    setPhotoSaving(true);
    setPhotoError("");
    try {
      const result = photoFile
        ? await managerApi.uploadProfilePhoto(personKey, photoFile)
        : await managerApi.deleteProfilePhoto(personKey);
      if (currentKey.current !== personKey) return;
      const profilePhotoUrl = result.profilePhotoUrl ?? null;
      clearPhotoDraft();
      setPhotoMessage(profilePhotoUrl ? "프로필 사진을 적용했습니다." : "프로필 사진을 삭제했습니다.");
      onPersonUpdated({ ...person, profilePhotoUrl });
      onRowUpdated(personKey, { profilePhotoUrl });
    } catch (error) {
      if (currentKey.current !== personKey) return;
      setPhotoError(error instanceof Error ? error.message : "프로필 사진 적용에 실패했습니다.");
    } finally {
      photoInFlight.current = false;
      setPhotoSaving(false);
    }
  }, [personKey, person, photoFile, photoRemove, clearPhotoDraft, onPersonUpdated, onRowUpdated]);

  const displayPhotoUrl = photoPreview ?? (photoRemove ? null : person?.profilePhotoUrl ?? null);

  return {
    dirty: basicDirty || photoDirty,
    reset,
    basicForm,
    basicErrors,
    basicError,
    basicMessage,
    basicSaving,
    basicDirty,
    updateBasic,
    cancelBasic,
    submitBasic,
    photoFile,
    photoRemove,
    photoDirty,
    photoError,
    photoMessage,
    photoSaving,
    displayPhotoUrl,
    choosePhoto,
    markPhotoRemove,
    cancelPhoto: clearPhotoDraft,
    applyPhoto,
  };
}

export type ManagerEditState = ReturnType<typeof useManagerEdit>;
