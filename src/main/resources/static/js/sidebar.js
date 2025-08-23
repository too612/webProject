document.addEventListener('DOMContentLoaded', function() {
    const menu = document.querySelector('.accordion-menu');
    if (!menu) return;

    const toggles = menu.querySelectorAll('.accordion-toggle');

    toggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            if (this.getAttribute('href') === 'javascript:void(0);') {
                e.preventDefault();
            }

            const parentLi = this.parentElement;

            // If the clicked item is not already open, close all others for a cleaner UX
            if (!parentLi.classList.contains('is-open')) {
                menu.querySelectorAll('li.is-open').forEach(openLi => {
                    openLi.classList.remove('is-open');
                });
            }

            parentLi.classList.toggle('is-open');
        });
    });
});
