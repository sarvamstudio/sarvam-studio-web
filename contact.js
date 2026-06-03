document.addEventListener('DOMContentLoaded', () => {

    // 1. MOBILE MENU TOGGLE
    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");

    if(menuToggle) {
        menuToggle.addEventListener("click", () => {
            navLinks.classList.toggle("active");
        });
    }

    // 2. SCROLL REVEAL ANIMATION
    const reveals = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    reveals.forEach(el => revealObserver.observe(el));

    // 3. WHATSAPP FORM SUBMISSION
    const contactForm = document.getElementById("contactForm");
    
    if(contactForm) {
        contactForm.addEventListener("submit", function(e) {
            e.preventDefault();

            const name = document.getElementById("name").value.trim();
            const phone = document.getElementById("phone").value.trim();
            const service = document.getElementById("service").value;
            const message = document.getElementById("message").value.trim();

            // Format message for WhatsApp
            const whatsappText = encodeURIComponent(
                `*New Studio Enquiry* 📸\n\n` +
                `*Name:* ${name}\n` +
                `*Mobile:* ${phone}\n` +
                `*Service Needed:* ${service}\n\n` +
                `*Details:* ${message}`
            );

            // Open WhatsApp (Phone number without '+' sign)
            const whatsappNumber = "919925417991"; 
            window.open(`https://wa.me/${whatsappNumber}?text=${whatsappText}`, "_blank");
            
            // Clear form
            contactForm.reset();
        });
    }

    console.log("Ultra-Premium Contact Page Loaded Successfully");
});