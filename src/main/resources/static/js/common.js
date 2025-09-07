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