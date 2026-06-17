/**
 * File Name   : sermonsView
 * Description : 설교 상세 페이지
 * -----------------------------------------------------------------------------
 * useSermons Hook에서 상세 상태와 메서드를 가져와 UI를 렌더링한다.
 */

import { Suspense, lazy, useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Attachment } from '../../../common/attachment';
import { CommentSection } from '../../../common/comment';
import EditorViewer from '../../../common/editor/editorViewer';
import { useSermons } from './sermonsHook';
import { SERMONS_BASE_PATH } from './sermonsModel';
import type { SermonFileItem } from './sermonsModel';

/* ──────────────────────────────────────────────────────────────────────────
 * 상수 및 유틸
 * ────────────────────────────────────────────────────────────────────────── */

const SERMONS_LIST_PATH = SERMONS_BASE_PATH;

const WORSHIP_TYPE_LABEL_MAP: Record<string, string> = {
  SUNDAY: '주일예배',
  WEDNESDAY: '수요예배',
  DAWN: '새벽예배',
  SPECIAL: '특별예배',
};

function normalizeDate(value: unknown): string {
  if (!value) return '-';
  return String(value).slice(0, 10);
}

function resolveWorshipTypeLabel(value: unknown): string {
  if (!value) return '-';
  return WORSHIP_TYPE_LABEL_MAP[String(value)] ?? String(value);
}

