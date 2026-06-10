// React 라이브러리에서 컴포넌트의 상태와 생명주기를 관리하는 핵심 기능들을 가져옵니다.
import { 
  useEffect, // 컴포넌트가 화면에 나타나거나 사라질 때, 혹은 특정 값이 바뀔 때 실행할 동작을 등록하는 기능입니다.
  useState   // 컴포넌트 내부에서 유지되고 변경되는 동적인 데이터(상태)를 생성하고 관리하는 기능입니다.
} from 'react'; 

// TypeScript 환경에서 컴포넌트 태그에 직접 적용할 인라인 스타일 객체의 타입을 가져옵니다.
import type { 
  CSSProperties // style={{ color: 'red' }} 처럼 자바스크립트로 CSS 속성을 적을 때 오타가 나지 않도록 검사해 주는 타입입니다.
} from 'react'; 

// React Router Dom 라이브러리에서 웹 페이지 주소 이동 및 경로 인식 관련 기능을 가져옵니다.
import { 
  Link,        // 새로고침 없이 부드럽게 페이지를 전환해 주는 리액트 전용 하이퍼링크(<a> 태그 역할) 태그입니다.
  useLocation  // 현재 사용자가 머물고 있는 웹 브라우저 주소창의 URL 경로 정보를 실시간으로 감지해 오는 기능입니다.
} from 'react-router-dom'; 

// 프로젝트 내부의 다른 폴더 시스템에서 메뉴, 인증, 기업 정보를 다루는 커스텀 기능들을 가져옵니다.
import { useMenu } from '../common/menu/menuHook'; // 서버로부터 받아온 동적 메뉴 데이터 배열을 제공하는 기능입니다.
import { useAuthStore } from '../common/auth/authStore'; // 로그인 여부, 유저 정보, 로그아웃 기능을 담은 중앙 전역 상태 저장소입니다.
import { useCorpInfo } from '../common/corp/corpHook'; // 현재 사이트에 표기할 교회/회사 정보를 커스텀하게 가져오는 기능입니다.
import type { MenuItem } from '../common/menu/menu.types'; // 메뉴 객체가 어떤 구조(ID, 이름, 경로 등)로 구성되어야 하는지 규정한 타입 양식입니다.


