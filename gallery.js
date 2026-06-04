document.addEventListener('DOMContentLoaded', () => {

    // 1. MOBILE MENU TOGGLE
    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");
    if(menuToggle) {
        menuToggle.addEventListener("click", () => {
            navLinks.classList.toggle("active");
        });
    }

    // 2. FETCH AND RENDER GALLERY DYNAMICALLY
    async function loadGallery() {
        const gallery = document.getElementById('gallery');
        try {
            const response = await fetch('https://sarvam-backend-5bhj.onrender.com/api/photos');
            const data = await response.json();
            const photos = Array.isArray(data) ? data : data.photos;

            gallery.innerHTML = ''; // Clear loading text

            if (photos && photos.length > 0) {
                photos.reverse().forEach((photo, index) => {
                    // Category name ko lowercase karke class name banayenge (e.g. "Pre-Wedding" -> "pre-wedding")
                    let filterClass = photo.category.toLowerCase().replace(/\s+/g, '-');
                    
                    const itemHTML = `
                    <div class="gallery-item ${filterClass} reveal visible" style="animation-delay: ${index * 0.05}s">
                        <img src="https://sarvam-backend-5bhj.onrender.com/${photo.imagePath}" alt="${photo.title}" loading="lazy">
                        <div class="overlay">
                            <i data-lucide="maximize-2" class="zoom-icon"></i>
                            <div class="overlay-text">
                                <h3>${photo.title || 'Studio Shot'}</h3>
                                <p>${photo.category}</p>
                            </div>
                        </div>
                    </div>`;
                    gallery.insertAdjacentHTML('beforeend', itemHTML);
                });

                // Load hone ke baad Icons aur baaki features chalu karo
                if (window.lucide) { lucide.createIcons(); }
                setupLightbox();
                setupFilters();
                checkURLFilter();
            } else {
                gallery.innerHTML = '<h3 style="color:white; grid-column:1/-1; text-align:center;">No Photos Found</h3>';
            }
        } catch (e) {
            console.error("Gallery fetch error:", e);
            gallery.innerHTML = '<h3 style="color:white; grid-column:1/-1; text-align:center;">Failed to load server data.</h3>';
        }
    }

    // 3. PORTFOLIO FILTER LOGIC
    function setupFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const galleryItems = document.querySelectorAll('.gallery-item');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                galleryItems.forEach(item => {
                    if (filterValue === 'all' || item.classList.contains(filterValue)) {
                        item.style.display = 'block';
                        item.style.animation = 'none';
                        item.offsetHeight; // reflow
                        item.style.animation = 'fadeIn 0.5s ease forwards';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    // Redirect hoke aaye filters ke liye (e.g., Services page se "View Gallery" click kiya ho)
    function checkURLFilter() {
        const params = new URLSearchParams(window.location.search);
        const category = params.get('filter');
        if(category) {
            const targetBtn = document.querySelector(`.filter-btn[data-filter="${category}"]`);
            if(targetBtn) {
                targetBtn.click(); // Auto click filter
            }
        }
    }

    // 4. LIGHTBOX LOGIC
    function setupLightbox() {
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        const closeLightboxBtn = document.getElementById('closeLightbox');
        const galleryImages = document.querySelectorAll('.gallery-item img');

        galleryImages.forEach(img => {
            img.parentElement.addEventListener('click', () => {
                lightboxImg.src = img.src;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden'; 
            });
        });

        closeLightboxBtn.addEventListener('click', () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto'; 
        });

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                lightbox.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }

    // 5. SCROLL REVEAL (for static elements)
    const reveals = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    reveals.forEach(el => revealObserver.observe(el));

    // Page start
    loadGallery();
});