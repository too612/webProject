/**
 * File Name   : sermonsWrite
 * Description : 설교 작성/수정 페이지
 * -----------------------------------------------------------------------------
 * useSermons Hook에서 작성 상태와 메서드를 가져와 UI를 렌더링한다.
 */

import { FormEvent, Suspense, lazy, useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Attachment, useAttachment, attachmentApi } from '../../../common/attachment';
import { useSermons } from './sermonsHook';
import { SERMONS_BASE_PATH } from './sermonsModel';
import { sermonsApi } from './sermonsApi';
import { systemConfigCodeApi } from '../../../system/config/code/codeApi';
import type { SystemConfigCodeRow } from '../../../system/config/code/codeModel';
import type { SermonFileItem } from './sermonsModel';
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ko } from 'date-fns/locale';

const LazyEditor = lazy(() => import('../../../common/editor/editor'));

const SERMONS_LIST_PATH = SERMONS_BASE_PATH;

const DEFAULT_WORSHIP_TYPE_OPTIONS = [
  { value: 'SUNDAY', label: '주일예배' },
  { value: 'WEDNESDAY', label: '수요예배' },
  { value: 'DAWN', label: '새벽예배' },
  { value: 'SPECIAL', label: '특별예배' },
];

type WorshipTypeOption = { value: string; label: string };

function normalizeDate(value: unknown): string {
  if (!value) return '';
  return String(value).slice(0, 10);
}

function formatDateToString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function parseDateString(value: string): Date | null {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

const fieldCls = 'w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white';

function DateInput({ value, onChange, id }: { value: string; onChange: (v: string) => void; id?: string }) {
  const dateValue = parseDateString(value);
  const handleChange = (date: Date | null) => {
    onChange(date ? formatDateToString(date) : '');
  };
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ko}>
      <MuiDatePicker
        value={dateValue}
        onChange={handleChange}
        format="yyyy-MM-dd"
        slotProps={{
          field: { id },
          textField: {
            size: 'small',
            fullWidth: true,
            sx: {
              '& .MuiOutlinedInput-root': {
                borderRadius: '6px',
                fontSize: '0.875rem',
                backgroundColor: '#fff',
                '& fieldset': { borderColor: '#e2e8f0' },
                '&:hover fieldset': { borderColor: '#94a3b8' },
                '&.Mui-focused fieldset': { borderColor: 'var(--color-brand-primary, #5c6bc0)', borderWidth: '2px' },
              },
              '& .MuiInputBase-input': { padding: '8px 12px' },
              '& input::placeholder': { fontSize: '0.875rem', color: '#94a3b8', opacity: 1 },
            },
          },
        }}
      />
    </LocalizationProvider>
  );
}

/****************************************************************************************************
 * SermonsWrite
 ****************************************************************************************************/