// 화면에 상단 바와 네비게이션 메뉴를 그려줄 Header 함수형 컴포넌트를 정의하고 바깥으로 내보냅니다.
export default function Header() {
  
  // useAuthStore() 저장소에서 현재 컴포넌트에 필요한 인증 상태, 유저 데이터, 로그아웃 제어 함수를 구조 분해하여 변수로 선언합니다.
  const { 
    isAuthenticated, // 사용자가 로그인했으면 true, 안 했으면 false가 할당되는 논리형 변수입니다.
    user,            // 로그인 성공 시 세부 회원 정보(이름, ID 등)가 담기는 객체 데이터 변수입니다.
    clearAuth        // 호출 시 로그인 정보를 지우고 브라우저를 로그아웃 상태로 전환시키는 명령 함수입니다.
  } = useAuthStore(); 

  // useCorpInfo() 기능에서 회사/교회 데이터를 추출하여 corpInfo라는 변수에 저장합니다.
  const { corpInfo } = useCorpInfo(); 

  // useLocation() 기능을 실행하여 주소창 정보를 획득한 뒤 location이라는 변수에 대입합니다.
  const location = useLocation(); 

  // useMenu() 기능에서 가공되지 않은 순수 원본 메뉴 리스트 배열을 추출하여 menuList라는 변수에 대입합니다.
  const { menuList } = useMenu(); 

  // 모바일 사이드바 메뉴가 펼쳐졌는지(true), 접혔는지(false)를 제어하는 상태 변수와 변경 함수를 선언합니다. 초기값은 닫힘(false)입니다.
  const [mobileNavOpen, setMobileNavOpen] = useState(false); 

  // 모바일 화면에서 어떤 대메뉴의 하위 메뉴 아코디언이 열렸는지를 '메뉴ID: 참/거짓' 형태로 관리하는 객체 상태 변수입니다. 초기값은 빈 객체 {} 입니다.
  const [openedSubmenus, setOpenedSubmenus] = useState<Record<string, boolean>>({}); 

  // corpInfo가 유효하면 내부에 적힌 corpName(이름)을 쓰고, 만약 객체가 비어있거나 이름이 없으면 널 병합 연산자(??)를 통해 '다사랑교회'를 기본값으로 씁니다.
  const corpName = corpInfo?.corpName ?? '다사랑교회';

  // 현재 브라우저 주소창 경로(location.pathname)가 '/erp'라는 문자열로 시작하는지 판별하여 그 참/거짓 결과를 isErpRoute 변수에 담습니다.
  const isErpRoute = location.pathname.startsWith('/erp');


  // 변수 선언과 동시에 함수를 만들어 그 자리에서 곧바로 실행시키는 '즉시 실행 함수' 형식으로 메뉴 가공 로직을 시작합니다.
  const topMenusFromApi = (() => {
    
    // 원본 menuList 배열의 내용물을 훼손하지 않기 위해 스프레드 연산자(...)로 복사한 뒤, 정렬 순서(orderNo) 번호가 낮은 순서대로 정렬합니다.
    const sortedMenus = [...menuList].sort((a, b) => (a.orderNo ?? 0) - (b.orderNo ?? 0));

    // 만약 현재 위치가 ERP 주소 영역이 아니라면 별도의 특수 가공이 필요 없으므로, 정렬된 배열을 즉시 반환하고 이 즉시 실행 함수를 탈출합니다.
    if (!isErpRoute) {
      return sortedMenus;
    }

    // 정규표현식을 이용하여 'M_SYS_숫자2자리'로 완벽하게 시작하고 끝나는 패턴을 정의합니다. (ERP 최상위 대메뉴 감지용)
    const erpTopIdPattern = /^M_SYS_\d{2}$/;
    
    // 정규표현식을 이용하여 'M_SYS_숫자2자리_숫자2자리'로 완벽하게 맺어지는 패턴을 정의합니다. (ERP 하위 소메뉴 감지용)
    const erpChildIdPattern = /^M_SYS_\d{2}_\d{2}$/;

    // 전체 정렬 메뉴 배열에서 방금 정의한 대메뉴 ID 패턴과 맞아떨어지는 요소들만 걸러내어(filter) ERP 대메뉴 후보군 배열을 생성합니다.
    const erpTopMenus = sortedMenus.filter((menu) => erpTopIdPattern.test(String(menu.menuId ?? '')));

    // 정규식으로 판별해 낸 ERP 전용 최상위 대메뉴 데이터가 최소 한 개 이상 배열에 발견되었다면 조건문 내부를 실행합니다.
    if (erpTopMenus.length > 0) {
      
      // .reduce 배열 순회 메서드를 사용하여, 흩어져 있는 소메뉴들을 부모 ID별로 묶어 거대한 딕셔너리 형태의 객체 구조로 축적해 나갑니다.
      const erpChildrenByTopId = sortedMenus.reduce<Record<string, MenuItem[]>>((acc, menu) => {
        // 현재 행의 메뉴 ID를 확보하고 안전하게 문자열로 치환합니다. 혹시 비어있다면 빈 글자('')로 우회시킵니다.
        const id = String(menu.menuId ?? '');
        
        // 만약 추출한 ID가 하위 소메뉴 패턴 규칙에 부합하지 않는 녀석이라면 아무 작업도 하지 않고 상자(acc)를 그대로 다음 순번으로 넘깁니다.
        if (!erpChildIdPattern.test(id)) return acc;

        // 소메뉴 ID 문자열을 언더바(_) 기준으로 쪼개어 분할 배열로 생성합니다. (예: 'M_SYS_01_02' -> ['M', 'SYS', '01', '02'])
        const parts = id.split('_'); 
        
        // 쪼개진 결과물 조각 중 2번째 인덱스 값을 활용하여 부모 대메뉴의 ID 형태를 역으로 재조립해 냅니다. (결과: 'M_SYS_01')
        const topId = `M_SYS_${parts[2]}`; 

        // 누적 상자 객체(acc) 안에 이번에 추출된 부모 ID('M_SYS_01')에 해당하는 데이터 방이 아직 개설되지 않았다면 조건문을 실행합니다.
        if (!acc[topId]) {
          acc[topId] = []; // 소메뉴 객체들을 안전하게 차곡차곡 밀어 넣을 수 있도록 빈 배열 상자([])를 해당 키 자리에 새로 만들어 줍니다.
        }
        
        // 준비된 부모 ID 방 배열 공간 안에 현재 순회 중인 소메뉴 객체를 추가(.push)하여 차곡차곡 쌓아 올립니다.
        acc[topId].push(menu); 
        
        // 소메뉴 정보가 새롭게 적재되어 한 단계 진화한 누적 객체 상자를 다음 데이터 순회를 위해 바깥으로 리턴합니다.
        return acc; 
      }, {}); // 최하단의 {} 기호는 이 누적 연산이 아무 데이터도 없는 깨끗한 빈 객체 상태에서 출발함을 명시하는 초기값입니다.

      // 걸러진 ERP 대메뉴 배열을 .map 메서드로 순회하며, 각 대메뉴 내부에 소메뉴 배열을 강제로 주입하는 변형 작업을 시작합니다.
      return erpTopMenus.map((menu) => {
        // 위 reduce 연산으로 완성된 소메뉴 묶음 상자에서 현재 대메뉴 ID와 매칭되는 소메뉴 배열을 조회해 오고, 없으면 빈 배열([])을 대안으로 삼습니다.
        const fallbackChildren = erpChildrenByTopId[menu.menuId] ?? [];
        
        // 대메뉴 자체에 subMenus가 이미 잘 채워져 있다면 그걸 쓰고, 비어 있다면 방금 조립해 둔 fallbackChildren을 장착한 후 오름차순 정렬(.sort)합니다.
        const mergedSubMenus = (menu.subMenus && menu.subMenus.length > 0 ? menu.subMenus : fallbackChildren)
          .slice()
          .sort((a, b) => (a.orderNo ?? 0) - (b.orderNo ?? 0));

        // 기존 대메뉴 객체의 오리지널 데이터 속성들을 스프레드 연산자(...menu)로 다 복사해 오되, subMenus 공간만 새로 정렬된 배열로 교체하여 반환합니다.
        return {
          ...menu,
          subMenus: mergedSubMenus,
        };
      });
    }

    // 만약 ERP 특수 패턴 ID가 전혀 감지되지 않는 일반적인 홈페이지 주소 도메인일 경우 작동하는 백업용 상위 메뉴 추출 분기입니다.
    const topLevelMenus = sortedMenus.filter((menu) => menu.level === 1 || !menu.parentId);
    
    // 일반 홈페이지 메뉴 구조의 부모 ID와 자식 소메뉴 리스트 간의 연결고리를 맺어주기 위한 객체 누적 적재 가동식입니다.
    const childrenByParent = sortedMenus.reduce<Record<string, MenuItem[]>>((acc, menu) => {
      if (!menu.parentId) return acc; // 상위 부모 식별자가 없는 루트 메뉴라면 분류 상자에 담지 않고 그냥 통과시킵니다.
      if (!acc[menu.parentId]) acc[menu.parentId] = []; // 누적 상자 내부에 해당 부모 ID 명의의 키가 존재하지 않으면 빈 배열 공간을 할당합니다.
      acc[menu.parentId].push(menu); // 확보된 부모 ID 방의 배열 안에 자기 자신인 소메뉴 정보를 삽입합니다.
      return acc; 
    }, {});

    // 추출된 일반 상위 메뉴 리스트를 회전시키며 하위 소메뉴 목록을 순서대로 바인딩하고 최종 완성형 메뉴 객체 배열로 뽑아냅니다.
    return topLevelMenus.map((menu) => {
      const fallbackChildren = childrenByParent[menu.menuId] ?? [];
      const mergedSubMenus = (menu.subMenus && menu.subMenus.length > 0 ? menu.subMenus : fallbackChildren)
        .slice()
        .sort((a, b) => (a.orderNo ?? 0) - (b.orderNo ?? 0));

      return {
        ...menu,
        subMenus: mergedSubMenus,
      };
    });
  })(); // 정의하자마자 자동 가동된 즉시 실행 함수가 종결되며 최종 보정된 메뉴 정보 결과물이 topMenusFromApi 변수에 이식됩니다.

  // API 서버로부터 정교하게 빌드된 메뉴의 총개수(length)가 0보다 크면 그 결과물을 최종 메뉴로 채택하고, 그렇지 않으면 하단의 기본 메뉴 구조 배열을 강제 할당합니다.
  const topMenus: MenuItem[] = topMenusFromApi.length > 0
    ? topMenusFromApi
    : [
        { menuId: 'official', menuName: '공식', path: '/', level: 1, orderNo: 1, subMenus: [] },
        { menuId: 'community', menuName: '공동체', path: '/community', level: 1, orderNo: 2, subMenus: [] },
        { menuId: 'erp', menuName: 'ERP', path: '/erp', level: 1, orderNo: 3, subMenus: [] },
        { menuId: 'system', menuName: '시스템', path: '/system', level: 1, orderNo: 4, subMenus: [] },
      ];


  // 모바일 전용 슬라이드 메뉴 창이 열리거나 닫힐 때([mobileNavOpen] 상태 감지), 뒷배경 전체 화면의 마우스 휠 스크롤을 통제하는 리액트 감시 효과 장치입니다.
  useEffect(() => {
    // 만약 현재 모바일 네비게이션바 열림 상태가 거짓(false, 즉 화면에서 숨겨진 상태)으로 들어온다면
    if (!mobileNavOpen) {
      document.body.classList.remove('mobile-nav-active'); // HTML 최상단 본문 <body> 태그 영역에 걸려있던 스크롤 원천 차단 CSS 클래스를 파기하여 스크롤을 해제합니다.
      return; // 하단의 클래스 추가 코드가 읽히지 않도록 이 시점에서 제어 흐름을 끊고 이펙트 함수를 조기 종료합니다.
    }
    
    // 만약 모바일 메뉴 창이 활짝 열린 상태(true)라면 화면이 뒤에서 따로 움직이지 못하도록 <body> 태그에 'mobile-nav-active' 클래스를 즉각 배정합니다.
    document.body.classList.add('mobile-nav-active');
    
    // 현재 화면 영역이 파괴되거나 다음 턴의 useEffect 로직이 시동되기 직전에 이펙트의 잔상을 말끔하게 정돈해 주는 반환 소멸(클린업) 함수입니다.
    return () => {
      document.body.classList.remove('mobile-nav-active'); // 바디 태그에 덧칠해졌던 특수 연출용 클래스를 완벽히 제거하여 브라우저의 기본 스크롤 메커니즘을 복원시킵니다.
    };
  }, [mobileNavOpen]); // 오직 대괄호에 적힌 이 mobileNavOpen 논리 데이터가 바뀔 때만 위의 전체 감시 메커니즘 코드가 재작동합니다.

  // 링크나 메뉴를 클릭하여 브라우저의 가상 주소창 경로([location.pathname]) 데이터가 다른 곳으로 변경되었음을 인지하는 감시 장치입니다.
  useEffect(() => {
    setMobileNavOpen(false); // 페이지 이동이 정상 접수되었으므로 화면 절반을 떡하니 뒤덮고 있던 모바일 사이드바 창을 보이지 않게 자동으로 축소 폐쇄(false) 처리합니다.
  }, [location.pathname]); // 주소창 URL 문자가 바뀔 때마다 매번 이 안쪽의 변경 기능이 호출됩니다.


  // 모바일 디바이스 뷰포트에서 상위 대메뉴 항목 우측에 배치된 꺾쇠 기호 단추를 탭했을 때 하위 아코디언 메뉴 리스트를 온/오프 토글하는 스위치 함수입니다.
  const toggleSubmenu = (menuId: string) => {
    // 서브메뉴 상태 업데이트 기능을 호출하고 이전 스냅샷 객체(prev)를 기반으로 구조를 개조합니다.
    // 기존에 활성화되어 켜져 있던 다른 메뉴의 방 번호 데이터들을 스프레드(...prev)로 안전하게 계승시킨 후, 방금 누른 [menuId] 방의 참/거짓 값만 반대로 대칭 전환합니다.
    setOpenedSubmenus((prev) => ({ ...prev, [menuId]: !prev[menuId] }));
  };

  // 모바일 메뉴바 맨 하층부에 도킹 배치될 패밀리 사이트 드롭다운 옵션 태그용 정적 데이터 주소록 정보 배열입니다.
  const familySiteOptions = [
    { value: '', label: 'FAMILY SITE' },
    { value: 'http://busan.psh.or.kr', label: '부산비전센터' },
    { value: 'http://ilsan.psh.or.kr', label: '일산드림센터' },
    { value: 'https://twowings.or.kr', label: '두날개교회' },
    { value: 'https://youtube.com', label: '유튜브 채널' },
  ];
  
  // 패밀리 사이트 선택지 한글 글자 수들 중 가장 길이가 긴 자릿수(Math.max)를 측정한 뒤, 우측 화살표 여백분인 8글자 크기를 합산해 셀렉트 박스의 동적 가로폭 규격을 ch 단위로 도출해 냅니다.
  const familySiteSelectWidthCh = Math.max(...familySiteOptions.map((option) => option.label.length)) + 8;


  // 최종 가공 작업과 상태 데이터 준비가 끝났으므로 화면에 구조화된 컴포넌트 마크업(JSX) 레이아웃을 뿌려줍니다.
  return (
    // 전체 헤더의 외곽선을 그리는 마스터 테두리 구역 태그입니다.
    // [Tailwind CSS 클래스 해석]
    // - header: 기존 레거시 CSS 파일과의 명칭 매칭을 위해 부여해 둔 고유 클래스 성표입니다.
    // - sticky top-0: 화면 스크롤 바를 밑으로 내리더라도 이 마스터 헤더 영역만큼은 브라우저 최상단 좌표(top:0)에 영구 박제되어 화면을 따라 움직입니다.
    // - z-50: 요소 간의 수직 층위 우선권(z-index)을 50레벨로 배정하여 일반 본문 텍스트나 레이어가 스크롤 될 때 헤더 위를 덮지 못하고 헤더 밑으로 깔려 숨어들게 통제합니다.
    // - bg-white: 헤더 영역의 배경 불투명 투색 상태를 올 화이트(흰색)로 지정합니다.
    // - shadow-sm: 헤더 최하단 경계 라인을 따라 은근하고 가벼운 미세 음영 그림자(box-shadow) 필터를 부여해 화면 본문과의 시각적 계층을 형성합니다.
    <header className="header sticky top-0 z-50 bg-white shadow-sm">
      
      {/* 로그인 상태창 링크들이 상주하는 연한 회색 빛의 최상단 미니 유틸리티 바 구역입니다. */}
      {/* bg-gray-50: 눈이 편안한 초경량 회색 배경, border-b: 하단에만 구분선 적용, border-gray-100: 구분선의 농도를 아주 흐릿하고 밝은 회색 조로 조율 */}
      <div className="header-top bg-gray-50 border-b border-gray-100">
        {/* max-w-[1200px] mx-auto: 레이아웃 최대 가로너비를 1200px로 클램핑하고 가운데 정렬, hidden md:block: 모바일 기기 해상도에서는 이 영역을 투명하게 증발시키고(hidden) 데스크톱 환경(md 이상)에서만 화면에 표시(block) */}
        <div className="container desktop-only max-w-[1200px] mx-auto px-5 hidden md:block">
          {/* flex items-center: 내부 소형 링크 문구들을 수평 1렬로 일렬 배치하고 위아래 정중앙에 정렬, gap-3: 링크 글씨 타이틀 간의 간격을 12px 간격으로 일정하게 격리 */}
          <div className="header-top-links flex items-center gap-3 py-1.5 text-sm text-gray-600">
            {/* 기본 시작 지점으로 회항할 수 있도록 홈 연결 통로용 리액트 라우터 링크 태그를 구성합니다. */}
            <Link to="/">홈으로</Link>
            {/* 메뉴 텍스트 간의 시각적 경계선 역할을 할 파이프(|) 기호를 배치하고 색상을 연하게 탈색시킵니다. */}
            <span className="separator text-gray-300">|</span>
            
            {/* [리액트 삼항 연산자 기반 조건부 렌더링 문법]
                로그인 검증 변수인 isAuthenticated가 true(로그인 상태)를 가리킨다면 물음표 바로 직후의 소괄호 내부 코드가 렌더링 되고, 
                만약 로그아웃된 상태(false)라면 저 밑단에 놓인 콜론(:) 우측의 로그인/회원가입 소괄호 마크업 덩어리가 화면을 대치합니다. */}
            {isAuthenticated ? (
              <> {/* React Fragment: 브라우저 DOM 결과물상에 불필요한 외곽 div 껍데기 태그를 유발시키지 않으면서 형제 태그들을 안전하게 꾸려 보내는 리액트용 가상 그룹화 보자기입니다. */}
                {/* style={{ ... }}: 인라인 형태로 직접 스타일 오브젝트를 주입합니다. 이름 글씨색을 고유 연두색(#4CAF50)으로 지정하고 폰트 두께감을 500레벨로 살짝 묵직하게 강화합니다. */}
                <span style={{ color: '#4CAF50', fontWeight: 500 }}>
                  {/* 유저 데이터 내부에 가입자 실명(userName) 정보가 기입되어 있다면 우선 출력하고, 없으면 대안으로 고유 계정ID(userId)를 송출하며, 완전 공란일 경우 '사용자'로 표명합니다. */}
                  {user?.userName ?? user?.userId ?? '사용자'}님 환영합니다
                </span>
                <span className="separator text-gray-300">|</span>
                {/* hover:text-brand-primary: 마우스 핑거 팁이 이 텍스트 링크의 경계선 내부로 안착하는 순간 글자 색상을 브랜드 아이덴티티 컬러로 순간 변조시킵니다. transition-colors: 색상 변동 시 0.15초간 색이 스르륵 스며드는 페이드 애니메이션 효과입니다. */}
                <Link to="/mypage" className="hover:text-brand-primary transition-colors">마이페이지</Link>
                <span className="separator text-gray-300">|</span>
                <Link to="/community" className="hover:text-brand-primary transition-colors">커뮤니티</Link>
                <span className="separator text-gray-300">|</span>
                <Link to="/erp" className="hover:text-brand-primary transition-colors">ERP</Link>
                <span className="separator text-gray-300">|</span>
                <Link to="/system" className="hover:text-brand-primary transition-colors">시스템관리</Link>
                <span className="separator text-gray-300">|</span>
                {/* 버튼 고유의 회색 각진 테두리와 탁한 배경을 전면 몰수하고(bg-transparent border-0), 마우스를 올리면 클릭형 커서(cursor-pointer)로 반응하게 개조한 로그아웃 방출 버튼입니다. */}
                <button type="button" onClick={clearAuth} className="hover:text-brand-primary transition-colors bg-transparent border-0 cursor-pointer text-sm text-inherit p-0">
                  로그아웃
                </button>
              </>
            ) : (
              <>
                {/* 현재 로그아웃 상태(isAuthenticated === false)임이 증명되었을 때 화면 전환을 거쳐 나타나는 비회원용 진입 게이트웨이 링크 쌍입니다. */}
                <Link to="/auth/login" className="hover:text-brand-primary transition-colors">로그인</Link>
                <span className="separator text-gray-300">|</span>
                <Link to="/auth/register" className="hover:text-brand-primary transition-colors">회원가입</Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 메인 헤더 벨트 구역 (브랜드 로고 심볼과 대형 PC 와이드 GNB 메뉴가 공존하는 핵심 단상입니다.) */}
      <div className="header-main border-b border-gray-200">
        {/* 문자열 템플릿 문법을 응용하여, 현재 열람 중인 노선이 ERP 비즈니스 관리망(isErpRoute)으로 판단될 경우 
            테두리 규격 폭 제한을 전면 해제하는 ' erp-wide max-w-full' 스타일 문자열을 끝자락에 동적 가산해 줍니다. */}
        <div className={`container max-w-[1200px] mx-auto px-5 flex items-center gap-4${isErpRoute ? ' erp-wide max-w-full' : ''}`}>
          
          {/* 웹사이트의 브랜드 아이덴티티를 상징하는 시각 로고 마크 링크 구역입니다. */}
          {/* flex-shrink-0: 화면 스케일이 협소해지거나 우측 네비게이션 메뉴 텍스트 개수가 범람하더라도 로고 이미지의 고유 가로폭이 강제로 압착되거나 축소 변형되지 않게 수호해 줍니다. */}
          <Link to="/" className="logo flex-shrink-0" aria-label={`${corpName} 홈`}>
            {/* block w-auto object-contain: 이미지를 블록화하고 본연의 종횡비를 엄격히 준수하면서 배정된 상자 틀 내부에 단정하게 가두어 픽셀 깨짐을 미연에 방지합니다. */}
            <img src="/img/logo.png" alt={`${corpName} 로고`} className="header-logo-image block w-auto object-contain" />
          </Link>
          
          {/* 데스크톱 모니터 와이드 환경에서 가로로 길게 뻗어 출력되는 대규모 PC용 내비게이션 바(GNB) 본체단입니다. */}
          {/* - hidden md:flex: 모바일/태블릿 화면 크기에서는 흔적도 없이 소멸했다가, 미디엄 화면 규격(md)에 도달하는 기점부터 세련된 가로 정렬 레이아웃(flex)으로 활성화됩니다.
              - ml-auto: 왼쪽 마진 간격을 밀어낼 수 있는 최고 한도치(auto)로 고정하여, 메뉴 레이아웃 덩어리 일체를 우측 끝벽 쪽으로 완전히 정렬시킵니다.
              - style={...}: 가공 단 단계에서 수집된 topMenus 대메뉴의 최종 배열 수치를 자바스크립트가 CSS 환경 변수창으로 전송해 주는 핵심 커스텀 인라인 스타일 연결 고리입니다. */}
          <nav
            className={`nav-main desktop-only hidden md:flex items-center gap-1 ml-auto${isErpRoute ? ' erp-menu' : ''}`}
            style={isErpRoute ? ({ '--erp-menu-count': topMenus.length } as CSSProperties) : undefined}
          >
            {/* 자바스크립트의 .map 반복 메서드를 기동하여, 확보된 대메뉴 데이터 배열을 루프 돌리며 가상 변수 menu에 객체를 담고 마크업 태그들을 실시간 복제 난사합니다. */}
            {topMenus.map((menu) => {
              
              // 각 순번의 menu 대메뉴 객체 내부에서 하위 소메뉴 subMenus 배열을 구조 추출하되, 
              // 만약 해당 데이터 공간이 없거나 정의되지 않은 상태(null/undefined)라면 오류 분기를 일으키지 말고 안전한 기본 빈 배열([])을 우측에서 공급받아 정착시키는 널 병합 연산자(??)입니다.
              const subMenus = menu.subMenus ?? [];
              
              // 메뉴 링크 태그에 장착할 타겟 주소를 판별합니다. 단축 평가 논리합 연산(||)을 통해 path 데이터가 최우선, 없으면 menuUrl을 채택하고 그것마저 공란이면 루트('/') 홈 주소를 이식합니다.
              const href = menu.path || menu.menuUrl || '/';
              
              return (
                // relative group: 자식 레이어 드롭다운 팝업창이 모니터 화면 밖으로 탈출하지 않도록 이 대메뉴 위치를 절대 좌표의 모체 기준점(relative)으로 삼고, 마우스 진입 이벤트를 감지할 그룹 울타리를 형성합니다.
                // key={menu.menuId}: 리액트 가상 DOM 엔진이 반복 복제 가동되는 수많은 형제 div 태그들 중 어떤 요소가 수정/삭제되었는지 초고속 추적할 수 있게 지명하는 고유 주민번호 낙인 마크입니다.
                <div className="dropdown relative group" key={menu.menuId}>
                  {/* 대메뉴 타이틀 명칭을 텍스트 링크 형태로 스크린 상에 바인딩합니다. */}
                  <Link
                    to={href}
                    className="block px-4 py-2 text-sm font-medium text-gray-700 hover:text-brand-primary transition-colors"
                  >
                    {menu.menuName} {/* 가공 단을 거쳐 최종 수립된 메뉴 명칭 글씨(예: 공동체, 시스템 등)가 출력됩니다. */}
                  </Link>
                  
                  {/* 단축 평가 문법: 상단 ?? 연산자로 최소 빈 배열 형태라도 철저히 사수한 subMenus의 개수(length)가 0보다 클 때만, 즉 실제로 하위 메뉴 리스트가 실재할 때만 우측의 소괄호 내부 드롭다운 상자 레이아웃을 생성합니다. */}
                  {subMenus.length > 0 && (
                    // absolute top-full left-0: 부모 대메뉴 박스의 수직 하단 한계선 지점(top-full)에 그림자처럼 딱 달라붙어 대기하는 절대 좌표계 공중 부양 팝업 상자입니다.
                    // hidden group-hover:block: 평상시 웹 서핑 시에는 투명하게 은폐 상태(hidden)를 지키고 있다가, 사용자가 마우스 커서를 부모 울타리 영역(group) 위로 올리는 순간(hover) 화면상에 정식 블록 요소를 등장(block)시킵니다.
                    <div className="dropdown-menu absolute top-full left-0 bg-white shadow-lg rounded-lg py-1 hidden group-hover:block z-50 min-w-36 border border-gray-100">
                      {/* 대메뉴의 심해에 묻혀있던 자식 소메뉴 리스트(subMenus)를 재차 2차 .map 반복 루프로 가동시켜 드롭다운 내부 링크들을 한 줄씩 연속 생산해 냅니다. */}
                      {subMenus.map((sub) => (
                        <Link
                          key={sub.menuId} // 자식 소메뉴 전용 유니크 식별 키 부여
                          to={sub.path || sub.menuUrl || '/'} // 하위 서브 카테고리 목적지 주소 세팅
                          // whitespace-nowrap: 소메뉴 글씨 타이틀 글자 수 수치가 과도하게 길어져도 임의로 엔터(줄바꿈) 현상을 발생시키지 않고 곧바르게 가로 방향 1열 종대로 글자 폭을 강제 고수합니다.
                          className="block px-4 py-2 text-sm text-gray-600 hover:text-brand-primary hover:bg-gray-50 whitespace-nowrap transition-colors"
                        >
                          {sub.menuName} {/* 개별 소메뉴 명칭 출력 */}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
          
          {/* 스마트폰 단말기 해상도 급의 뷰포트 환경에서 화면 오른쪽 상단에 출몰하는 세 줄짜리 격자 형태의 모바일 메뉴 개방 단추(햄버거 버튼)입니다. */}
          {/* - mobile-only: PC 해상도 와이드 화면에서는 CSS 미디어 쿼리가 작동하여 숨김 처리되고, 스마트폰 디스플레이 규격 이하에서만 시각 노출을 승인하는 커스텀 식별자입니다.
              - onClick: 이 버튼을 가볍게 터치 조작할 때마다 mobileNavOpen의 볼륨 값이 true에서 false로, false에서 true로 시소 타듯 대칭 반전되며 우측 사이드 바를 인출하거나 인입시킵니다. */}
          <button
            id="hamburger-btn"
            type="button"
            className={`hamburger mobile-only ml-auto${mobileNavOpen ? ' is-active' : ''}`}
            aria-label="메뉴 열기"
            aria-controls="mobile-nav"
            aria-expanded={mobileNavOpen}
            onClick={() => setMobileNavOpen((prev) => !prev)}
          >
            {/* 세 줄짜리 햄버거 가로 막대기 디자인 형상을 순수 CSS 테크닉으로 구축하기 위한 다용도 내부 데코레이션 태그 조각들입니다. */}
            <span className="hamburger-box">
              <span className="hamburger-inner" />
            </span>
          </button>
        </div>
      </div>

      {/* 모바일 대메뉴 서랍장이 오른쪽에서 슬라이딩 도어로 돌출되어 나왔을 때 본문 컨텐츠 화면 영역을 검은색 불투명 암전 상태로 차단해 주는 어두운 밤막 베일 레이어입니다. */}
      <div
        className={`mobile-nav-overlay${mobileNavOpen ? ' is-visible' : ''}`}
        onClick={() => setMobileNavOpen(false)} // 사이드바 바깥의 검게 변한 허공막 영역을 아무 데나 손가락으로 툭 치더라도 모바일 메뉴 서랍장이 매끄럽게 컴백하여 닫히도록 배려한 마우스 이벤트 트리거입니다.
        aria-hidden={!mobileNavOpen}
      />

      {/* 스마트폰 화면 좌/우측 가장자리 공간에서 스르륵 수평 이동하며 화면 전면부를 전격 도배해 오는 모바일 전용 수직 아코디언 메뉴 스크롤 패널입니다. */}
      <nav id="mobile-nav" className={`mobile-nav${mobileNavOpen ? ' is-open' : ''}`}>
        {/* 모바일 서랍장 메뉴판 내의 머리글 타운 구역 */}
        <div className="mobile-nav-header">
          {/* 브랜딩 간판 역할을 수행할 교회/회사 이름을 상단에 시원하게 대형 타이틀 링크 구조로 렌더링 배치합니다. */}
          <Link to="/" className="mobile-logo">{corpName}</Link>
        </div>
        
        {/* 모바일 서랍장 내부의 스크롤 작동형 메뉴 목록 바디 섹션입니다. */}
        <div className="mobile-nav-body">
          <ul className="mobile-menu-list">
            {/* 모바일 세로 레이아웃 규격 조건에 대응하기 위해 상단에서 마련해 둔 마스터 대메뉴 객체 배열을 들고 와 수직 순회형 .map 루프로 재가동시킵니다. */}
            {topMenus.map((menu) => {
              const subMenus = menu.subMenus ?? []; // 하위 소메뉴의 배열 안전성 2차 철저 확보
              const hasSubmenu = subMenus.length > 0; // 이 메뉴가 내부에 소지한 자식 소메뉴 리스트를 보유하고 있는 귀족 대메뉴인지 여부를 참/거짓으로 축적합니다.
              
              // openedSubmenus 상태 딕셔너리 객체 상자 안에서 현재 메뉴 ID 방을 조회해 보고, 
              // undefined 같은 애매한 결과 찌꺼기가 나올 위험을 배제하기 위해 이중 부정 연산자(!!)를 매개하여 100% 무결한 순수 boolean(참 혹은 거짓) 타입 값으로 체질을 개선해 보관합니다.
              const isOpen = !!openedSubmenus[menu.menuId];
              
              return (
                // 하위 자식 목록이 잡힌 대메뉴라면 클래스에 'has-submenu'를 수여하고, 더 나아가 모바일 사용자가 손가락으로 화살표를 탭하여 열어제낀 상태라면 'submenu-open'까지 누적 부여해 아코디언 서랍을 아래로 개방시킵니다.
                <li
                  key={menu.menuId}
                  className={hasSubmenu ? `has-submenu${isOpen ? ' submenu-open' : ''}` : ''}
                >
                  {/* 대메뉴 글씨 타이틀과 우측 터치형 화살표 버튼을 가로 수평 축선상에 나란히 정렬해 주는 1열 가로 행(Row) 벨트 상자입니다. */}
                  <div className="menu-item-row">
                    <Link to={menu.path || menu.menuUrl || '/'}>{menu.menuName}</Link>
                    {/* 만약 자식 소메뉴 리스트를 부하로 거느린 상위 대메뉴 항목임이 확정 확인되면, 접고 펼칠 수 있는 인터랙션용 아코디언 터치 단추(button)를 우측 끝자락에 배정합니다. */}
                    {hasSubmenu && (
                      <button
                        type="button"
                        className="submenu-toggle-btn"
                        onClick={() => toggleSubmenu(menu.menuId)} // 아코디언 단추 클릭 감지 시 해당 대메뉴 고유 번호판의 내부 열림 데이터를 참과 거짓 사이에서 왕복 전환 처리시킵니다.
                        aria-expanded={isOpen}
                      >
                        {/* 구글 머티리얼 시스템 웹 웹폰트 디자인 테크닉:
                            isOpen 변수의 상반된 상태 결과에 의거하여, 열림 상태(true)면 'expand_less' 단어를 출력해 컴포넌트가 위 화살표 모양( ∧ )을 드로잉 하게 유도하고, 
                            닫힘 상태(false)면 'expand_more' 텍스트를 공급해 아래 화살표 기호( ∨ ) 아이콘이 각인되게 처리합니다. */}
                        <span className="material-icons">{isOpen ? 'expand_less' : 'expand_more'}</span>
                      </button>
                    )}
                  </div>
                  
                  {/* 모바일 조작자가 우측 아코디언 토글 단추를 탭하여 상위 밸브를 개방했고(isOpen === true) 자식 소메뉴가 존재할 때만, 하위 소메뉴의 수직 리스트 묶음창(<ul className="submenu">)을 스크린에 개방합니다. */}
                  {hasSubmenu && (
                    <ul className="submenu">
                      {subMenus.map((sub) => (
                        <li key={sub.menuId}>
                          <Link to={sub.path || sub.menuUrl || '/'}>{sub.menuName}</Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
        
        {/* 모바일 사이드 바 패널의 가장 최하단 구석자리에 밀착 도킹된 꼬리말 베이스라인 타운 구역입니다. */}
        <div className="mobile-nav-footer">
          <div className="mobile-footer-top">
            {/* PC 환경의 유틸리티 바와 대등한 메커니즘으로 로그인 스토어 상태 변수의 참/거짓 판단 결과에 의거하여 비회원/회원 전용 기능 단추 구성을 동적으로 체인지 합니다. */}
            {isAuthenticated ? (
              <>
                <Link to="/mypage">마이페이지</Link>
                <span className="footer-separator">|</span>
                <button
                  type="button"
                  onClick={clearAuth} // 터치 터치 시 브라우저 내에 잔존하던 토큰 및 세션 키 스토어를 공중 분해시키고 초기 게스트 모드로 상태를 환원시키는 강제 퇴출 함수 가동
                  className="mobile-footer-action bg-transparent border-0 cursor-pointer text-inherit p-0"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link to="/auth/login">로그인</Link>
                <span className="footer-separator">|</span>
                <Link to="/auth/register">회원가입</Link>
              </>
            )}
          </div>
          
          {/* 모바일 화면 규격 최하단에 상주하는 유관 기관 채널 연동용 셀렉트 드롭다운 폼 레이아웃 공간입니다. */}
          <div className="mobile-footer-select">
            {/* select 태그를 개설하고 자바스크립트 산출 단에서 측정 완료해 둔 동적 타이틀 글자 자릿수(ch 폭 단위) 피드백 수치 스타일 객체를 인라인 가변 속성으로 주입합니다. */}
            <select
              className="family-site-select"
              defaultValue="" // 페이지 로딩 초창기에 아무 선택지도 고르지 않은 기본 빈 상단바 타이틀이 노출되도록 세팅
              style={{ width: `${familySiteSelectWidthCh}ch` }}
              // onChange: 조작자가 이 드롭다운 박스 메뉴 중 원하는 패밀리 웹사이트 주소지를 손가락으로 컨택하여 "선택 항목을 변경한 사건(Event)"을 캐치하는 동작 리스너 영역입니다.
              onChange={(event) => {
                // 가상 이벤트 타겟에 바인딩되어 올라온 option의 value값(즉, 도메인 인터넷 홈페이지 URL 주소)이 공백이 아닌 실제 유효 문자열로 들어왔다면 조건절을 통과합니다.
                if (event.target.value) {
                  // window.open(인터넷주소, 새창속성): 브라우저 시스템 핵심에 명령을 하달하여, 선택된 외부 홈페이지 도메인 주소 사이트를 기존 페이지의 이탈 없이 '새 브라우저 탭 창(_blank)'으로 안전하게 호명하여 오픈합니다.
                  // noopener, noreferrer: 하이퍼링크 새 창 전환 과정 중 발생 가능한 교차 출처 스크립트 해킹 공격 및 개인정보 유출을 방어하는 철통 보안 웹 표준 명세 코드입니다.
                  window.open(event.target.value, '_blank', 'noopener,noreferrer');
                  // 새 창 팝업 배송 미션을 성공적으로 마쳤으므로, 겉에 남은 선택창 상자의 타이틀 문구는 다시 평화로운 초기 기본 메시지('FAMILY SITE') 상태로 리셋 처리합니다(값 비워두기).
                  event.target.value = '';
                }
              }}
            >
              {/* 스크립트 전역 단에 객체화해 둔 familySiteOptions 외부 연동 데이터 배열을 .map 반복문 기법으로 회전시켜서 하위 셀렉트 <option> 태그들을 대량 찍어냅니다. */}
              {familySiteOptions.map((option) => (
                // value 주소 데이터가 존재하지 않는 첫 타이틀 옵션 칸의 경우, 리액트 고유키 매핑 에러 경고를 방어하고자 'default' 문자열 상수를 임시 대행 키로 주입합니다.
                <option key={option.value || 'default'} value={option.value}>
                  {option.label} {/* 사용자 시야에 식별되는 직관적인 홈페이지 한글 매장 타이틀명(예: 두날개교회)이 드롭다운 내부에 각인됩니다. */}
                </option>
              ))}
            </select>
          </div>
        </div>
      </nav>
    </header>
  );
}
/* =============================================================================
   [부록] Header 컴포넌트 소스 코드 이해를 돕기 위한 기초 문법 및 개념서
   =============================================================================
   
   1. JavaScript / TypeScript 핵심 문법 개념
   -----------------------------------------------------------------------------
   * 널 병합 연산자 (??)
     - 문법: A ?? B
     - 의미: 앞의 값(A)이 null이거나 undefined(데이터가 아예 없음) 상태일 때만, 
             뒤에 준비한 안전한 기본값(B)을 대안으로 선택하는 최신 자바스크립트 문법입니다.
     - 예시: menu.subMenus ?? [] -> 하위 메뉴 배열이 비어있다면 에러를 내지 말고 
             안전하게 빈 배열 상자([])를 대입해 달라는 뜻입니다.
             
   * 단축 평가 연산자 (&&, ||)
     - 문법: 조건 && 출력태그
     - 의미: 앞의 조건이 참(true)일 때만 우측에 적힌 HTML/태그를 화면에 그려줍니다.
     - 문법: 값A || 값B
     - 의미: 앞의 값A가 존재하면 그걸 쓰고, 비어있으면(거짓 취급되면) 뒤의 값B를 채택합니다.
     
   * 전개 연산자 / 스프레드 연산자 (...)
     - 문법: [...배열] 또는 {...객체}
     - 의미: 기존 배열이나 객체 이름 앞에 점 세 개(...)를 붙여서 내용물을 통째로 
              낱낱이 펼쳐 복사하는 문법입니다. 원본 데이터를 직접 수정하면 발생하는 
              예기치 못한 버그를 완벽히 차단하고 새로운 데이터 객체를 가공할 때 씁니다.
             
   * 이중 부정 연산자 (!!)
     - 문법: !!임의의데이터
     - 의미: 데이터에 어떤 값이 들어있든 상관없이, 100% 무결한 순수 참/거짓(true/false) 
             논리형 데이터 타입으로 강제 체질 개선(형변환)을 시킬 때 요긴하게 사용합니다.


   2. React (리액트) 프레임워크 핵심 개념
   -----------------------------------------------------------------------------
   * useState (상태 관리 훅)
     - 의미: 화면에 실시간으로 반영되어 지속적으로 변경되는 동적인 변수(상태)를 생성합니다. 
     - 특징: 리액트는 일반 자바스크립트 변수 값이 바뀌면 화면을 다시 그려주지 않지만, 
             이 useState로 만든 상태 변수 값이 바뀌면 화면을 자동으로 재출력(렌더링) 해 줍니다.
             
   * useEffect (부수 효과 제어 훅)
     - 의미: 컴포넌트가 화면에 최초로 나타나는 타이밍, 혹은 맨 뒤 대괄호([]) 안에 적어둔 
             감시 대상 변수의 값이 변경되는 특정 순간을 칼같이 포착하여 작동하는 감시 장치입니다.
     - 클린업(Cleanup): useEffect 내부에서 'return () => { ... }' 구조를 쓰면, 컴포넌트가 
             화면에서 사라지거나 다음 턴 동작이 일어날 때 기존에 남아있던 스타일 찌꺼기나 
             이벤트 리스너를 깔끔하게 청소해 내는 안전장치 역할을 합니다.
             
   * JSX와 .map() 반복문
     - 의미: 리액트는 자바스크립트 코드 내부에 HTML 마크업 태그를 직접 기술할 수 있는 
             JSX 문법을 탑재하고 있습니다. 여기에 자바스크립트 표준 배열 메서드인 .map()을 
             조합하면 배열 데이터의 개수만큼 HTML 태그들을 자동으로 대량 생산해 낼 수 있습니다.
             
   * 반복문 내 고유 식별자 key
     - 의미: 리액트 안에서 .map() 반복문으로 태그를 연쇄 생성할 때는, 최외곽 루트 태그에 
             반드시 'key={고유ID}'라는 속성을 도장 찍듯 명시해야 합니다. 
     - 특징: 그래야 가상 DOM 엔진이 수많은 복제 태그 중 어떤 요소가 수정, 삭제, 정렬되었는지 
             내부적으로 초고속 식별하여 화면 업데이트 성능 최적화를 달성할 수 있습니다.


   3. Tailwind CSS (테일윈드) 반응형 웹 디자인 개념
   -----------------------------------------------------------------------------
   * 유틸리티 퍼스트 (Utility-First) 클래스
     - 의미: 별도의 스타일시트 파일(.css)로 넘어가서 클래스명을 작명하고 스타일을 코딩할 필요 없이, 
             HTML 태그의 className="" 내부에 미리 정의된 축약형 스타일 키워드들을 
             단어 조립하듯 적어서 곧바로 디자인을 완성하는 모던 CSS 기법입니다.
     - 예시: bg-white (배경색 흰색), shadow-sm (미세 그림자), sticky top-0 (상단 고정 스크롤)
     
   * 반응형 미디어 쿼리 접두사 (md:, hidden)
     - 의미: 테일윈드는 기본적으로 모바일 스크린 환경의 해상도를 최우선(Mobile-First) 기준으로 설계합니다. 
     - 특징: 평상시에는 'hidden' 클래스를 매겨 스마트폰 환경에서 요소를 증발시켜 두었다가, 
             앞에 화면 규격 제한자인 'md:'(미디엄 디바이스, PC 모니터 규격)를 조합해 'md:block' 
             또는 'md:flex'라고 결합해 주면 "폰에서는 숨기고, PC 화면 크기로 넓어지면 그때서야 
             레이아웃을 활성화해 노출해라"라는 고도의 반응형 디자인을 CSS 파일 없이 한 번에 구현합니다.
             
   ============================================================================= */