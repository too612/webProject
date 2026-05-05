import { Link } from 'react-router-dom';

export function OfficialFaqSupportPage() {
  const faqs = [
    { q: '주일 예배는 몇 시에 시작하나요?', a: '주일 1부 9:00, 2부 11:00, 오후예배 14:00입니다.' },
    { q: '주차장은 무료인가요?', a: '예배 시간 전후 2시간 무료이며 안내 봉사자가 도와드립니다.' },
    { q: '새가족 등록은 어떻게 하나요?', a: '예배 후 새가족실 방문 또는 문의하기 게시판에서 신청 가능합니다.' },
  ];

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-brand-dark">자주 묻는 질문</h2>
        <p className="text-sm text-gray-400 mt-0.5">주요 문의를 정리했습니다.</p>
      </div>
      {faqs.map((item) => (
        <article className="bg-gray-50 rounded-lg p-5" key={item.q}>
          <h4 className="font-semibold text-brand-dark">Q. {item.q}</h4>
          <p className="text-sm text-gray-600 mt-1">A. {item.a}</p>
        </article>
      ))}
      <div className="flex gap-4 flex-wrap">
        <Link className="text-brand-primary hover:underline text-sm" to="/support/location">오시는 길</Link>
        <Link className="text-brand-primary hover:underline text-sm" to="/support/qna">문의하기</Link>
      </div>
    </section>
  );
}

export function OfficialLocationSupportPage() {
  return (
    <section className="space-y-5">
      <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center text-gray-400" role="img" aria-label="지도 연동 준비 중">
        <div className="text-center">
          <strong className="text-gray-600">지도 연동 준비 중</strong>
          <p className="text-sm mt-1">현재는 주소/교통 정보만 먼저 제공합니다.</p>
        </div>
      </div>
      <div className="bg-white rounded-panel shadow-panel border border-gray-100 p-5">
        <h4 className="font-semibold text-brand-dark mb-3">다사랑교회 오시는 길</h4>
        <dl className="space-y-2 text-sm text-gray-600 mb-3">
          <div className="flex gap-3">
            <dt className="font-medium text-gray-700 w-20 shrink-0">주소</dt>
            <dd>세종특별자치시 집현북로 52</dd>
          </div>
          <div className="flex gap-3">
            <dt className="font-medium text-gray-700 w-20 shrink-0">대표전화</dt>
            <dd>044-000-0000</dd>
          </div>
          <div className="flex gap-3">
            <dt className="font-medium text-gray-700 w-20 shrink-0">운영시간</dt>
            <dd>평일 09:00~18:00</dd>
          </div>
        </dl>
        <p className="text-sm text-gray-500">대중교통 및 주차 안내는 예배 전 공지사항을 참고해 주세요.</p>
        <div className="flex gap-3 mt-4 flex-wrap">
          <a
            href="https://map.naver.com/v5/search/%EC%84%B8%EC%A2%85%ED%8A%B9%EB%B3%84%EC%9E%90%EC%B9%98%EC%8B%9C%20%EC%A7%91%ED%98%84%EB%B6%81%EB%A1%9C%2052"
            target="_blank"
            rel="noreferrer"
            className="bg-brand-primary text-white rounded-lg px-4 py-2 text-sm hover:bg-[#4e5caf] transition-colors"
          >
            네이버지도에서 보기
          </a>
          <a
            href="https://map.kakao.com/link/search/%EC%84%B8%EC%A2%85%ED%8A%B9%EB%B3%84%EC%9E%90%EC%B9%98%EC%8B%9C%20%EC%A7%91%ED%98%84%EB%B6%81%EB%A1%9C%2052"
            target="_blank"
            rel="noreferrer"
            className="bg-yellow-400 text-brand-dark rounded-lg px-4 py-2 text-sm hover:bg-yellow-500 transition-colors"
          >
            카카오맵에서 보기
          </a>
        </div>
        <div className="flex gap-4 flex-wrap mt-3">
          <Link className="text-brand-primary hover:underline text-sm" to="/support/faq">FAQ</Link>
          <Link className="text-brand-primary hover:underline text-sm" to="/support/qna">문의하기</Link>
        </div>
      </div>
    </section>
  );
}
