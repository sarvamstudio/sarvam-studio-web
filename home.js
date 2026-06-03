document.addEventListener('DOMContentLoaded', () => {
    // 1. Reveal on Scroll Animation
    const reveals = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    reveals.forEach(el => revealObserver.observe(el));

    // 2. Fetch Photos & Auto Smooth Slider
    async function fetchPhotosForSlider() {
        const slideWrapper = document.getElementById('slideWrapper');
        const dotsWrapper = document.getElementById('dotsWrapper');
        
        if(!slideWrapper) return;

        try {
            const response = await fetch('http://localhost:5000/api/photos');
            const data = await response.json();
            
            const photos = Array.isArray(data) ? data : data.photos; 
            const recentPhotos = photos.reverse().slice(0, 5); // Latest 5 photos

            if (recentPhotos && recentPhotos.length > 0) {
                slideWrapper.innerHTML = '';
                dotsWrapper.innerHTML = '';

                recentPhotos.forEach((photo, index) => {
                    const slideHTML = `
                        <div class="slide ${index === 0 ? 'active' : ''}" style="transition: opacity 2s ease-in-out;">
                            <img src="http://localhost:5000/${photo.imagePath}" alt="${photo.title}">
                            <div class="slide-caption">${photo.category}</div>
                        </div>
                    `;
                    slideWrapper.insertAdjacentHTML('beforeend', slideHTML);

                    const dotHTML = `<span class="dot ${index === 0 ? 'active' : ''}"></span>`;
                    dotsWrapper.insertAdjacentHTML('beforeend', dotHTML);
                });

                startAutoSlider();
            } else {
                slideWrapper.innerHTML = `<div class="slide active"><div style="height:100%; display:flex; align-items:center; justify-content:center; background:#111;"><h2>No photos uploaded yet</h2></div></div>`;
            }
        } catch (error) {
            console.error("Slider fetch error:", error);
            slideWrapper.innerHTML = `<div class="slide active"><div style="height:100%; display:flex; align-items:center; justify-content:center; background:#111;"><h2>Server Error. Please start backend.</h2></div></div>`;
        }
    }

    function startAutoSlider() {
        const slides = document.querySelectorAll('.slide');
        const dots = document.querySelectorAll('.dot');
        let currentSlide = 0;

        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            dots[currentSlide].classList.remove('active');
            
            currentSlide = (currentSlide + 1) % slides.length;
            
            slides[currentSlide].classList.add('active');
            dots[currentSlide].classList.add('active');
        }, 4000); 
    }

    fetchPhotosForSlider();

    // 3. Mobile Menu Toggle
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    if(menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            if(navLinks.style.display === 'flex') {
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '70px';
                navLinks.style.width = '100%';
                navLinks.style.background = 'rgba(0,0,0,0.9)';
                navLinks.style.padding = '20px';
                navLinks.style.borderRadius = '20px';
            }
        });
    }
});