import { useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLocationInfo } from './useLocationInfo';
import { useCorpInfo } from '../../../common/corp/corpHook';

// 네이버 지도 SDK 타입 선언
declare global {
  interface Window {
    naver: any;
  }
}

/****************************************************************************************************
 * config/constant method (상수, 타입가드, 값 보정 유틸)
 ****************************************************************************************************/

const PAGE_DESCRIPTION = '교회 위치와 교통 안내를 확인하세요. 하나님이 기뻐하시는 다사랑교회입니다.';

/****************************************************************************************************
 * component method (state, hook 초기화)
 ****************************************************************************************************/

export default function LocationPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const { locationInfo, loading, error, loadLocationInfo } = useLocationInfo();
  const { corpInfo } = useCorpInfo();
  const clientId = 'g3nwx8qc5o';

  // Footer.tsx와 동일한 데이터 추출 방식 적용
  const fullAddress = corpInfo ? `(${corpInfo.postalCode}) ${corpInfo.addressLine1} ${corpInfo.addressLine2}` : '';
  const phoneNumber = corpInfo?.phoneNumber ?? '-';

  // 네이버 지도 초기화 로직
  const initMap = useCallback(() => {
    if (!mapRef.current || !locationInfo || !locationInfo.lat || !locationInfo.lng) return;

    const mapOptions = {
      center: new window.naver.maps.LatLng(locationInfo.lat, locationInfo.lng),
      zoom: 19, // 최대 확대(21) 기준 2단계 작게 설정
      minZoom: 10,
      maxZoom: 21,
      zoomControl: true,
      zoomControlOptions: {
        position: window.naver.maps.Position.TOP_RIGHT,
      },
    };

    const map = new window.naver.maps.Map(mapRef.current, mapOptions);

    // 마커 추가
    new window.naver.maps.Marker({
      position: new window.naver.maps.LatLng(locationInfo.lat, locationInfo.lng),
      map: map,
      title: locationInfo.title,
      icon: {
        url: '/public/img/maps/marker.jpg', // 변경할 이미지 경로 (public 폴더 기준)
        size: new window.naver.maps.Size(40, 50),     // 이미지의 원본 크기
        scaledSize: new window.naver.maps.Size(40, 50), // 화면에 표시될 크기
        anchor: new window.naver.maps.Point(20, 50),   // 마커의 하단 중앙이 좌표에 찍히도록 설정
      },
    });
  }, [locationInfo]);

  useEffect(() => {
    loadLocationInfo();
  }, [loadLocationInfo]);

  // 네이버 지도 SDK 동적 로드
  useEffect(() => {
    if (window.naver && window.naver.maps) {
      initMap();
    } else {
      const script = document.createElement('script');
      // 예제 코드의 도메인(oapi)과 파라미터명(ncpKeyId)을 반영하여 수정
      script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}&submodules=geocoder`;
      script.async = true;
      script.onload = () => initMap();
      document.head.appendChild(script);
    }
  }, [initMap]);

  // 주소 복사 핸들러
  const handleCopyAddress = useCallback((address: string) => {
    navigator.clipboard.writeText(address).then(() => {
      alert('주소가 클립보드에 복사되었습니다.');
    });
  }, []);

  return (
    <section className="space-y-5">
      <div className="rounded-none border border-slate-200 bg-white shadow-panel p-6 md:p-7 space-y-6">
        <div className="space-y-2 border-l-4 border-brand-primary pl-4 md:pl-5">
          <h2 className="text-xl md:text-2xl font-bold text-brand-dark">오시는 길</h2>
          <p className="text-sm text-gray-600 leading-relaxed">{PAGE_DESCRIPTION}</p>
        </div>

        {loading && <div className="text-sm text-slate-500 py-10 text-center">오시는 길 정보를 불러오는 중입니다.</div>}
        {error && <div className="text-sm text-red-700 bg-red-50 border border-red-100 px-4 py-3">{error}</div>}

        {locationInfo && (
          <div className="space-y-6">
            {/* 실제 네이버 지도가 렌더링되는 영역 */}
            <div ref={mapRef} className="bg-slate-100 border border-slate-200 rounded-none h-72 md:h-96 shadow-inner relative group" role="img" aria-label="교회 위치 지도">
              <div className="absolute bottom-4 right-4 flex gap-2">
                <button 
                  onClick={initMap}
                  className="bg-white/90 backdrop-blur shadow-sm border border-slate-200 px-3 py-1.5 rounded-md text-xs font-semibold text-slate-700 hover:bg-white transition-colors flex items-center gap-1 z-[100]"
                >
                  <span className="material-icons text-sm">my_location</span> 현위치
                </button>
              </div>
            </div>

            {/* 핵심 정보 카드와 길찾기 버튼 그룹 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-slate-50/70 border border-slate-100 p-6 md:p-7 space-y-5">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-brand-dark text-lg">{locationInfo.title}</h4>
                    <button 
                      onClick={() => handleCopyAddress(fullAddress)}
                      className="text-xs font-semibold text-brand-primary hover:text-brand-dark transition-colors flex items-center gap-1"
                    >
                      <span className="material-icons text-sm">content_copy</span> 주소 복사
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <div className="flex items-start gap-3">
                      <span className="material-icons text-brand-primary/60 mt-0.5">place</span>
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">ADDRESS</p>
                        <p className="text-sm text-slate-800 leading-relaxed font-medium">{fullAddress || locationInfo.address}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="material-icons text-brand-primary/60 mt-0.5">call</span>
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">PHONE</p>
                        <p className="text-sm text-slate-800 font-medium">{phoneNumber}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 md:col-span-2">
                      <span className="material-icons text-brand-primary/60 mt-0.5">schedule</span>
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">OFFICE HOURS</p>
                        <p className="text-sm text-slate-800 font-medium">{locationInfo.hours}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200/60 flex items-start gap-2">
                    <span className="material-icons text-sm text-slate-400">info</span>
                    <p className="text-xs text-slate-500 leading-relaxed">{locationInfo.notice}</p>
                  </div>
                </div>

                {/* 교통수단 상세 섹션: modern UX 스타일 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-5 border border-slate-100 bg-white rounded-none space-y-2">
                    <div className="flex items-center gap-2 text-brand-dark font-bold text-sm">
                      <span className="material-icons text-base">directions_bus</span> 버스 이용 시
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">오산역/오산터미널에서 7번, 8번 버스 탑승 후 '오산초등학교' 하차 (도보 3분)</p>
                  </div>
                  <div className="p-5 border border-slate-100 bg-white rounded-none space-y-2">
                    <div className="flex items-center gap-2 text-brand-dark font-bold text-sm">
                      <span className="material-icons text-base">subway</span> 지하철 이용 시
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">1호선 오산역 1번 출구에서 택시 이용 시 약 5분 소요</p>
                  </div>
                  <div className="p-5 border border-slate-100 bg-white rounded-none space-y-2">
                    <div className="flex items-center gap-2 text-brand-dark font-bold text-sm">
                      <span className="material-icons text-base">local_parking</span> 주차 안내
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">교회 건물 내 지하 주차장 및 인근 공영 주차장 이용 가능</p>
                  </div>
                </div>
              </div>

              {/* 우측 퀵 내비게이션 섹션 */}
              <div className="space-y-4">
                <div className="bg-slate-50 border border-slate-100 p-6 flex flex-col gap-3">
                  <h5 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                    <span className="material-icons text-base">explore</span> 빠른 길찾기
                  </h5>
                <a
                  href={locationInfo.naverMapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-[#03C75A] text-white rounded-md px-5 py-3 text-sm font-bold hover:brightness-95 transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  네이버 지도
                </a>
                <a
                  href={locationInfo.kakaoMapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-[#FAE100] text-[#3C1E1E] rounded-md px-5 py-3 text-sm font-bold hover:brightness-95 transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  카카오 맵
                </a>
                </div>
                
                <div className="p-6 border border-slate-100 bg-white space-y-4">
                  <p className="text-xs text-slate-400 font-medium">더 궁금하신 점이 있나요?</p>
                  <div className="flex flex-col gap-2">
                    <Link className="flex items-center justify-between group p-3 rounded-md bg-slate-50 hover:bg-brand-primary/5 transition-colors" to="/support/faq">
                      <span className="text-sm font-medium text-slate-700 group-hover:text-brand-primary">자주 묻는 질문</span>
                      <span className="material-icons text-slate-300 group-hover:text-brand-primary text-base">chevron_right</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}