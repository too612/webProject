import { Link } from 'react-router-dom';
import { useState } from 'react';
import { X } from 'lucide-react';

import { useCorpInfo } from '../common/corp/corpHook';
const FAMILY_SITE_OPTIONS = [
  { value: '', label: 'FAMILY SITE' },
  { value: 'http://busan.psh.or.kr', label: '부산비전센터' },
  { value: 'http://ilsan.psh.or.kr', label: '일산드림센터' },
  { value: 'https://twowings.or.kr', label: '두날개교회' },
  { value: 'https://youtube.com', label: '유튜브 채널' },
];
const familySiteSelectWidthCh = Math.max(...FAMILY_SITE_OPTIONS.map(function(o) { return o.label.length; })) + 8;





export default function Footer() {
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [familySiteOpen, setFamilySiteOpen] = useState(false);
  const [emailRefuseOpen, setEmailRefuseOpen] = useState(false);


  const { corpInfo } = useCorpInfo();

  const corpName = corpInfo?.corpName ?? '-';
  const postalCode = corpInfo?.postalCode ?? '-';
  const addressLine1 = corpInfo?.addressLine1 ?? '-';
  const addressLine2 = corpInfo?.addressLine2 ?? '-';
  const businessRegistrationNumber = corpInfo?.businessRegistrationNumber ?? '-';
  const chiefName = corpInfo?.chiefName ?? '-';
  const phoneNumber = corpInfo?.phoneNumber ?? '-';

  return (
    <footer className="footer mt-auto">
      <div className="container">
        <div className="footer-content">
          <div className="footer-info">
            <Link to="/" aria-label={`${corpName} 홈`} className="footer-logo">
              <img src="/img/logo.png" alt={`${corpName} 로고`} />
            </Link>
            <div className="footer-details">
              <p>교회 : {corpName} | 사업자번호 : {businessRegistrationNumber} | 담임목사 : {chiefName} </p>
              <p>주소 : ({postalCode}) {addressLine1} {addressLine2} </p>
              <p>전화 : {phoneNumber} </p>
            </div>
          </div>
          <div className="footer-right">
            <div className="footer-social">
            <a href="#" title="Naver" className="naver" target="_blank" rel="noopener noreferrer">
              <img src="/img/sns_icon_naver_gray.png" alt="Naver" />
            </a>
            <a href="https://www.youtube.com/@dsr87450" title="YouTube" className="youtube" target="_blank" rel="noopener noreferrer">
              <img src="/img/sns_icon_youtube_gray.png" alt="YouTube" />
            </a>
            <a href="#" title="Kakao" className="kakao" target="_blank" rel="noopener noreferrer">
              <img src="/img/sns_icon_kakao_gray.png" alt="Kakao" />
            </a>
            <a href="https://www.instagram.com/dsrang_church?igsh=MzcyNjZvbXd1djJq" title="Instagram" className="instagram" target="_blank" rel="noopener noreferrer">
              <img src="/img/sns_icon_instagram_gray.png" alt="Instagram" />



            </a>
          </div>
          <div style={{ position: 'relative' }}>
            <div onClick={() => setFamilySiteOpen(!familySiteOpen)} style={{ padding: '6px 12px', fontSize: '10px', fontWeight: 600, textAlign: 'center', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', color: '#e0e0e0', cursor: 'pointer' }}>FAMILY SITE ▼</div>
            {familySiteOpen && (
              <ul style={{ position: 'absolute', bottom: '100%', right: 0, background: '#fff', border: '1px solid rgba(0,0,0,0.12)', borderRadius: '0', padding: '4px 0', margin: '0 0 4px 0', listStyle: 'none', zIndex: 100, minWidth: familySiteSelectWidthCh + 'ch', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
                {FAMILY_SITE_OPTIONS.filter(function(o) { return o.value; }).map(function(o) {
                  return <li key={o.value}><a href={o.value} target="_blank" rel="noopener noreferrer" style={{ display: 'block', padding: '8px 14px', fontSize: '12px', color: '#333', textDecoration: 'none', whiteSpace: 'nowrap' }}>{o.label}</a></li>;
                })}
              </ul>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span onClick={() => setPrivacyOpen(true)} style={{ fontSize: '16px', color: '#b8b8b8', cursor: 'pointer', textDecoration: 'none' }}>개인정보처리방침</span>
            <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '16px' }}>|</span>
            <span onClick={() => setEmailRefuseOpen(true)} style={{ fontSize: '16px', color: '#b8b8b8', cursor: 'pointer', textDecoration: 'none' }}>이메일무단수집거부</span>
          </div>

          </div>

        </div>
        <div className="footer-bottom">
          Copyright 2026 DASARANG CHURCH. All Rights Reserved.
        </div>
      </div>
      {privacyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setPrivacyOpen(false)}>
          <div className="relative bg-white max-w-3xl w-full max-h-[80vh] overflow-y-auto p-8" onClick={function(e) { e.stopPropagation(); }}>
            <button type="button" onClick={() => setPrivacyOpen(false)} className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center text-gray-900 hover:opacity-60" aria-label="닫기">
              <X className="h-6 w-6" strokeWidth={3} />
            </button>
            <h2 className="mb-4 text-lg font-bold text-black">개인정보 처리방침</h2>
            <div className="text-sm text-gray-900 space-y-4 leading-relaxed">
              <p>&#39;대전청소년위캔센터&#39;(이하 &#39;대전청소년위캔센터&#39;)은 개인정보 보호법 제30조에 따라 정보주체의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리지침을 수립 &#183; 공개합니다.</p>
            </div>
          </div>
        </div>
      )}

      {emailRefuseOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setEmailRefuseOpen(false)}>
          <div className="relative bg-white max-w-3xl w-full max-h-[80vh] overflow-y-auto p-8" onClick={function(e) { e.stopPropagation(); }}>
            <button type="button" onClick={() => setEmailRefuseOpen(false)} className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center text-gray-900 hover:opacity-60" aria-label="닫기">
              <X className="h-6 w-6" strokeWidth={3} />
            </button>
            <h2 className="mb-4 text-lg font-bold text-black">이메일무단수집거부</h2>
            <div className="text-sm text-gray-900 space-y-4 leading-relaxed">
              <p>본 웹사이트에 게시된 이메일 주소가 전자우편수집 프로그램이나 그 밖의 기술적 장치를 이용하여 무단으로 수집되는 것을 거부합니다. 이를 위반 시 정보통신망 이용촉진 및 정보보호 등에 관한 법률에 의해 처벌받을 수 있습니다.</p>
              <p className="text-xs text-gray-600">※ 상세 내용 추후 작성 예정입니다.</p>
            </div>
          </div>
        </div>
      )}

    </footer>
  );
}

