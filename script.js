
document.addEventListener('DOMContentLoaded', function () {
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const navLinks = document.querySelector('.nav-links');

    if (hamburgerMenu && navLinks) {
        hamburgerMenu.addEventListener('click', function () {
            navLinks.classList.toggle('is-open');
        });

        // Close menu when a link is clicked
        navLinks.addEventListener('click', function () {
            if (navLinks.classList.contains('is-open')) {
                navLinks.classList.remove('is-open');
            }
        });
    }

    // --- LANGUAGE SYSTEM ---
    const translations = {
        tr: {
            nav_menu: "Menü",
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
            contact_title: "Bize Ulaşın",
            address_title: "Adres",
            phone_title: "Telefon",
            footer_rights: "© 2025 Lemar Bistro. Tüm Hakları Saklıdır."
        },
        en: {
            nav_menu: "Menu",
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
        langBtn.addEventListener('click', () => {
            const newLang = currentLang === 'tr' ? 'en' : 'tr';
            updateLanguage(newLang);
            // Reload to re-render all dynamic items with new language
            setTimeout(() => location.reload(), 100);
        });
    }

    // --- Dynamic Menu Loading & Navigation ---
    const menuSystem = document.querySelector('.menu-system');
    let historyStack = ['root']; // Navigation history

    // --- Dynamic Background Logic ---
    const body = document.body;
    const currentHour = new Date().getHours();
    let timeSlot = 'aksam';

    if (currentHour >= 6 && currentHour < 12) {
        timeSlot = 'sabah';
        body.classList.add('sabah');
    }
    else if (currentHour >= 12 && currentHour < 18) {
        timeSlot = 'oglen';
        body.classList.add('oglen');
    }
    else {
        body.classList.add('aksam');
    }

    // Fetch from data.js
    const bgData = window.LEMAR_BACKGROUNDS || {};
    if (bgData && bgData[timeSlot]) {
        // console.log('Applying custom background:', bgData[timeSlot]);
        body.style.backgroundImage = `url('${bgData[timeSlot]}')`;
    }

    // --- NAVIGATION LOGIC (Persistent) ---
    const navBar = document.getElementById('menu-nav-bar');
    const btnBack = document.getElementById('btn-back');
    const btnHome = document.getElementById('btn-home');

    // Check if elements exist to avoid errors
    if (btnBack && btnHome) {
        btnBack.addEventListener('click', () => {
            if (historyStack.length > 1) {
                historyStack.pop();
                const prev = historyStack[historyStack.length - 1];
                navigateTo(prev);
            }
        });

        btnHome.addEventListener('click', () => {
            historyStack = ['root'];
            navigateTo('root');
        });
    }

    function navigateTo(panelId) {
        // Show/Hide Nav Bar
        if (navBar) {
            if (panelId === 'root') {
                navBar.style.display = 'none';
            } else {
                navBar.style.display = 'flex';
            }
        }

        document.querySelectorAll('.menu-panel').forEach(p => {
            p.classList.remove('is-active', 'is-exiting');
        });

        const target = document.getElementById(`panel-${panelId}`);
        if (target) {
            target.classList.add('is-active');
        }
    }

    if (menuSystem) {
        // Use data.js
        const data = window.LEMAR_MENU || { items: [], categories: {} };
        const items = data.items;
        const categories = data.categories;

        // Build Hierarchy
        const hierarchy = {};
        Object.keys(categories).forEach(catId => {
            if (catId === 'root') return;
            const cat = categories[catId];
            const parent = cat.parent || 'root';
            if (!hierarchy[parent]) hierarchy[parent] = [];
            hierarchy[parent].push(catId);
        });

        // Helper: Get Parent ID for Navigation
        const getParentPanelId = (id) => {
            if (id === 'root') return null;
            const cat = categories[id];
            return cat ? (cat.parent || 'root') : 'root';
        };

        // --- RENDER MENU PANELS ---
        Object.keys(categories).forEach(catId => {
            const cat = categories[catId];
            const panelItems = items.filter(i => i.category === catId);

            const panel = document.createElement('div');
            panel.className = 'menu-panel';
            panel.id = `panel-${catId}`;
            panel.dataset.panelId = catId;
            if (catId === 'root') panel.classList.add('is-active');

            panel.innerHTML = `<h2 class="panel-title">${cat.name}</h2>`;

            // Sub-categories Buttons
            // Use the pre-calculated hierarchy if available, or filter directly
            const childrenIds = hierarchy[catId] || []; // Use the hierarchy we built above

            if (childrenIds.length > 0) {
                const navDiv = document.createElement('div');
                navDiv.className = 'main-menu';

                childrenIds.forEach(childId => {
                    const child = categories[childId];
                    const btn = document.createElement('button');
                    btn.className = 'nav-button';
                    btn.innerHTML = `<span>${child.name}</span>`;

                    // Style
                    if (child.size === 'large') btn.classList.add('large');
                    btn.style.borderColor = child.color || '#FFC700';
                    btn.style.color = child.color || '#FFC700';

                    btn.addEventListener('click', () => {
                        historyStack.push(childId);
                        navigateTo(childId);
                    });

                    navDiv.appendChild(btn);
                });
                panel.appendChild(navDiv);
            }

            // Items
            if (panelItems.length > 0) {
                panel.classList.add('menu-item-list');
                panelItems.forEach(item => {
                    const itemDiv = document.createElement('div');
                    itemDiv.className = 'menu-item';
                    itemDiv.innerHTML = `
                                <div class="menu-item-header">
                                    <span class="menu-item-name">${item.name}</span>
                                    <span class="menu-item-dots"></span>
                                    <span class="menu-item-price">${item.price}</span>
                                </div>
                                ${item.description ? `<div class="menu-item-description">${item.description}</div>` : ''}
                            `;
                    panel.appendChild(itemDiv);
                });
            }

            menuSystem.appendChild(panel);
        });

        // --- SEARCH LOGIC (Injected) ---
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase().trim();

                // Remove existing search panel if any
                const oldSearch = document.getElementById('panel-search-results');
                if (oldSearch) oldSearch.remove();

                if (query.length === 0) {
                    // Clear search -> Go to root
                    navigateTo('root');
                    // Hide nav bar if on root (handled by navigateTo)
                    return;
                }

                // Filter Items
                const results = items.filter(item =>
                    item.name.toLowerCase().includes(query) ||
                    (item.description && item.description.toLowerCase().includes(query))
                );

                // Create Search Panel
                const searchPanel = document.createElement('div');
                searchPanel.id = 'panel-search-results'; // ID for navigation
                searchPanel.className = 'menu-panel';
                searchPanel.dataset.panelId = 'search-results';

                searchPanel.innerHTML = `<h2 class="panel-title">Arama Sonuçları</h2>`;

                if (results.length > 0) {
                    searchPanel.classList.add('menu-item-list');
                    results.forEach(item => {
                        const itemDiv = document.createElement('div');
                        itemDiv.className = 'menu-item';
                        itemDiv.innerHTML = `
                                    <div class="menu-item-header">
                                        <span class="menu-item-name">${item.name}</span>
                                        <span class="menu-item-price">${item.price}</span>
                                    </div>
                                    ${item.description ? `<div class="menu-item-description">${item.description}</div>` : ''}
                                `;
                        searchPanel.appendChild(itemDiv);
                    });
                } else {
                    searchPanel.innerHTML += `<p style="text-align:center; color:white;">Sonuç bulunamadı.</p>`;
                }

                menuSystem.appendChild(searchPanel);

                // Navigate to it
                navigateTo('search-results');
            });
        }
    }

    // Old navigateTo removed



    // --- Gallery Image Loader ---
    const galleryGrid = document.querySelector('.gallery-grid');

    // Determine time of day based on body class
    const bodyClass = body.className;
    let currentTimeOfDay = 'aksam'; // default
    if (bodyClass.includes('sabah')) {
        currentTimeOfDay = 'sabah';
    } else if (bodyClass.includes('oglen')) {
        currentTimeOfDay = 'oglen';
    }

    if (galleryGrid) {
        // Use data.js
        const data = window.LEMAR_GALLERY || { images: [] };
        const images = data.images || [];
        const filteredImages = images.filter(image => image.times.includes(currentTimeOfDay));

        filteredImages.forEach(image => {
            const galleryItem = document.createElement('div');
            galleryItem.classList.add('gallery-item');

            const img = document.createElement('img');
            img.src = image.src; // src is now relative like "uploads/..." or "filename.jpg"
            img.alt = "Lemar Bistro Gallery Image";

            galleryItem.appendChild(img);
            galleryGrid.appendChild(galleryItem);
        });
    }


    // --- Scroll Animation ---
    const scrollElements = document.querySelectorAll('.scroll-animate');

    const elementInView = (el, dividend = 1) => {
        const elementTop = el.getBoundingClientRect().top;
        return (
            elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend
        );
    };

    const displayScrollElement = (element) => {
        element.classList.add('visible');
    };

    const hideScrollElement = (element) => {
        element.classList.remove('visible');
    }

    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 1.25)) {
                displayScrollElement(el);
            }
        })
    }

    window.addEventListener('scroll', () => {
        handleScrollAnimation();
    });

    handleScrollAnimation();

    // Snowflake effect
    function createSnow() {
        const snow = document.createElement("div");
        snow.classList.add("snowflake");

        snow.style.left = Math.random() * window.innerWidth + "px";
        snow.style.opacity = Math.random();
        snow.style.animationDuration = (Math.random() * 3 + 2) + "s";

        document.body.appendChild(snow);

        setTimeout(() => {
            snow.remove();
        }, 5000);
    }

    setInterval(createSnow, 150);

});