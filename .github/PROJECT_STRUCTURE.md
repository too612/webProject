# 프로젝트 구조 문서

## 📋 개요
이 문서는 **작은도서관** 웹 프로젝트의 전체 골격과 구조를 설명합니다.
`ceo.html`을 기점으로 분석한 레이아웃 시스템, 컨트롤러 구조, 데이터 흐름 등을 포함합니다.

---

## 🛠 기술 스택

### Backend
- **Java**: 21 (LTS)
- **Spring Boot**: 3.3.1
- **Spring Security**: 인증/인가 관리 (현재는 모든 요청 허용, 커스텀 인증 사용)
- **MyBatis**: 3.0.4 (SQL Mapper)
- **Lombok**: 보일러플레이트 코드 감소

### Database
- **PostgreSQL**: 메인 데이터베이스
- **JDBC URL**: `jdbc:postgresql://localhost:5432/DEV`

### Frontend
- **Thymeleaf**: 서버 사이드 템플릿 엔진
- **Thymeleaf Layout Dialect**: 레이아웃 상속 및 Fragment 시스템
- **CSS**: 커스텀 스타일 (`/css/main.css`)
- **JavaScript**: 공통 스크립트 (`common.js`, `chatbot.js`)

### Build Tool
- **Gradle**: 빌드 자동화 도구

---

## 📁 프로젝트 디렉토리 구조

```
webProject/
├── src/
│   ├── main/
│   │   ├── java/com/main/app/
│   │   │   ├── AppApplication.java          # Spring Boot 메인 클래스
│   │   │   ├── ServletInitializer.java      # WAR 배포를 위한 초기화
│   │   │   ├── config/                      # 설정 클래스
│   │   │   │   ├── DatamainConfig.java      # 데이터소스 설정
│   │   │   │   └── SecurityConfig.java      # Spring Security 설정
│   │   │   ├── controller/                  # MVC 컨트롤러
│   │   │   │   ├── GlobalControllerAdvice.java  # 전역 모델 속성 관리
│   │   │   │   ├── CompanyController.java       # 회사소개 페이지
│   │   │   │   ├── BoardController.java         # 게시판
│   │   │   │   ├── ProductController.java       # 제품 소개
│   │   │   │   ├── SupportController.java       # 고객지원
│   │   │   │   ├── UserController.java          # 사용자 관리
│   │   │   │   └── MainController.java          # 메인 페이지
│   │   │   ├── service/                     # 비즈니스 로직
│   │   │   │   ├── MainService.java
│   │   │   │   ├── BoardService.java
│   │   │   │   └── AutoNoService.java
│   │   │   ├── mapper/                      # MyBatis 인터페이스
│   │   │   │   ├── MenuMapper.java
│   │   │   │   ├── BoardMapper.java
│   │   │   │   └── UserMapper.java
│   │   │   ├── model/                       # DTO/Entity
│   │   │   │   ├── MenuDto.java
│   │   │   │   ├── BoardDto.java
│   │   │   │   └── UserDto.java
│   │   │   └── exception/                   # 예외 처리
│   │   │       └── GlobalExceptionHandler.java
│   │   └── resources/
│   │       ├── application.properties       # 애플리케이션 설정
│   │       ├── mapper/                      # MyBatis XML 매퍼
│   │       │   ├── MenuMapper.xml
│   │       │   ├── BoardMapper.xml
│   │       │   └── UserMapper.xml
│   │       ├── static/                      # 정적 리소스
│   │       │   ├── css/main.css
│   │       │   ├── js/
│   │       │   │   ├── common.js
│   │       │   │   └── chatbot.js
│   │       │   └── img/
│   │       └── templates/                   # Thymeleaf 템플릿
│   │           ├── index.html               # 메인 페이지
│   │           ├── layout/                  # 레이아웃 Fragment
│   │           │   ├── layout.html          # 기본 레이아웃 템플릿
│   │           │   ├── header.html          # 헤더 Fragment
│   │           │   ├── footer.html          # 푸터 Fragment
│   │           │   ├── sidebar.html         # 사이드바 Fragment
│   │           │   └── submenu.html         # 서브메뉴 레이아웃
│   │           ├── company/                 # 회사소개 페이지
│   │           │   ├── ceo.html
│   │           │   ├── mission.html
│   │           │   ├── history.html
│   │           │   └── location.html
│   │           ├── product/                 # 제품 소개 페이지
│   │           ├── support/                 # 고객지원 페이지
│   │           │   ├── board.html
│   │           │   ├── notice.html
│   │           │   ├── qna.html
│   │           │   └── faq.html
│   │           └── user/                    # 사용자 페이지
│   │               ├── login.html
│   │               └── register.html
│   └── test/                                # 테스트 코드
└── build.gradle                              # Gradle 빌드 설정
```