function StatusBadge({ commentCount }: { commentCount: number }) {
  const answered = commentCount > 0;
  return (
    <span className={`inline-block px-2.5 py-1 rounded-sm text-[10px] font-semibold leading-none ${answered ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
      {answered ? '완료' : '미답변'}
    </span>
  );
}

function MetaField({ label, value, wide }: { label: string; value: string; wide?: boolean }) {
  return (
    <div className={`rounded-md border border-slate-200 bg-white px-4 py-3 flex flex-col gap-1 ${wide ? 'sm:col-span-2' : ''}`}>
      <dt className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest leading-none">{label}</dt>
      <dd className="text-[15px] font-semibold text-slate-800 leading-snug break-words">{value || '-'}</dd>
    </div>
  );
}

/****************************************************************************************************
 * SermonsView - 상세 페이지
 ****************************************************************************************************/

export default function SermonsView() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const rqstNo = searchParams.get('rqstNo') ?? '';
  const passwordParam = searchParams.get('password') ?? '';

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [action, setAction] = useState<'edit' | 'delete' | null>(null);
  const [password, setPassword] = useState('');

  const {
    board,
    commentCount,
    viewLoading,
    viewError,
    loadView,
    checkPassword,
    deleteBoard,
    clearError,
  } = useSermons();

  useEffect(() => {
    if (!rqstNo) return;
    clearError();
    loadView(rqstNo, passwordParam || undefined);
  }, [rqstNo, passwordParam]);

  const openPasswordModal = (nextAction: 'edit' | 'delete') => {
    setAction(nextAction);
    setPassword('');
    setShowPasswordModal(true);
  };

  const onConfirm = async () => {
    if (!action || !rqstNo) { setShowPasswordModal(false); return; }
    if (board?.password) {
      const isValid = await checkPassword(rqstNo, password);
      if (!isValid) { alert('비밀번호가 올바르지 않습니다.'); return; }
    }
    if (action === 'edit') {
      navigate(`${SERMONS_LIST_PATH}/write?rqstNo=${rqstNo}`);
      return;
    }
    try {
      await deleteBoard(rqstNo);
      alert('게시글이 삭제되었습니다.');
      navigate(SERMONS_LIST_PATH);
    } catch { alert('삭제 중 오류가 발생했습니다.'); }
    setShowPasswordModal(false);
  };

  const resolvedTitle = board?.title ?? '주일설교';
  const resolvedAuthor = board?.rqstId ?? '-';
  const resolvedDateTime = board?.insDt ? String(board.insDt).replace('T', ' ').slice(0, 16) : '-';
  const resolvedViews = board?.views ?? 0;
  const resolvedContent = board?.cont ?? '';
  const resolvedPreacherName = board?.preacherName ?? '-';
  const resolvedScriptureReference = board?.scriptureReference ?? '-';
  const resolvedSermonDate = normalizeDate(board?.sermonDate);
  const resolvedWorshipType = resolveWorshipTypeLabel(board?.worshipType);
  const fileList: SermonFileItem[] = board?.fileList ?? [];

  return (
    <section className="space-y-5">
      <article className="bg-white rounded-none shadow-panel border border-gray-100 p-6 md:p-7">
        <header className="pb-5 mb-5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-brand-dark">{resolvedTitle}</h2>
          <div className="flex items-center justify-between flex-wrap gap-2 mt-3">
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-1 text-sm text-gray-500"><span className="material-icons text-base">person</span>{resolvedAuthor}</div>
              <div className="flex items-center gap-1 text-sm text-gray-500"><span className="material-icons text-base">calendar_today</span>{resolvedDateTime}</div>
              <div className="flex items-center gap-1 text-sm text-gray-500"><span className="material-icons text-base">visibility</span>{resolvedViews}회</div>
            </div>
            <StatusBadge commentCount={commentCount} />
          </div>
        </header>

        {viewError && <div className="text-sm text-red-600 bg-red-50 rounded-none px-4 py-3 mb-4">{viewError}</div>}
        {viewLoading && <div className="text-sm text-gray-400 text-center py-8">불러오는 중...</div>}

        <section className="mt-4">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <MetaField label="설교자" value={resolvedPreacherName} />
            <MetaField label="예배구분" value={resolvedWorshipType} />
            <MetaField label="설교일자" value={resolvedSermonDate} />
            <MetaField label="성경본문" value={resolvedScriptureReference} wide />
          </dl>
        </section>

        <section className="py-4 text-gray-700">
          <EditorViewer value={resolvedContent} emptyText="등록된 내용이 없습니다." />
        </section>

        <Attachment
          readOnly
          existingFiles={fileList.map((f) => ({
            fileId: f.fileId,
            orgFileNm: f.orgFileNm ?? f.storedFileNm,
            fileSize: f.fileSize ?? 0,
          }))}
          buildDownloadUrl={(fileId) => `/api/common/files/${fileId}/download`}
          buildZipUrl={fileList.length > 1 ? `/api/common/files/downloadZip?pgmId=sermon&refId=${rqstNo}` : undefined}
        />

        <CommentSection pgmId="SERMONS" refId={rqstNo} />

        <div className="flex flex-wrap gap-2 mt-6 pt-5 border-0">
          <Link className="inline-flex items-center bg-brand-primary !text-white rounded-md px-4 py-2.5 text-sm font-medium hover:bg-[#4e5caf] transition-colors" to={SERMONS_LIST_PATH}>목록</Link>
          {rqstNo && <button type="button" className="inline-flex items-center bg-gray-100 text-gray-700 rounded-md px-4 py-2.5 text-sm font-medium hover:bg-gray-200 transition-colors" onClick={() => navigate(`${SERMONS_LIST_PATH}/write?parentNo=${rqstNo}`)}>답글 작성</button>}
          <button type="button" className="inline-flex items-center bg-gray-100 text-gray-700 rounded-md px-4 py-2.5 text-sm font-medium hover:bg-gray-200 transition-colors" onClick={() => openPasswordModal('edit')}>수정</button>
          <button type="button" className="inline-flex items-center bg-red-50 text-red-600 rounded-md px-4 py-2.5 text-sm font-medium hover:bg-red-100 transition-colors" onClick={() => openPasswordModal('delete')}>삭제</button>
        </div>
      </article>

      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-none shadow-xl p-6 w-full max-w-sm">
            <h4 className="text-base font-bold text-brand-dark mb-4">비밀번호 확인</h4>
            <input className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white mb-4" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호를 입력하세요" onKeyDown={(e) => { if (e.key === 'Enter') onConfirm(); }} />
            <div className="flex gap-2 justify-end">
              <button type="button" className="bg-brand-primary text-white rounded-md px-4 py-2.5 text-sm font-medium" onClick={onConfirm}>확인</button>
              <button type="button" className="bg-gray-100 text-gray-700 rounded-md px-4 py-2.5 text-sm font-medium" onClick={() => setShowPasswordModal(false)}>취소</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}