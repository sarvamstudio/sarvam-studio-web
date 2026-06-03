document.addEventListener('DOMContentLoaded', () => {

    // 1. MOBILE MENU TOGGLE
    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");

    if(menuToggle) {
        menuToggle.addEventListener("click", () => {
            navLinks.classList.toggle("active");
        });
    }

    // 2. SCROLL REVEAL ANIMATION (Modern Intersection Observer)
    const reveals = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    reveals.forEach(el => revealObserver.observe(el));

    // Initialize Lucide Icons for static elements
    lucide.createIcons();

    // 3. REVIEW FORM & CUSTOM BACKEND LOGIC
    const reviewForm = document.getElementById('reviewForm');
    const reviewsContainer = document.getElementById('reviewsContainer');
    const stars = document.querySelectorAll('.star-rating span');

    let selectedRating = 5; // Default rating

    // Star Interaction Logic
    stars.forEach((star, index) => {
        star.addEventListener('mouseover', () => {
            stars.forEach(s => s.classList.remove('hover'));
            for (let i = 0; i <= index; i++) {
                stars[i].classList.add('hover');
            }
        });

        star.addEventListener('mouseout', () => {
            stars.forEach(s => s.classList.remove('hover'));
        });

        star.addEventListener('click', () => {
            selectedRating = index + 1;
            stars.forEach(s => s.classList.remove('selected'));
            for (let i = 0; i < selectedRating; i++) {
                stars[i].classList.add('selected');
            }
        });
    });

    // Submit Review to Node.js/MongoDB
    reviewForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const mobile = document.getElementById('mobile').value;
        const reviewText = document.getElementById('reviewText').value;

        // Change button state to indicate loading
        const submitBtn = reviewForm.querySelector('.btn-submit');
        const originalText = submitBtn.innerText;
        submitBtn.innerText = "Submitting...";
        submitBtn.disabled = true;

        try {
            // Backend ko data bhej rahe hain
            const response = await fetch('http://localhost:5000/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: name,
                    mobile: mobile,
                    text: reviewText,
                    rating: selectedRating
                })
            });

            if (response.ok) {
                alert("🙏 Thank you! Your review has been submitted successfully.");
                reviewForm.reset();

                // Reset stars
                selectedRating = 5;
                stars.forEach(s => s.classList.remove('selected'));
                for (let i = 0; i < 5; i++) stars[i].classList.add('selected');

                // Naye review ko turant load karne ke liye func call karein
                loadReviews();
            } else {
                throw new Error("Failed to submit review");
            }

        } catch (error) {
            console.error("Error adding review: ", error);
            alert("Something went wrong. Please try again.");
        } finally {
            submitBtn.innerText = originalText;
            submitBtn.disabled = false;
        }
    });

    // 4. LOAD REVIEWS FROM CUSTOM BACKEND (MongoDB)
    async function loadReviews() {
        reviewsContainer.innerHTML = "<p class='loading-text'>Loading reviews...</p>";

        try {
            const response = await fetch('http://localhost:5000/api/reviews');
            const data = await response.json();

            reviewsContainer.innerHTML = ""; // Clear loading state

            if (data.length === 0) {
                reviewsContainer.innerHTML = "<p class='loading-text'>No reviews yet. Be the first!</p>";
                return;
            }

            data.forEach((r, index) => {
                const card = document.createElement('div');
                card.className = 'review-card';

                // Generate Lucide SVG stars dynamically based on rating
                let starSVGs = '';
                for(let i=0; i<5; i++) {
                    if(i < r.rating) {
                        starSVGs += `<i data-lucide="star" class="filled"></i>`;
                    } else {
                        starSVGs += `<i data-lucide="star"></i>`;
                    }
                }

                card.innerHTML = `
                    <i data-lucide="quote" class="quote-watermark"></i>
                    <div class="review-card-content">
                        <p class="review-text">"${r.text}"</p>
                        <div class="review-meta">
                            <span class="reviewer-name">${r.name}</span>
                            <div class="lucide-stars">
                                ${starSVGs}
                            </div>
                        </div>
                    </div>
                `;

                reviewsContainer.appendChild(card);
                
                // Initialize Lucide icons for this specific newly added card
                lucide.createIcons({
                    root: card
                });

                // Staggered reveal animation
                setTimeout(() => card.classList.add('show'), index * 150);
            });
        } catch (error) {
            console.error("Error fetching reviews: ", error);
            reviewsContainer.innerHTML = "<p class='loading-text' style='color:red;'>Failed to load reviews. Backend running hai?</p>";
        }
    }

    // Page khulte hi run karein
    loadReviews();
});