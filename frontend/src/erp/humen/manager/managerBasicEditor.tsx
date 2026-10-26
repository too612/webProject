import { useId, useRef } from "react";
import { ImageIcon } from "lucide-react";
import { Button, CodeSelect, FormField, Input } from "../../../common/ui";
import { GENDER_OPTIONS, PROFILE_PHOTO_ACCEPT, type ManagerPersonDetail } from "./managerModel";
import type { ManagerEditState } from "./managerEditHook";

const TEXT_FIELDS = [
  { field: "nameKo", label: "성명", required: true, maxLength: 100 },
  { field: "nameEn", label: "영문 성명", required: false, maxLength: 100 },
  { field: "nameHanja", label: "한자 성명", required: false, maxLength: 100 },
] as const;

const ADDRESS_FIELDS = [
  { field: "postalCode", label: "우편번호", maxLength: 10, wide: false },
  { field: "addressLine1", label: "주소", maxLength: 255, wide: true },
  { field: "addressLine2", label: "상세 주소", maxLength: 255, wide: true },
] as const;

export function ManagerProfilePhotoEditor({ person, edit }: Readonly<{
  person: ManagerPersonDetail;
  edit: ManagerEditState;
}>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const busy = edit.photoSaving;
  const status = edit.photoFile
    ? `적용 대기: ${edit.photoFile.name}`
    : edit.photoRemove ? "삭제 대기: 적용하면 사진 연결이 해제됩니다." : undefined;

  return (
    <section aria-label="프로필 사진" className="flex flex-col gap-3 sm:flex-row sm:items-start">
      <div className="flex h-40 w-32 shrink-0 items-center justify-center overflow-hidden rounded-md border border-slate-200 bg-slate-50">
        {edit.displayPhotoUrl ? (
          <img src={edit.displayPhotoUrl} alt={`${person.nameKo} 프로필 사진`}
            className="h-full w-full object-contain" />
        ) : (
          <span className="flex flex-col items-center gap-1 text-xs text-slate-400">
            <ImageIcon className="h-8 w-8" aria-hidden="true" />
            사진 없음
          </span>
        )}
      </div>
      <div className="min-w-0 space-y-2">
        <p className="text-sm font-medium text-slate-700">프로필 사진</p>
        <p className="text-xs text-slate-500">JPG·PNG, 5MB 이하. 적용을 눌러야 저장됩니다.</p>
        <input ref={inputRef} id={inputId} type="file" accept={PROFILE_PHOTO_ACCEPT} className="sr-only"
          tabIndex={-1} aria-label="프로필 사진 파일 선택" disabled={busy}
          onChange={(event) => {
            edit.choosePhoto(event.target.files?.[0]);
            event.target.value = "";
          }} />
        <div className="flex flex-wrap gap-2">
          <Button type="button" size="sm" variant="outline" disabled={busy}
            onClick={() => inputRef.current?.click()}>
            추가
          </Button>
          <Button type="button" size="sm" variant="outline"
            disabled={busy || (!person.profilePhotoUrl && !edit.photoFile) || edit.photoRemove}
            onClick={edit.photoFile ? edit.cancelPhoto : edit.markPhotoRemove}>
            삭제
          </Button>
          <Button type="button" size="sm" disabled={busy || !edit.photoDirty}
            onClick={() => void edit.applyPhoto()}>
            {busy ? "적용 중..." : "적용"}
          </Button>
          {edit.photoRemove && (
            <Button type="button" size="sm" variant="ghost" disabled={busy} onClick={edit.cancelPhoto}>
              되돌리기
            </Button>
          )}
        </div>
        {status && <p className="text-xs text-amber-700">{status}</p>}
        {edit.photoError && <p role="alert" className="text-sm text-red-600">{edit.photoError}</p>}
        {edit.photoMessage && <p role="status" className="text-sm text-green-700">{edit.photoMessage}</p>}
      </div>
    </section>
  );
}

export function ManagerBasicInfoForm({ person, edit }: Readonly<{
  person: ManagerPersonDetail;
  edit: ManagerEditState;
}>) {
  const { basicForm: form, basicErrors: errors, basicSaving: saving } = edit;
  return (
    <form className="space-y-4" onSubmit={edit.submitBasic} noValidate aria-label="기본정보 수정">
      <fieldset disabled={saving} className="grid gap-4 border-0 p-0 sm:grid-cols-2">
        <FormField label="사번">
          {(control) => <Input {...control} value={person.employeeNo} readOnly disabled />}
        </FormField>
        {TEXT_FIELDS.map(({ field, label, required, maxLength }) => (
          <FormField key={field} label={label} required={required} error={errors[field]}>
            {(control) => <Input {...control} required={required} maxLength={maxLength}
              value={form[field]} onChange={(event) => edit.updateBasic(field, event.target.value)} />}
          </FormField>
        ))}
        <FormField label="생년월일" error={errors.birthDate}>
          {(control) => <Input {...control} type="date" value={form.birthDate}
            onChange={(event) => edit.updateBasic("birthDate", event.target.value)} />}
        </FormField>
        <FormField label="성별" error={errors.genderCode}>
          {(control) => <CodeSelect {...control} options={GENDER_OPTIONS} value={form.genderCode}
            onChange={(value) => edit.updateBasic("genderCode", value)}
            placeholder="성별 선택" allLabel="미지정" allowEmpty />}
        </FormField>
        {ADDRESS_FIELDS.map(({ field, label, maxLength, wide }) => (
          <div key={field} className={wide ? "sm:col-span-2" : undefined}>
            <FormField label={label} error={errors[field]}>
              {(control) => <Input {...control} maxLength={maxLength} value={form[field]}
                onChange={(event) => edit.updateBasic(field, event.target.value)} />}
            </FormField>
          </div>
        ))}
      </fieldset>
      <p className="text-xs text-slate-500">
        부서·직급·직위·고용형태·재직 상태·입사/퇴직/승진일은 발령으로만 변경됩니다.
      </p>
      {edit.basicError && <p role="alert" className="text-sm text-red-600">{edit.basicError}</p>}
      {edit.basicMessage && <p role="status" className="text-sm text-green-700">{edit.basicMessage}</p>}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" disabled={saving || !edit.basicDirty} onClick={edit.cancelBasic}>
          취소
        </Button>
        <Button type="submit" disabled={saving || !edit.basicDirty}>
          {saving ? "저장 중..." : "저장"}
        </Button>
      </div>
    </form>
  );
}
