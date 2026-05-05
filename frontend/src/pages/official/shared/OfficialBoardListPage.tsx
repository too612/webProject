import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { boardApi } from '../../../api/boardApi';
import type { BoardDto } from '../../../types';

type BoardItem = {
  id: number | string;
  rowNum: number;
  title: string;
  author: string;
  date: string;
  views: number;
  answered?: boolean;
  secret?: boolean;
  hasFile?: boolean;
  commentCount: number;
  depth: number;
};

type OfficialBoardListPageProps = {
  title: string;
  breadcrumb: string;
  viewPath: string;
  writePath: string;
  listPath?: string;
  posts?: BoardItem[];
};

export default function OfficialBoardListPage({
  title,
  breadcrumb,
  viewPath,
  writePath,
  listPath,
  posts = [],
}: OfficialBoardListPageProps) {
  const navigate = useNavigate();
  const resolvedListPath = useMemo(() => {
    if (listPath) return listPath;
    return writePath.replace(/\/write$/, '');
  }, [listPath, writePath]);

  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = Number(searchParams.get('page') ?? '1');
  const [page, setPage] = useState(Number.isFinite(pageParam) && pageParam > 0 ? pageParam - 1 : 0);
  const [searchType, setSearchType] = useState(searchParams.get('searchType') ?? 'title');
  const [keyword, setKeyword] = useState(searchParams.get('keyword') ?? '');
  const [inputKeyword, setInputKeyword] = useState(searchParams.get('keyword') ?? '');
  const [items, setItems] = useState<BoardDto[]>([]);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [secretModal, setSecretModal] = useState<{ show: boolean; rqstNo: string; password: string }>({ show: false, rqstNo: '', password: '' });

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await boardApi.getBoardList(resolvedListPath, {
          page,
          searchType,
          keyword: keyword.trim() || undefined,
        });
        if (!mounted) return;
        setItems(data.items);
        setPageSize(data.size);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
      } catch {
        if (!mounted) return;
        setError('게시글 목록을 불러오지 못했습니다.');
        setItems([]);
        setTotalPages(0);
        setTotalElements(0);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [resolvedListPath, page, searchType, keyword]);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set('page', String(page + 1));
    if (searchType) params.set('searchType', searchType);
    if (keyword.trim()) params.set('keyword', keyword.trim());
    setSearchParams(params, { replace: true });
  }, [page, searchType, keyword, setSearchParams]);

  const rows: BoardItem[] = !error
    ? items.map((item, index) => ({
        id: item.rqstNo ?? '',
        rowNum: totalElements - (page * pageSize) - index,
        title: item.title ?? '',
        author: item.rqstId ?? '-',
        date: item.insDt ? String(item.insDt).slice(0, 10) : '-',
        views: item.views ?? 0,
        answered: (item.commentCount ?? 0) > 0,
        secret: item.secret === 'Y',
        hasFile: item.hasFile === true,
        commentCount: item.commentCount ?? 0,
        depth: item.depth ?? 0,
      }))
    : posts;

  const openSecretModal = (rqstNo: string) => {
    setSecretModal({ show: true, rqstNo, password: '' });
  };

  const onSecretConfirm = async () => {
    navigate(`${viewPath}?rqstNo=${secretModal.rqstNo}&password=${encodeURIComponent(secretModal.password)}`);
    setSecretModal({ show: false, rqstNo: '', password: '' });
  };

  const pageButtons = totalPages > 0 ? Array.from({ length: totalPages }, (_, index) => index) : [0];

  const onSearch = (event: FormEvent) => {
    event.preventDefault();
    setPage(0);
    setKeyword(inputKeyword.trim());
  };

  return (
    <>
    <section className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-brand-dark">{title}</h2>
          <div className="text-sm text-gray-400 mt-0.5">게시물 수: {totalElements || rows.length} | 페이지: {page + 1}/{Math.max(totalPages, 1)}</div>
        </div>
        <div className="text-sm text-gray-500">{breadcrumb}</div>
      </div>

      {error && <div className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3">{error}</div>}

      <div className="overflow-x-auto rounded-panel shadow-panel border border-gray-100">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
            <tr>
              <th className="px-4 py-3 font-medium" style={{ width: '6%' }}>번호</th>
              <th className="px-2 py-3" style={{ width: '4%' }}></th>
              <th className="px-4 py-3 font-medium text-left" style={{ width: '44%' }}>제목</th>
              <th className="px-4 py-3 font-medium" style={{ width: '13%' }}>작성자</th>
              <th className="px-4 py-3 font-medium" style={{ width: '13%' }}>작성일</th>
              <th className="px-4 py-3 font-medium" style={{ width: '8%' }}>조회</th>
              <th className="px-4 py-3 font-medium" style={{ width: '12%' }}>상태</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-400">등록된 게시글이 없습니다.</td>
              </tr>
            )}
            {rows.map((post) => (
              <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-center text-gray-500">{post.rowNum}</td>
                <td className="px-2 py-3 text-center">
                  {post.hasFile && <span className="material-icons" style={{ fontSize: '16px', color: '#777', verticalAlign: 'middle' }} title="첨부파일 있음">attach_file</span>}
                </td>
                <td className="px-4 py-3">
                  {post.secret ? (
                    <button type="button" className={`text-brand-dark hover:text-brand-primary hover:underline text-left${post.depth > 0 ? ' pl-5' : ''}`}
                      onClick={() => openSecretModal(String(post.id))}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0 }}>
                      {post.depth > 0 && <span className="material-icons reply-icon" style={{ fontSize: '16px', verticalAlign: 'middle', marginRight: '4px' }}>subdirectory_arrow_right</span>}
                      <span className="material-icons lock-icon">lock</span>
                      {post.title}
                      {post.commentCount > 0 && <span style={{ color: '#f44336', marginLeft: '4px', fontSize: '13px' }}>[{post.commentCount}]</span>}
                    </button>
                  ) : (
                    <Link to={`${viewPath}?rqstNo=${post.id}`} className={`text-brand-dark hover:text-brand-primary hover:underline${post.depth > 0 ? ' pl-5' : ''}`}>
                      {post.depth > 0 && <span className="material-icons reply-icon" style={{ fontSize: '16px', verticalAlign: 'middle', marginRight: '4px' }}>subdirectory_arrow_right</span>}
                      {post.title}
                      {post.commentCount > 0 && <span style={{ color: '#f44336', marginLeft: '4px', fontSize: '13px' }}>[{post.commentCount}]</span>}
                    </Link>
                  )}
                </td>
                <td className="px-4 py-3 text-center text-gray-400 text-xs">{post.author}</td>
                <td className="px-4 py-3 text-center text-gray-400 text-xs">{post.date}</td>
                <td className="px-4 py-3 text-center text-gray-400 text-xs">{post.views}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${post.answered === false ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                    {post.answered === false ? '대기중' : '완료'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-1 justify-center">
        {pageButtons.map((buttonPage) => (
          <button
            key={buttonPage}
            type="button"
            className={`w-8 h-8 rounded text-sm ${buttonPage === page ? 'bg-brand-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            onClick={() => setPage(buttonPage)}
          >
            {buttonPage + 1}
          </button>
        ))}
      </div>

      <form className="flex flex-col sm:flex-row gap-2" onSubmit={onSearch}>
        <div className="flex gap-2 flex-1">
          <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm" value={searchType} onChange={(event) => setSearchType(event.target.value)}>
            <option value="title">제목</option>
            <option value="rqstId">작성자</option>
            <option value="cont">내용</option>
          </select>
          <input
            type="text"
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm"
            placeholder="검색어를 입력하세요."
            value={inputKeyword}
            onChange={(event) => setInputKeyword(event.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button className="bg-gray-100 text-gray-700 rounded-lg px-4 py-2 text-sm hover:bg-gray-200 transition-colors" type="submit">검색</button>
          <Link className="inline-flex items-center bg-brand-primary text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-[#4e5caf] transition-colors" to={writePath}>글쓰기</Link>
        </div>
      </form>
    </section>

      {/* 비밀글 비밀번호 모달 */}
      {secretModal.show && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm">
            <h4 className="text-base font-bold text-brand-dark mb-4">비밀글 확인</h4>
            <p style={{ fontSize: '13px', color: '#666', marginBottom: '12px' }}>비밀번호를 입력하세요.</p>
            <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-4" type="password" value={secretModal.password}
              onChange={(e) => setSecretModal((prev) => ({ ...prev, password: e.target.value }))}
              placeholder="비밀번호" onKeyDown={(e) => { if (e.key === 'Enter') onSecretConfirm(); }} />
            <div className="flex gap-2 justify-end">
              <button type="button" className="bg-brand-primary text-white rounded-lg px-4 py-2 text-sm font-medium" onClick={onSecretConfirm}>확인</button>
              <button type="button" className="bg-gray-100 text-gray-700 rounded-lg px-4 py-2 text-sm font-medium" onClick={() => setSecretModal({ show: false, rqstNo: '', password: '' })}>취소</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
