import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { boardApi } from '../../../api/boardApi';

const LIST_PATH = '/worship/sermons';

export default function SermonsWritePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const rqstNo = searchParams.get('rqstNo') ?? '';
  const parentNo = searchParams.get('parentNo') ?? '';
  const isEdit = Boolean(rqstNo);
  const isReply = Boolean(parentNo);
  const [form, setForm] = useState({
    title: '',
    author: '',
    content: '',
    secret: false,
    password: '',
    confirmPassword: '',
  });
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isEdit && !isReply) return;

    let mounted = true;

    const load = async () => {
      setLoading(true);
      try {
        const data = isReply
          ? await boardApi.getReplyForm(LIST_PATH, parentNo)
          : await boardApi.getWriteForm(LIST_PATH, rqstNo);
        if (!mounted || !data) return;

        setForm((prev) => ({
          ...prev,
          title: data.title ?? '',
          author: data.rqstId ?? '',
          content: data.cont ?? '',
          secret: data.secret === 'Y',
          password: data.password ?? '',
          confirmPassword: data.password ?? '',
        }));
      } catch {
        alert('수정할 설교를 불러오지 못했습니다.');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [isEdit, isReply, parentNo, rqstNo]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.title || !form.author || !form.content || !form.password) {
      alert('필수 항목을 입력해 주세요.');
      return;
    }
    if (form.password.length < 4) {
      alert('비밀번호는 최소 4자 이상이어야 합니다.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        rqstNo: rqstNo || undefined,
        parentNo: parentNo || undefined,
        title: form.title,
        cont: form.content,
        rqstId: form.author,
        secret: form.secret ? 'Y' : 'N',
        password: form.password,
      };

      if (isEdit) {
        await boardApi.updateBoard(LIST_PATH, payload, files);
        alert('설교 수정이 완료되었습니다.');
      } else {
        await boardApi.saveBoard(LIST_PATH, payload, files);
        alert(isReply ? '답글이 등록되었습니다.' : '설교 등록이 완료되었습니다.');
      }

      navigate(LIST_PATH);
    } catch {
      alert('저장 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <article className="bg-white rounded-panel shadow-panel border border-gray-100 p-6">
        <header className="pb-4 mb-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-brand-dark">{isReply ? '설교 답글 작성' : '설교 작성'}</h2>
        </header>

        <form onSubmit={onSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">비밀글</label>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <input type="checkbox" checked={form.secret} onChange={(event) => setForm((prev) => ({ ...prev, secret: event.target.checked }))} />
                비밀글로 등록
              </label>
            </div>
          </div>

          <div className="space-y-1 mb-4">
            <label className="block text-sm font-medium text-gray-700">제목 <span className="text-red-500">*</span></label>
            <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary" value={form.title} onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))} placeholder="제목을 입력해주세요." />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">이름 <span className="text-red-500">*</span></label>
              <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary" value={form.author} onChange={(event) => setForm((prev) => ({ ...prev, author: event.target.value }))} placeholder="이름을 입력해주세요." readOnly={isEdit} />
            </div>
          </div>

          <div className="space-y-1 mb-4">
            <label className="block text-sm font-medium text-gray-700">내용 <span className="text-red-500">*</span></label>
            <textarea className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm min-h-[200px] focus:outline-none focus:ring-2 focus:ring-brand-primary" value={form.content} onChange={(event) => setForm((prev) => ({ ...prev, content: event.target.value }))} placeholder="내용을 입력해주세요." />
          </div>

          <div className="space-y-1 mb-4">
            <label className="block text-sm font-medium text-gray-700">첨부파일</label>
            <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" type="file" multiple onChange={(event) => setFiles(Array.from(event.target.files ?? []))} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">비밀번호 <span className="text-red-500">*</span></label>
              <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary" type="password" value={form.password} onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))} placeholder="비밀번호" />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">비밀번호 확인 <span className="text-red-500">*</span></label>
              <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary" type="password" value={form.confirmPassword} onChange={(event) => setForm((prev) => ({ ...prev, confirmPassword: event.target.value }))} placeholder="비밀번호 확인" />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button type="submit" className="bg-brand-primary text-white rounded-lg px-6 py-2.5 text-sm font-semibold hover:bg-[#4e5caf] disabled:opacity-40 transition-colors" disabled={loading}>{isEdit ? '수정하기' : '등록하기'}</button>
            <Link to={LIST_PATH} className="bg-gray-100 text-gray-700 rounded-lg px-6 py-2.5 text-sm font-medium hover:bg-gray-200 transition-colors">취소</Link>
          </div>
        </form>
      </article>
    </section>
  );
}