export default function SermonsWrite() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const rqstNo = searchParams.get('rqstNo') ?? '';
  const parentNo = searchParams.get('parentNo') ?? '';

  const isEdit = Boolean(rqstNo);
  const isReply = Boolean(parentNo);

  const [loading, setLoading] = useState(false);
  const [worshipTypeOptions, setWorshipTypeOptions] = useState<WorshipTypeOption[]>(DEFAULT_WORSHIP_TYPE_OPTIONS);

  const {
    form,
    setForm,
    writeLoading,
    writeError,
    saveBoard,
    clearError,
  } = useSermons();

  const attachments = useAttachment();
  const resetAttachments = attachments.reset;

  useEffect(() => {
    let mounted = true;
    const loadWorshipTypeOptions = async () => {
      try {
        const result = await systemConfigCodeApi.getCodeList({ page: 0, size: 100, groupCode: 'WORSHIP_TYPE' });
        if (!mounted) return;
        const mapped = (result.items ?? [])
          .map((row) => {
            const item = row as SystemConfigCodeRow;
            const value = String(item.codeValue ?? '').trim();
            const label = String(item.codeName ?? '').trim();
            return value && label ? { value, label } : null;
          })
          .filter((item): item is WorshipTypeOption => item !== null);
        if (mapped.length > 0) setWorshipTypeOptions(mapped);
      } catch {
        if (mounted) setWorshipTypeOptions(DEFAULT_WORSHIP_TYPE_OPTIONS);
      }
    };
    loadWorshipTypeOptions();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!isEdit && !isReply) return;
    let mounted = true;
    const load = async () => {
      setLoading(true);
      clearError();
      try {
        const data = isReply ? await sermonsApi.getReplyForm(parentNo) : await sermonsApi.getWriteForm(rqstNo);
        if (!mounted || !data) return;
        setForm((prev) => ({
          ...prev,
          title: data.title ?? '',
          author: data.rqstId ?? '',
          preacherName: data.preacherName ?? '',
          scriptureReference: data.scriptureReference ?? '',
          sermonDate: normalizeDate(data.sermonDate),
          worshipType: data.worshipType ?? 'SUNDAY',
          content: data.cont ?? '',
          secret: data.secret === 'Y',
          password: '',
          confirmPassword: '',
        }));
        resetAttachments(
          (data.fileList as SermonFileItem[] | undefined)?.map((file) => ({
            fileId: file.fileId,
            orgFileNm: file.orgFileNm ?? file.storedFileNm,
            fileSize: file.fileSize,
          })) ?? [],
        );
      } catch {
        alert('수정할 설교를 불러오지 못했습니다.');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [isEdit, isReply, parentNo, rqstNo, resetAttachments, setForm, clearError]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();

    if (!form.title || !form.author || !form.content || !form.password) { alert('필수 항목을 입력해 주세요.'); return; }
    if (form.password.length < 4) { alert('비밀번호는 최소 4자 이상이어야 합니다.'); return; }
    if (form.password !== form.confirmPassword) { alert('비밀번호가 일치하지 않습니다.'); return; }
    if (form.sermonDate && !/^\d{4}-\d{2}-\d{2}$/.test(form.sermonDate)) { alert('설교일자는 YYYY-MM-DD 형식으로 입력해 주세요.'); return; }

    try {
      const payload = {
        rqstNo: rqstNo || undefined,
        parentNo: parentNo || undefined,
        title: form.title,
        cont: form.content,
        rqstId: form.author,
        preacherName: form.preacherName,
        scriptureReference: form.scriptureReference,
        sermonDate: form.sermonDate,
        worshipType: form.worshipType,
        secret: form.secret ? 'Y' : 'N',
        password: form.password,
      };

      const savedRqstNo = await saveBoard(payload, isEdit, isReply);
      await Promise.all(attachments.deletedFileIds.map((fileId) => attachmentApi.remove(fileId)));
      if (attachments.newFiles.length > 0 && savedRqstNo) {
        await Promise.all(attachments.newFiles.map((file) => attachmentApi.upload(file, 'sermon', savedRqstNo)));
      }

      alert(isEdit ? '설교 수정이 완료되었습니다.' : isReply ? '답글이 등록되었습니다.' : '설교 등록이 완료되었습니다.');
      navigate(SERMONS_LIST_PATH);
    } catch {
      alert('저장 중 오류가 발생했습니다.');
    }
  };

  const isLoading = loading || writeLoading;

  return (
    <section className="space-y-5">
      <article className="bg-white rounded-none shadow-panel border border-gray-100 p-6 md:p-7">
        <header className="pb-4 mb-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-brand-dark">{isReply ? '설교 답글 작성' : isEdit ? '설교 수정' : '설교 작성'}</h2>
        </header>

        {writeError && <div className="text-sm text-red-600 bg-red-50 rounded-none px-4 py-3 mb-4">{writeError}</div>}

        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">비밀글</label>
            <label htmlFor="is-secret-check" className="inline-flex items-center gap-2 text-sm cursor-pointer">
              <input id="is-secret-check" type="checkbox" checked={form.secret} onChange={(e) => setForm((prev) => ({ ...prev, secret: e.target.checked }))} /> 비밀글로 등록
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">제목 <span className="text-red-500">*</span></label>
            <input className={fieldCls} value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} placeholder="제목을 입력해주세요." />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">이름 <span className="text-red-500">*</span></label>
              <input className={fieldCls} value={form.author} onChange={(e) => setForm((prev) => ({ ...prev, author: e.target.value }))} placeholder="이름을 입력해주세요." readOnly={isEdit} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">설교자</label>
              <input className={fieldCls} value={form.preacherName} onChange={(e) => setForm((prev) => ({ ...prev, preacherName: e.target.value }))} placeholder="설교자 이름" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">성경본문</label>
              <input className={fieldCls} value={form.scriptureReference} onChange={(e) => setForm((prev) => ({ ...prev, scriptureReference: e.target.value }))} placeholder="예: 요한복음 3:16-21" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">설교일자</label>
              <DateInput value={form.sermonDate} onChange={(v) => setForm((prev) => ({ ...prev, sermonDate: v }))} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">예배구분</label>
            <select className={fieldCls} value={form.worshipType} onChange={(e) => setForm((prev) => ({ ...prev, worshipType: e.target.value }))}>
              {worshipTypeOptions.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">내용 <span className="text-red-500">*</span></label>
            <div className="[&_.editor-resize-surface]:min-h-[22rem] [&_.editor-resize-surface_.ProseMirror]:min-h-[20rem]">
              <Suspense fallback={<div className="w-full min-h-40 border border-slate-300 rounded-none bg-white px-3 py-2.5 text-sm text-slate-500">에디터 불러오는 중...</div>}>
                <LazyEditor value={form.content} onChange={(v) => setForm((prev) => ({ ...prev, content: v }))} placeholder="내용을 입력해주세요." />
              </Suspense>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">첨부파일</label>
            <Attachment existingFiles={attachments.existingFiles} newFiles={attachments.newFiles} onAdd={(files) => attachments.addFiles(files)} onRemoveExisting={(fileId) => attachments.removeExisting(fileId)} onRemoveNew={(index) => attachments.removeNew(index)} compact />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호 <span className="text-red-500">*</span></label>
              <input className={fieldCls} type="password" value={form.password} onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))} placeholder="비밀번호 (4자 이상)" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호 확인 <span className="text-red-500">*</span></label>
              <input className={fieldCls} type="password" value={form.confirmPassword} onChange={(e) => setForm((prev) => ({ ...prev, confirmPassword: e.target.value }))} placeholder="비밀번호 재입력" />
              {form.confirmPassword && form.password !== form.confirmPassword && (<p className="mt-1 text-xs text-red-500">비밀번호가 일치하지 않습니다.</p>)}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button type="submit" className="bg-brand-primary text-white rounded-md px-6 py-2.5 text-sm font-semibold hover:bg-[#4e5caf] disabled:opacity-40 transition-colors" disabled={isLoading}>{isEdit ? '수정하기' : '등록하기'}</button>
            <Link to={SERMONS_LIST_PATH} className="bg-gray-100 text-gray-700 rounded-md px-6 py-2.5 text-sm font-medium hover:bg-gray-200 transition-colors">취소</Link>
          </div>
        </form>
      </article>
    </section>
  );
}