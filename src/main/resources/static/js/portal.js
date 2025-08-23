document.addEventListener('DOMContentLoaded', function () {
    // --- Programs Slider ---
    const programsTrack = document.getElementById('programsTrack');
    let currentSlide = 0;

    // Only initialize slider logic if the track element exists on the page
    if (programsTrack) {
        const programCards = programsTrack.querySelectorAll('.program-card');
        const totalSlides = programCards.length;
        // Assuming 3 slides are visible. Adjust if layout changes.
        const visibleSlides = 3;
        const slideAmount = totalSlides > visibleSlides ? totalSlides - visibleSlides : 0;

        // Make the function globally accessible for the onclick attributes in the HTML
        window.slidePrograms = function (direction) {
            currentSlide += direction;

            // Loop the slider
            if (currentSlide < 0) {
                currentSlide = slideAmount;
            } else if (currentSlide > slideAmount) {
                currentSlide = 0;
            }

            const cardWidth = 300; // From .program-card min-width
            const cardMargin = 30; // From margin: 0 15px on each side
            const translateX = -currentSlide * (cardWidth + cardMargin);
            programsTrack.style.transform = `translateX(${translateX}px)`;
        }

        // Auto-slide functionality
        if (totalSlides > visibleSlides) {
            setInterval(() => {
                window.slidePrograms(1);
            }, 5000);
        }
    }

    // --- Ripple Effect ---
    // This adds a ripple effect to any element with the class "ripple"
    document.querySelectorAll('.ripple').forEach(button => {
        button.addEventListener('click', function (e) {
            const rect = this.getBoundingClientRect();
            const ripple = document.createElement('span');
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple-effect');

            // Ensure the ripple is removed after the animation
            const rippleEffect = this.appendChild(ripple);
            setTimeout(() => {
                rippleEffect.remove();
            }, 600);
        });
    });

    // --- Smooth Scrolling for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            // Ensure it's not just a placeholder link
            if (href.length > 1) {
                try {
                    const target = document.querySelector(href);
                    if (target) {
                        e.preventDefault();
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                } catch (error) {
                    console.error(`Invalid selector for smooth scroll: ${href}`);
                }
            }
        });
    });
});

