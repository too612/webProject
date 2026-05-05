import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer mt-auto">
      <div className="container">
        <div className="footer-content">
          <div className="footer-info">
            <Link to="/" aria-label="다사랑교회 홈" className="footer-logo">
              <img src="/img/logo.png" alt="다사랑교회 로고" />
            </Link>
            <div className="footer-details">
              <p>주소 : 세종특별자치시 집현북로 52 | 사업자등록 : 131-82-17285 | 대표자 : 홍길동</p>
              <p>전화 : 042-822-0000 | 팩스 : 042-822-0000 | 홈페이지 : http://libary.or.kr</p>
              <p>출판신고번호 : 제2021-세종반곡-00458호 | 발행인 : 홍길동 | 편집인 : 다사랑교회</p>
              <p>전화 : 042-822-0004-5 | 팩스 : 042-222-0040 | E-mail : libary@naver.com</p>
            </div>
          </div>
          <div className="footer-social">
            <a href="#" title="Facebook" className="facebook">
              <img src="/img/btn_lm_facebook.png" alt="Facebook" />
            </a>
            <a href="#" title="YouTube" className="youtube">
              <img src="/img/btn_lm_youtube.png" alt="YouTube" />
            </a>
            <a href="#" title="kakao" className="kakao">
              <img src="/img/btn_lm_kakao.png" alt="Kakao" />
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          Copyright by Daejeon Youth WE CAN CENTER. All rights reserved.
        </div>
      </div>
    </footer>
  );
}