---

## 🎨 레이아웃 시스템 구조

### 1. Layout Dialect 기반 상속 모델

프로젝트는 **Thymeleaf Layout Dialect**를 사용하여 템플릿 상속 구조를 구현합니다.

#### 레이아웃 계층 구조

```
layout.html (기본 레이아웃)
    ├── header.html (Fragment)
    ├── submenu.html (조건부)
    │   └── sidebar.html (Fragment)
    ├── content (페이지별 콘텐츠)
    └── footer.html (Fragment)
```

### 2. 핵심 레이아웃 파일 분석

#### 📄 `layout.html` - 기본 레이아웃 템플릿
**역할**: 모든 페이지의 기본 골격을 제공하는 마스터 템플릿

**주요 구성 요소**:
```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org"
      xmlns:layout="http://www.ultraq.net.nz/thymeleaf/layout">
<head>
    <!-- 공통 CSS 및 메타태그 -->
    <link rel="stylesheet" th:href="@{/css/main.css}">
</head>
<body>
    <!-- 헤더 Fragment 삽입 -->
    <header th:replace="~{layout/header :: header}"></header>

    <!-- 서브메뉴가 있는 경우 (조건부 렌더링) -->
    <div th:if="${submenu == 'Y' or (currentSubMenus != null and !#lists.isEmpty(currentSubMenus))}">
        <div th:replace="~{layout/submenu :: submenuLayout}"></div>
    </div>
    
    <!-- 서브메뉴가 없는 경우: 전체 너비로 콘텐츠 표시 -->
    <div th:unless="${submenu == 'Y' or (currentSubMenus != null and !#lists.isEmpty(currentSubMenus))}">
        <div layout:fragment="content"></div>
    </div>

    <!-- 푸터 Fragment 삽입 -->
    <footer th:replace="~{layout/footer :: footer}"></footer>
    
    <!-- 모바일 내비게이션 -->
    <nav id="mobile-nav" class="mobile-nav">
        <!-- 햄버거 메뉴 콘텐츠 -->
    </nav>
    
    <!-- 공통 JavaScript -->
    <script th:src="@{/js/common.js}"></script>
    <script th:src="@{/js/chatbot.js}"></script>
</body>
</html>
```

**특징**:
- 서브메뉴 유무에 따라 레이아웃 동적 변경
- Fragment를 통한 모듈화된 구조
- 반응형 디자인 (데스크톱/모바일 구분)

#### 📄 `header.html` - 헤더 Fragment
**역할**: 상단 네비게이션 및 로고, 사용자 정보 표시

**주요 구성 요소**:
```html
<header th:fragment="header" class="header">
    <div class="header-top">
        <!-- 로그인/회원가입 링크 또는 사용자 정보 -->
        <span th:if="${sessionUserId == null}">
            <a href="/user/login">로그인</a>
            <a href="/user/register">회원가입</a>
        </span>
        <span th:if="${sessionUserId != null}">
            <span th:text="${sessionUserName} + '님 환영합니다'"></span>
            <a href="/user/logout">로그아웃</a>
        </span>
    </div>
    <div class="header-main">
        <a href="/" class="logo">작은도서관</a>
        <!-- 데스크톱 메뉴 (드롭다운) -->
        <nav class="nav-main desktop-only">
            <div class="dropdown" th:each="menu : ${menuList}">
                <a th:href="${menu.path}" th:text="${menu.menuName}"></a>
                <div class="dropdown-menu" th:if="${!#lists.isEmpty(menu.subMenus)}">
                    <a th:each="subMenu : ${menu.subMenus}" 
                       th:href="${subMenu.path}" 
                       th:text="${subMenu.menuName}"></a>
                </div>
            </div>
        </nav>
        <!-- 모바일 햄버거 버튼 -->
        <button id="hamburger-btn" class="hamburger mobile-only"></button>
    </div>
</header>
```

**특징**:
- 세션 기반 사용자 인증 상태 표시
- DB에서 동적으로 로드된 메뉴 구조
- 데스크톱/모바일 반응형 메뉴

