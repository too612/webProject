// Navigation menu handling
document.addEventListener('DOMContentLoaded', function() {
    // Top menu hover effect
    const menuItems = document.querySelectorAll('.top-menu > li');
    
    menuItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const submenu = this.querySelector('.submenu');
            if (submenu) {
                submenu.style.display = 'block';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            const submenu = this.querySelector('.submenu');
            if (submenu) {
                submenu.style.display = 'none';
            }
        });
    });

    // Fetch API helper function
    window.fetchApi = async function(url, method = 'GET', data = null) {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };
        
        if (data) {
            options.body = JSON.stringify(data);
        }
        
        try {
            const response = await fetch(url, options);
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Image slider functionality
    const slider = document.querySelector('.slider');
    if (slider) {
        let currentSlide = 0;
        const slides = slider.querySelectorAll('img');
        
        function showSlide(index) {
            slides.forEach((slide, i) => {
                slide.style.display = i === index ? 'block' : 'none';
            });
        }
        
        setInterval(() => {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }, 3000);
        
        showSlide(0);
    }
});
