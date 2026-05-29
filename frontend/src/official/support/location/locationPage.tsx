import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLocationInfo } from './useLocationInfo';

export default function LocationPage() {
  const { locationInfo, loading, error, loadLocationInfo } = useLocationInfo();

  useEffect(() => {
    loadLocationInfo();
  }, [loadLocationInfo]);

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-brand-dark">오시는 길</h2>
        <p className="text-sm text-gray-400 mt-0.5">교회 위치와 교통 안내를 확인하세요.</p>
      </div>

      {loading && <div className="text-sm text-gray-500">오시는 길 정보를 불러오는 중입니다.</div>}
      {error && <div className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3">{error}</div>}

      {locationInfo && (
        <div className="space-y-5">
          <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center text-gray-400" role="img" aria-label="지도 연동 준비 중">
            <div className="text-center">
              <strong className="text-gray-600">{locationInfo.title}</strong>
              <p className="text-sm mt-1">{locationInfo.subtitle}</p>
            </div>
          </div>

          <div className="bg-white rounded-panel shadow-panel border border-gray-100 p-5">
            <h4 className="font-semibold text-brand-dark mb-3">{locationInfo.title}</h4>
            <dl className="space-y-2 text-sm text-gray-600 mb-3">
              <div className="flex gap-3">
                <dt className="font-medium text-gray-700 w-20 shrink-0">주소</dt>
                <dd>{locationInfo.address}</dd>
              </div>
              <div className="flex gap-3">
                <dt className="font-medium text-gray-700 w-20 shrink-0">대표전화</dt>
                <dd>{locationInfo.phone}</dd>
              </div>
              <div className="flex gap-3">
                <dt className="font-medium text-gray-700 w-20 shrink-0">운영시간</dt>
                <dd>{locationInfo.hours}</dd>
              </div>
            </dl>
            <p className="text-sm text-gray-500">{locationInfo.notice}</p>
            <div className="flex gap-3 mt-4 flex-wrap">
              <a
                href={locationInfo.naverMapUrl}
                target="_blank"
                rel="noreferrer"
                className="bg-brand-primary text-white rounded-lg px-4 py-2 text-sm hover:bg-[#4e5caf] transition-colors"
              >
                네이버지도에서 보기
              </a>
              <a
                href={locationInfo.kakaoMapUrl}
                target="_blank"
                rel="noreferrer"
                className="bg-yellow-400 text-brand-dark rounded-lg px-4 py-2 text-sm hover:bg-yellow-500 transition-colors"
              >
                카카오맵에서 보기
              </a>
            </div>
            <div className="flex gap-4 flex-wrap mt-3">
              <Link className="text-brand-primary hover:underline text-sm" to="/support/faq">FAQ</Link>
              <Link className="text-brand-primary hover:underline text-sm" to="/support/qna">Q&A</Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