#### 📄 `submenu.html` - 서브메뉴 레이아웃
**역할**: 사이드바와 콘텐츠 영역을 포함하는 서브페이지 레이아웃

**주요 구성**:
```html
<div th:fragment="submenuLayout">
    <!-- Hero Section -->
    <section class="hero">
        <h1 th:text="${currentTopMenu.menuName}">메뉴 이름</h1>
    </section>

    <!-- Breadcrumb (빵 부스러기 네비게이션) -->
    <section class="breadcrumb">
        <nav class="breadcrumb-nav">
            <div class="breadcrumb-item" onclick="location.href='/'">
                <span class="material-icons">home</span>
            </div>
            <span class="breadcrumb-separator">></span>
            <div class="breadcrumb-item dropdown">
                <span th:text="${currentTopMenu.menuName}">메뉴</span>
            </div>
        </nav>
    </section>

    <!-- 메인 콘텐츠 영역 (사이드바 + 콘텐츠) -->
    <div class="main-content-wrapper">
        <!-- 사이드바 -->
        <aside class="sidebar" th:include="~{layout/sidebar :: sidebarFragment}"></aside>
        
        <!-- 콘텐츠 -->
        <main class="content">
            <div layout:fragment="content"></div>
        </main>
    </div>
</div>
```

#### 📄 `sidebar.html` - 사이드바 Fragment
**역할**: 서브메뉴 네비게이션 표시

```html
<aside class="sidebar" th:fragment="sidebarFragment">
    <ul class="sidebar-menu">
        <li th:each="subMenu : ${currentSubMenus}" 
            th:classappend="${subMenu.active ? 'is-active' : ''}">
            <a th:href="${subMenu.path}" th:text="${subMenu.menuName}">서브메뉴</a>
        </li>
    </ul>
</aside>
```

#### 📄 `footer.html` - 푸터 Fragment
**역할**: 회사 정보 및 저작권 표시

```html
<footer th:fragment="footer" class="footer">
    <div class="container">
        <div class="footer-info">
            <p>주소 | 전화 | 이메일 등</p>
        </div>
        <div class="footer-bottom">
            Copyright by Company. All rights reserved.
        </div>
    </div>
</footer>
```

### 3. 페이지 템플릿 예시: `ceo.html`

**구조**:
```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org"
      xmlns:layout="http://www.ultraq.net.nz/thymeleaf/layout"
      layout:decorate="~{layout/layout}">

<head>
    <title>CEO 인사말</title>
</head>

<body>
    <!-- 이 부분이 layout.html의 content Fragment에 삽입됨 -->
    <div layout:fragment="content">
        <h2>CEO 인사말</h2>
        <p>콘텐츠 내용</p>
    </div>
</body>
</html>
```

**동작 원리**:
1. `layout:decorate="~{layout/layout}"`: `layout.html`을 기본 레이아웃으로 상속
2. `layout:fragment="content"`: 이 영역이 layout.html의 content 영역에 삽입됨
3. `CompanyController`에서 `submenu` 플래그가 "Y"로 설정되어 사이드바 표시

---

## 🔄 데이터 흐름 및 처리 구조

### 1. 메뉴 시스템 아키텍처

#### 메뉴 데이터 흐름

```
[Database (PostgreSQL)]
        ↓
[MenuMapper.xml] ← SQL 쿼리
        ↓
[MenuMapper.java] ← MyBatis 인터페이스
        ↓
[MenuService.java] ← 비즈니스 로직 (계층 구조 생성)
        ↓
[GlobalControllerAdvice.java] ← 모든 요청에 메뉴 데이터 주입
        ↓
[Model] → Thymeleaf 템플릿에 전달
        ↓
[header.html, sidebar.html] ← 메뉴 렌더링
```

#### GlobalControllerAdvice의 역할

`GlobalControllerAdvice`는 **모든 컨트롤러**의 요청 처리 전에 실행되어 공통 모델 속성을 추가합니다.

**주요 기능**:
1. **세션 정보 주입**: `sessionUserId`, `sessionUserName`, `sessionLoginUser`
2. **메뉴 데이터 주입**: `menuList`, `topMenuList`, `allTopMenus`
3. **현재 페이지 메뉴 매칭**: 요청 URI를 기반으로 현재 활성 메뉴 찾기
4. **사이드바 데이터 설정**: `currentSubMenus`, `currentTopMenu`, `submenu` 플래그

