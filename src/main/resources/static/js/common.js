document.addEventListener('DOMContentLoaded', function() {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileNav = document.getElementById('mobile-nav');
    const overlay = document.getElementById('mobile-nav-overlay');
    const body = document.body;

    if (!hamburgerBtn || !mobileNav || !overlay) {
        console.error('Mobile navigation elements not found.');
        return;
    }

    const openNav = () => {
        body.classList.add('mobile-nav-active');
        mobileNav.classList.add('is-open');
        overlay.classList.add('is-visible');
        hamburgerBtn.classList.add('is-active');
        hamburgerBtn.setAttribute('aria-expanded', 'true');
    };

    const closeNav = () => {
        body.classList.remove('mobile-nav-active');
        mobileNav.classList.remove('is-open');
        overlay.classList.remove('is-visible');
        hamburgerBtn.classList.remove('is-active');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
    };

    hamburgerBtn.addEventListener('click', () => {
        const isNavOpen = mobileNav.classList.contains('is-open');
        if (isNavOpen) {
            closeNav();
        } else {
            openNav();
        }
    });

    overlay.addEventListener('click', closeNav);

    // 아코디언 서브메뉴 토글 로직
    const submenuToggles = document.querySelectorAll('.mobile-menu-list .has-submenu');

    submenuToggles.forEach(toggle => {
        const link = toggle.querySelector('a');
        const button = toggle.querySelector('.submenu-toggle-btn');

        const toggleSubmenu = (e) => {
            e.preventDefault();
            toggle.classList.toggle('submenu-open');
        };

        if (link) link.addEventListener('click', toggleSubmenu);
        if (button) button.addEventListener('click', toggleSubmenu);
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const placeholderLists = document.querySelectorAll('.erp-simple-list');

    if (!placeholderLists.length) {
        return;
    }

    const categoryNames = {
        humen: '성도관리',
        sermon: '예배/설교관리',
        account: '재정/헌금관리',
        training: '교육/훈련관리',
        ministry: '사역/조직관리',
        event: '일정/행사관리',
        facility: '시설/자원관리',
        comm: '커뮤니케이션',
        admin: '문서/행정관리',
        stats: '통계/대시보드',
        system: '시스템관리'
    };

    const categoryRegisterPaths = {
        humen: '/humen/newcomer',
        sermon: '/sermon/write',
        account: '/account/input',
        training: '/training/course',
        ministry: '/ministry/department',
        event: '/event/apply',
        facility: '/facility/reservation',
        comm: '/comm/notice',
        stats: '/stats/dashboard',
        system: '/system'
    };

    placeholderLists.forEach(function (list) {
        const card = list.closest('.erp-card');
        if (!card || card.querySelector('.erp-ready-toolbar')) {
            return;
        }

        const pathParagraph = Array.from(list.querySelectorAll('p')).find(function (paragraph) {
            return paragraph.textContent && paragraph.textContent.includes('경로:');
        });

        if (!pathParagraph) {
            return;
        }

        const matched = pathParagraph.textContent.match(/경로:\s*(\/[a-z]+\/[a-z]+)/i);
        if (!matched) {
            return;
        }

        const currentPath = matched[1];
        const pathParts = currentPath.split('/').filter(Boolean);
        const categoryKey = pathParts[0];
        const categoryName = categoryNames[categoryKey] || 'ERP';
        const listPath = '/' + categoryKey + '/manager';
        const registerPath = categoryRegisterPaths[categoryKey] || currentPath;

        const toolbar = document.createElement('div');
        toolbar.className = 'erp-ready-toolbar';
        toolbar.innerHTML =
            '<div class="erp-ready-meta">' +
                '<span class="erp-ready-badge">' + categoryName + '</span>' +
                '<span class="erp-ready-path">' + currentPath + '</span>' +
            '</div>' +
            '<div class="erp-ready-controls">' +
                '<div class="erp-ready-search">' +
                    '<input type="text" placeholder="' + categoryName + ' 검색어 입력">' +
                    '<button type="button" class="erp-ready-btn is-search">검색</button>' +
                '</div>' +
                '<div class="erp-ready-actions">' +
                    '<a class="erp-ready-btn is-ghost" href="' + listPath + '">목록</a>' +
                    '<a class="erp-ready-btn is-primary" href="' + registerPath + '">등록</a>' +
                '</div>' +
            '</div>';

        list.parentNode.insertBefore(toolbar, list);
    });
});