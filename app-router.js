// app-router.js
document.addEventListener('DOMContentLoaded', () => {
    // Jab bhi body par koi click hoga, yeh code check karega
    document.body.addEventListener('click', async (e) => {
        const link = e.target.closest('a');
        
        // Agar link hai, aur apni hi website ka hai, tabhi yeh run hoga
        if (link && link.href.startsWith(window.location.origin) && !link.href.includes('#')) {
            e.preventDefault(); // Default page reload ko rokna
            window.location.href = link.href;
            return;
            
            // Screen ko halka sa fade karna loading feel ke liye
            document.body.style.opacity = '0.5'; 
            document.body.style.transition = 'opacity 0.3s ease';

            try {
                // Background mein naya page fetch karna (Yahi API Fetch hai)
                const response = await fetch(link.href);
                const html = await response.text();
                
                // Naye page ke HTML ko padhna
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');

                // Apni existing body mein naye page ka content daal dena
                document.body.innerHTML = doc.body.innerHTML;
                
                // Browser ki history aur URL ko update karna
                window.history.pushState({}, '', link.href);

                // Naye page par Animations aur page top par set karna
                if(typeof AOS !== 'undefined') {
                    AOS.init({ duration: 800, once: true });
                }
                window.scrollTo(0, 0);
                document.body.style.opacity = '1'; 
                
            } catch(err) {
                // Agar internet issue ki wajah se fetch fail ho jaye, toh normally page load kar do
                window.location.href = link.href; 
            }
        }
    });
});

// Jab user browser ka "Back" button dabaye
window.addEventListener('popstate', () => {
    window.location.reload();
});