**코드 예시**:
```java
@ControllerAdvice
public class GlobalControllerAdvice {
    
    @Autowired
    private MenuService menuService;
    
    @ModelAttribute
    public void addCommonAttributes(Model model, HttpServletRequest request, HttpSession session) {
        // 1. 세션 정보 추가
        Object userId = session.getAttribute("userId");
        if (userId != null) {
            model.addAttribute("sessionUserId", userId);
            model.addAttribute("sessionUserName", session.getAttribute("userName"));
        }
        
        // 2. 계층 구조 메뉴 조회 (한 번만 호출)
        List<MenuDto> hierarchicalMenus = menuService.getHierarchicalMenus();
        model.addAttribute("menuList", hierarchicalMenus);
        model.addAttribute("allTopMenus", hierarchicalMenus);
        
        // 3. 현재 요청 URI로 메뉴 매칭
        String currentUri = request.getRequestURI();
        MenuDto currentMenu = findBestMatchMenu(hierarchicalMenus, currentUri);
        
        // 4. 최상위 메뉴 찾기
        MenuDto topMenu = menuService.findTopMenuByPath(currentMenu.getPath());
        
        // 5. 서브메뉴의 active 상태 설정
        if (topMenu.getSubMenus() != null) {
            topMenu.getSubMenus().forEach(subMenu -> {
                subMenu.setActive(currentMenu.getPath().equals(subMenu.getPath()));
            });
            model.addAttribute("submenu", "Y"); // 서브메뉴 표시 플래그
        }
        
        // 6. 모델에 속성 추가
        model.addAttribute("currentTopMenu", topMenu);
        model.addAttribute("currentSubMenus", topMenu.getSubMenus());
        model.addAttribute("currentMenu", currentMenu);
    }
    
    // URI와 메뉴 경로를 매칭하는 로직 (Prefix Match)
    private MenuDto findBestMatchMenu(List<MenuDto> menus, String currentUri) {
        MenuDto bestMatch = null;
        int maxLen = -1;
        
        for (MenuDto menu : menus) {
            if (menu.getPath() != null && currentUri.startsWith(menu.getPath())) {
                if (menu.getPath().length() > maxLen) {
                    bestMatch = menu;
                    maxLen = menu.getPath().length();
                }
            }
            
            // 재귀적으로 하위 메뉴 검색
            if (menu.getSubMenus() != null) {
                MenuDto subMatch = findBestMatchMenu(menu.getSubMenus(), currentUri);
                if (subMatch != null && subMatch.getPath().length() > maxLen) {
                    bestMatch = subMatch;
                    maxLen = subMatch.getPath().length();
                }
            }
        }
        return bestMatch;
    }
}
```

### 2. 컨트롤러 패턴

#### CompanyController 분석

```java
@Controller
@RequestMapping("/company")
public class CompanyController {
    
    // 공통 속성 설정 메서드
    private void addCompanyPageAttributes(Model model) {
        // GlobalControllerAdvice에서 이미 메뉴를 처리하므로
        // 여기서는 submenu 플래그만 설정
        model.addAttribute("submenu", "Y");
    }

    @GetMapping("/ceo")
    public String ceoPage(Model model) {
        addCompanyPageAttributes(model);
        // CEO 페이지 특정 데이터 추가 (필요시)
        return "company/ceo"; // templates/company/ceo.html 반환
    }

    @GetMapping("/mission")
    public String missionPage(Model model) {
        addCompanyPageAttributes(model);
        return "company/mission";
    }
    
    // 기타 회사소개 페이지...
}
```

**특징**:
- `GlobalControllerAdvice`가 공통 작업을 처리하므로 컨트롤러는 단순함
- `submenu` 플래그 설정으로 사이드바 표시 여부 제어
- 페이지별 추가 데이터는 각 메서드에서 처리

### 3. MyBatis Mapper 구조

#### MenuMapper.java (인터페이스)
```java
@Mapper
public interface MenuMapper {
    List<MenuDto> selectAllMenus();
    MenuDto findTopMenuByPath(String path);
}
```

#### MenuMapper.xml (SQL 쿼리)
```xml
<mapper namespace="com.main.app.mapper.MenuMapper">
    <select id="selectAllMenus" resultType="MenuDto">
        SELECT 
            menu_id, 
            menu_name, 
            path, 
            parent_id, 
            level, 
            order_no
        FROM menu
        ORDER BY order_no
    </select>
    
    <select id="findTopMenuByPath" resultType="MenuDto">
        SELECT * FROM menu 
        WHERE path = #{path} AND level = 1
    </select>
</mapper>
```

