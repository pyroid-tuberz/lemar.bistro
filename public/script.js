// Main initialization function
function initApp() {
    console.log('Initializing Lemar Bistro App...');

    const hamburgerMenu = document.getElementById('hamburger-menu');
    const navLinks = document.querySelector('.nav-links');

    if (hamburgerMenu && navLinks) {
        // Remove existing listeners to prevent duplicates if re-initializing
        const newHamburger = hamburgerMenu.cloneNode(true);
        hamburgerMenu.parentNode.replaceChild(newHamburger, hamburgerMenu);

        newHamburger.addEventListener('click', function () {
            navLinks.classList.toggle('is-open');
        });

        // Close menu when a link is clicked
        navLinks.addEventListener('click', function (e) {
            // Only close if it was an anchor tag or bubbled from one
            if (e.target.tagName === 'A' && navLinks.classList.contains('is-open')) {
                navLinks.classList.remove('is-open');
            }
        });
    }

    // --- LANGUAGE SYSTEM ---
    const translations = {
        tr: {
            nav_featured: "Öne Çıkanlar",
            nav_gallery: "Galeri",
            nav_contact: "İletişim",
            nav_about: "Hakkımızda",
            welcome_title: "Lemara Hoşgeldiniz",
            discover_menu: "Menümüzü Keşfedin",
            our_story_title: "Bizim Hikayemiz",
            our_story_text: "2024 yılında lezzet tutkunları için kapılarını aralayan Lemar Bistro, en taze malzemelerle hazırlanan eşsiz menüsü, sıcak atmosferi ve kaliteli hizmet anlayışıyla kısa sürede şehrin buluşma noktası haline geldi. Her damak zevkine hitap eden zengin seçeneklerimizle sizleri bekliyoruz.",
            search_placeholder: "Ürün Ara... (Örn: Votka, Burger)",
            btn_back: "← Geri",
            btn_home: "⌂ Ana Menü",
            gallery_title: "Lezzetlerimizden Kareler",
            artists_title: "Sanatçılar",
            contact_title: "Bize Ulaşın",
            address_title: "Adres",
            phone_title: "Telefon",
            footer_rights: "© 2025 Lemar Bistro. Tüm Hakları Saklıdır."
        },
        en: {
            nav_featured: "Featured",
            nav_gallery: "Gallery",
            nav_contact: "Contact",
            nav_about: "About",
            welcome_title: "Welcome to Lemar",
            discover_menu: "Discover Our Menu",
            our_story_title: "Our Story",
            our_story_text: "Opening its doors for taste enthusiasts in 2024, Lemar Bistro quickly became the meeting point of the city with its unique menu prepared with the freshest ingredients, warm atmosphere and quality service approach. We are waiting for you with rich options appealing to every palate.",
            search_placeholder: "Search items... (e.g., Vodka, Burger)",
            btn_back: "← Back",
            btn_home: "⌂ Home",
            gallery_title: "Taste Gallery",
            artists_title: "Artists",
            contact_title: "Contact Us",
            address_title: "Address",
            phone_title: "Phone",
            footer_rights: "© 2025 Lemar Bistro. All Rights Reserved."
        }
    };

    let currentLang = localStorage.getItem('siteLang') || 'tr';

    const updateLanguage = (lang) => {
        currentLang = lang;
        localStorage.setItem('siteLang', lang);

        // Update Text
        document.querySelectorAll('[data-key]').forEach(el => {
            const key = el.getAttribute('data-key');
            if (translations[lang][key]) {
                el.textContent = translations[lang][key];
            }
        });

        // Update Placeholders
        document.querySelectorAll('[data-key-placeholder]').forEach(el => {
            const key = el.getAttribute('data-key-placeholder');
            if (translations[lang][key]) {
                el.placeholder = translations[lang][key];
            }
        });
    };

    // Init Language
    updateLanguage(currentLang);

    // Toggle Button Logic
    const langBtn = document.getElementById('lang-toggle');
    if (langBtn) {
        // Clone to replace listener
        const newBtn = langBtn.cloneNode(true);
        langBtn.parentNode.replaceChild(newBtn, langBtn);

        newBtn.addEventListener('click', () => {
            const newLang = currentLang === 'tr' ? 'en' : 'tr';
            updateLanguage(newLang);
            // Reload to re-render all dynamic items with new language
            setTimeout(() => location.reload(), 100);
        });
    }

    // --- SCROLL TO TOP LOGIC ---
    const scrollToTopBtn = document.getElementById('scroll-to-top');
    if (scrollToTopBtn) {
        // Clone to remove old listeners
        const newScrollBtn = scrollToTopBtn.cloneNode(true);
        scrollToTopBtn.parentNode.replaceChild(newScrollBtn, scrollToTopBtn);

        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) return;
            scrollTimeout = requestAnimationFrame(() => {
                if (window.pageYOffset > 50) {
                    newScrollBtn.classList.add('show');
                } else {
                    newScrollBtn.classList.remove('show');
                }
                scrollTimeout = null;
            });
        }, { passive: true });

        newScrollBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // --- SCROLL ANIMATIONS ---
    const scrollObserverValue = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.15
    });

    if (window.innerWidth > 768) {
        document.querySelectorAll('.scroll-animate').forEach((el) => {
            scrollObserverValue.observe(el);
        });
    }
}

// Execute logic when ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}