import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { boardApi } from '../../../api/boardApi';

type OfficialBoardWritePageProps = {
  title: string;
  listPath: string;
};

export default function OfficialBoardWritePage({ title, listPath }: OfficialBoardWritePageProps) {
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
          ? await boardApi.getReplyForm(listPath, parentNo)
          : await boardApi.getWriteForm(listPath, rqstNo);
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
        alert('수정할 게시글을 불러오지 못했습니다.');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [isEdit, isReply, listPath, rqstNo, parentNo]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
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
        await boardApi.updateBoard(listPath, payload, files);
        alert(`${title} 수정이 완료되었습니다.`);
      } else {
        await boardApi.saveBoard(listPath, payload, files);
          alert(isReply ? '답글이 등록되었습니다.' : `${title} 등록이 완료되었습니다.`);
      }

      navigate(listPath);
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
          <h2 className="text-xl font-bold text-brand-dark">{isReply ? '답글 작성' : title}</h2>
        </header>

        <form onSubmit={onSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">비밀글</label>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  checked={form.secret}
                  onChange={(e) => setForm((prev) => ({ ...prev, secret: e.target.checked }))}
                />
                비밀글로 등록
              </label>
            </div>
          </div>

          <div className="space-y-1 mb-4">
            <label className="block text-sm font-medium text-gray-700">제목 <span className="text-red-500">*</span></label>
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="제목을 입력해주세요."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">이름 <span className="text-red-500">*</span></label>
              <input
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                value={form.author}
                onChange={(e) => setForm((prev) => ({ ...prev, author: e.target.value }))}
                placeholder="이름을 입력해주세요."
                readOnly={isEdit}
              />
            </div>
          </div>

          <div className="space-y-1 mb-4">
            <label className="block text-sm font-medium text-gray-700">내용 <span className="text-red-500">*</span></label>
            <textarea
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm min-h-[200px] focus:outline-none focus:ring-2 focus:ring-brand-primary"
              value={form.content}
              onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
              placeholder="내용을 입력해주세요."
            />
          </div>

          <div className="space-y-1 mb-4">
            <label className="block text-sm font-medium text-gray-700">첨부파일</label>
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              type="file"
              multiple
              onChange={(event) => setFiles(Array.from(event.target.files ?? []))}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">비밀번호 <span className="text-red-500">*</span></label>
              <input
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                type="password"
                value={form.password}
                onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                placeholder="비밀번호"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">비밀번호 확인 <span className="text-red-500">*</span></label>
              <input
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                type="password"
                value={form.confirmPassword}
                onChange={(e) => setForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                placeholder="비밀번호 확인"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button type="submit" className="bg-brand-primary text-white rounded-lg px-6 py-2.5 text-sm font-semibold hover:bg-[#4e5caf] disabled:opacity-40 transition-colors" disabled={loading}>{isEdit ? '수정하기' : '등록하기'}</button>
            <Link to={listPath} className="bg-gray-100 text-gray-700 rounded-lg px-6 py-2.5 text-sm font-medium hover:bg-gray-200 transition-colorsxt-gray-700 rounded-lg px-6 py-2.5 text-sm font-medium hover:bg-gray-200 transition-colors">취소</Link>
          </div>
        </form>
      </article>
    </section>
  );
}