---

## 🔐 보안 및 인증

### Spring Security 설정

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
            .authorizeHttpRequests(auth -> auth.anyRequest().permitAll())
            .csrf(csrf -> csrf.disable())
            .formLogin(form -> form.disable())
            .httpBasic(basic -> basic.disable())
            .build();
    }
}
```

**현재 설정**:
- 모든 요청 허용 (`permitAll()`)
- CSRF 비활성화
- 커스텀 세션 기반 인증 사용

---

## 🗂 데이터베이스 구조

### 주요 테이블

#### 1. menu (메뉴 테이블)
```sql
menu_id      VARCHAR     -- 메뉴 ID
menu_name    VARCHAR     -- 메뉴 이름
path         VARCHAR     -- URL 경로
parent_id    VARCHAR     -- 부모 메뉴 ID
level        INT         -- 메뉴 레벨 (1: 최상위, 2: 서브메뉴)
order_no     INT         -- 정렬 순서
```

#### 2. board (게시판 테이블)
- 게시글 정보 저장

#### 3. user (사용자 테이블)
- 사용자 인증 정보 저장

---

## 📝 주요 모델 (DTO)

### MenuDto
```java
@Data
public class MenuDto {
    private String menuId;        // 메뉴 ID
    private String menuName;      // 메뉴 이름
    private String menuUrl;       // 메뉴 URL
    private String parentId;      // 부모 메뉴 ID
    private String path;          // 경로
    private int level;            // 레벨 (1: 최상위, 2: 서브)
    private int orderNo;          // 정렬 순서
    private List<MenuDto> subMenus = new ArrayList<>();  // 하위 메뉴
    private boolean active = false;  // 현재 활성 상태
}
```

---

## 🚀 애플리케이션 실행

### 로컬 개발 환경

1. **PostgreSQL 실행**
   ```bash
   # 데이터베이스: DEV
   # 사용자: DEV / dev
   ```

2. **애플리케이션 실행**
   ```bash
   ./gradlew bootRun
   ```

3. **접속**
   ```
   http://localhost:8080
   ```

---

## 🎯 페이지 요청 흐름 예시

### 사용자가 `/company/ceo` 접속 시

```
1. 사용자 요청: GET /company/ceo

2. GlobalControllerAdvice 실행
   ├─ 세션에서 사용자 정보 조회
   ├─ DB에서 전체 메뉴 조회 (MenuService)
   ├─ 현재 URI(/company/ceo)로 메뉴 매칭
   ├─ 최상위 메뉴 찾기 (회사소개)
   ├─ 서브메뉴 active 상태 설정 (CEO 인사말 = active)
   └─ Model에 속성 추가:
       - menuList: 전체 메뉴
       - currentTopMenu: 회사소개
       - currentSubMenus: [CEO 인사말, 미션, 연혁, 오시는 길]
       - submenu: "Y"

3. CompanyController.ceoPage() 실행
   ├─ submenu 플래그 "Y" 추가 (중복이지만 명시적 설정)
   └─ "company/ceo" 뷰 이름 반환

4. Thymeleaf 렌더링
   ├─ ceo.html이 layout.html을 상속 (layout:decorate)
   ├─ layout.html 렌더링 시작
   │   ├─ header.html 삽입
   │   │   ├─ sessionUserId 확인 → 로그인 상태 표시
   │   │   └─ menuList로 네비게이션 메뉴 렌더링
   │   ├─ submenu == "Y" → submenu.html 삽입
   │   │   ├─ Hero Section: "회사소개" 표시
   │   │   ├─ Breadcrumb: 홈 > 회사소개 > CEO 인사말
   │   │   ├─ sidebar.html 삽입
   │   │   │   └─ currentSubMenus로 사이드바 메뉴 렌더링
   │   │   │       └─ "CEO 인사말" active 상태로 강조
   │   │   └─ content 영역에 ceo.html의 content fragment 삽입
   │   └─ footer.html 삽입
   └─ HTML 응답 생성

5. 클라이언트에 HTML 전송
   └─ 브라우저 렌더링
```

---

## 📌 핵심 설정 파일

### application.properties

```properties
# Server
server.port=8080
server.servlet.context-path=/

# Database
spring.datasource.driver-class-name=org.postgresql.Driver
spring.datasource.url=jdbc:postgresql://localhost:5432/DEV
spring.datasource.username=DEV
spring.datasource.password=dev

