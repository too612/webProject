import { Link } from 'react-router-dom';
import { useCorpInfo } from '../common/corp/corpHook';

export default function Footer() {
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
          <div className="footer-social">
            <a href="#" title="Naver" className="naver">
              <img src="/img/sns_icon_naver_gray.png" alt="Naver" />
            </a>
            <a href="https://www.youtube.com/@dsr87450" title="YouTube" className="youtube" target="_blank" rel="noopener noreferrer">
              <img src="/img/sns_icon_youtube_gray.png" alt="YouTube" />
            </a>
            <a href="#" title="Kakao" className="kakao">
              <img src="/img/sns_icon_kakao_gray.png" alt="Kakao" />
            </a>
            <a href="#" title="Instagram" className="instagram">
              <img src="/img/sns_icon_instagram_gray.png" alt="Instagram" />
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          Copyright 2026 DASARANG CHURCH. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}