# MyBatis
mybatis.mapper-locations=classpath:mapper/**/*.xml
mybatis.type-aliases-package=com.main.app.model
mybatis.configuration.map-underscore-to-camel-case=true

# Thymeleaf
spring.thymeleaf.prefix=classpath:/templates/
spring.thymeleaf.suffix=.html
spring.thymeleaf.mode=HTML
spring.thymeleaf.encoding=UTF-8
spring.thymeleaf.cache=false

# Logging
logging.level.root=INFO
logging.file.name=logs/company-website.log
```

---

## 🔧 주요 기능 모듈

### 1. 회사소개 (`/company/*`)
- CEO 인사말
- 미션 & 비전
- 회사 연혁
- 오시는 길

### 2. 사업분야 (`/business/*`)
- 시스템 구축
- 사업 영역

### 3. 제품소개 (`/product/*`)
- System A
- System B

### 4. 고객지원 (`/support/*`)
- 공지사항
- FAQ
- Q&A (로그인 필요)
- 자료실

### 5. 사용자 관리 (`/user/*`)
- 로그인/로그아웃
- 회원가입
- 마이페이지

---

## 📐 디자인 시스템

### CSS 구조
- **main.css**: 통합 스타일시트
  - 레이아웃 스타일
  - 컴포넌트 스타일 (버튼, 폼, 카드 등)
  - 반응형 미디어 쿼리

### 반응형 전략
- **데스크톱**: 풀 레이아웃 (헤더, 사이드바, 콘텐츠)
- **모바일**: 햄버거 메뉴, 세로 스택 레이아웃

### 주요 클래스
- `.header`, `.footer`: 상단/하단 영역
- `.sidebar`: 사이드바
- `.main-content-wrapper`: 콘텐츠 컨테이너
- `.hero`: 페이지 상단 타이틀 영역
- `.breadcrumb`: 경로 네비게이션

---

## 🐛 에러 처리

### GlobalExceptionHandler
```java
@ControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(Exception.class)
    public String handleException(Exception e, Model model) {
        model.addAttribute("error", e.getMessage());
        return "error";
    }
}
```

---

## 📚 참고 사항

### Thymeleaf 주요 문법
- `th:text`: 텍스트 바인딩
- `th:href`: URL 바인딩
- `th:if` / `th:unless`: 조건부 렌더링
- `th:each`: 반복문
- `th:replace` / `th:include`: Fragment 삽입
- `layout:decorate`: 레이아웃 상속
- `layout:fragment`: Fragment 정의

### MyBatis 네이밍 규칙
- **Mapper Interface**: `XxxMapper.java`
- **Mapper XML**: `XxxMapper.xml`
- **Namespace**: Java 인터페이스의 풀 패키지 경로와 일치

---

## ✅ 체크리스트

### 새로운 페이지 추가 시
1. ✅ 컨트롤러에 GetMapping 메서드 추가
2. ✅ `submenu` 플래그 설정 (사이드바 필요 시)
3. ✅ `templates/` 아래에 HTML 파일 생성
4. ✅ `layout:decorate="~{layout/layout}"` 선언
5. ✅ `layout:fragment="content"` 영역에 콘텐츠 작성
6. ✅ DB에 메뉴 데이터 등록 (필요 시)

### 새로운 기능 추가 시
1. ✅ Service 인터페이스 및 구현체 생성
2. ✅ Mapper 인터페이스 생성
3. ✅ Mapper XML에 SQL 작성
4. ✅ DTO 모델 생성
5. ✅ 컨트롤러에서 Service 호출
6. ✅ 뷰에 데이터 바인딩

---

## 🎓 학습 포인트

1. **Thymeleaf Layout Dialect**: 템플릿 상속으로 코드 재사용성 극대화
2. **GlobalControllerAdvice**: 공통 로직을 한 곳에서 관리하여 중복 제거
3. **Fragment 패턴**: header, footer, sidebar를 모듈화하여 유지보수성 향상
4. **동적 메뉴 시스템**: DB 기반 메뉴로 유연한 사이트 구조 관리
5. **RESTful URL 설계**: `/company/ceo`, `/support/qna` 등 직관적인 경로 구조

---

## 📞 문의 및 지원

프로젝트 관련 문의사항은 개발팀에 연락하세요.

---

**마지막 업데이트**: 2026년 2월 16일  
**문서 버전**: 1.0.0
