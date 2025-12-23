
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

    // Fetch from backgrounds.json
    fetch('backgrounds.json')
        .then(res => res.json())
        .then(bgData => {
            if (bgData && bgData[timeSlot]) {
                body.style.backgroundImage = `url('${bgData[timeSlot]}')`;
            }
        })
        .catch(err => console.error('Background fetch error:', err));

    // --- NAVIGATION LOGIC (Persistent) ---
    const navBar = document.getElementById('menu-nav-bar');
    const btnBack = document.getElementById('btn-back');
    const btnHome = document.getElementById('btn-home');

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
        if (!panelId) return;

        if (historyStack[historyStack.length - 1] !== panelId) {
            historyStack.push(panelId);
        }

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
        fetch('menu.json')
            .then(res => res.json())
            .then(data => {
                const items = data.items;
                const categories = data.categories;

                const hierarchy = {};
                Object.keys(categories).forEach(catId => {
                    if (catId === 'root') return;
                    const cat = categories[catId];
                    const parent = cat.parent || 'root';
                    if (!hierarchy[parent]) hierarchy[parent] = [];
                    hierarchy[parent].push(catId);
                });

                Object.keys(categories).forEach(catId => {
                    const cat = categories[catId];
                    const panelItems = items.filter(i => i.category === catId);

                    const panel = document.createElement('div');
                    panel.className = 'menu-panel';
                    panel.id = `panel-${catId}`;
                    panel.dataset.panelId = catId;
                    if (catId === 'root') panel.classList.add('is-active');

                    panel.innerHTML = `<h2 class="panel-title">${cat.name}</h2>`;

                    if (hierarchy[catId]) {
                        const subCatGrid = document.createElement('div');
                        subCatGrid.className = 'main-menu';
                        hierarchy[catId].forEach(subId => {
                            const subCat = categories[subId];
                            const btn = document.createElement('button');
                            btn.className = 'nav-button';
                            btn.style.borderColor = subCat.color || '#FFC700';
                            btn.style.color = subCat.color || '#FFC700';
                            btn.innerHTML = `<span>${subCat.name}</span>`;
                            btn.onclick = () => navigateTo(subId);
                            subCatGrid.appendChild(btn);
                        });
                        panel.appendChild(subCatGrid);
                    }

                    if (panelItems.length > 0) {
                        panel.classList.add('menu-item-list');
                        panelItems.forEach(item => {
                            const itemDiv = document.createElement('div');
                            itemDiv.className = 'menu-item';
                            itemDiv.innerHTML = `
                                <div class="menu-item-header">
                                    <span class="menu-item-name">${item.name}</span>
                                    <span class="menu-item-price">${item.price}</span>
                                </div>
                                ${item.description ? `<div class="menu-item-description">${item.description}</div>` : ''}
                            `;
                            panel.appendChild(itemDiv);
                        });
                    }
                    menuSystem.appendChild(panel);
                });

                const searchInput = document.getElementById('search-input');
                if (searchInput) {
                    searchInput.addEventListener('input', (e) => {
                        const query = e.target.value.toLowerCase().trim();
                        const oldSearch = document.getElementById('panel-search-results');
                        if (oldSearch) oldSearch.remove();

                        if (query.length === 0) {
                            navigateTo('root');
                            return;
                        }

                        const results = items.filter(item =>
                            item.name.toLowerCase().includes(query) ||
                            (item.description && item.description.toLowerCase().includes(query))
                        );

                        const searchPanel = document.createElement('div');
                        searchPanel.id = 'panel-search-results';
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
                        navigateTo('search-results');
                    });
                }
            })
            .catch(err => console.error('Error loading menu:', err));
    }

    // --- Gallery Image Loader ---
    const galleryGrid = document.querySelector('.gallery-grid');
    const bodyClass = body.className;
    let currentTimeOfDay = 'aksam';
    if (bodyClass.includes('sabah')) currentTimeOfDay = 'sabah';
    else if (bodyClass.includes('oglen')) currentTimeOfDay = 'oglen';

    if (galleryGrid) {
        fetch('gallery.json')
            .then(res => res.json())
            .then(data => {
                const images = data.images || [];
                const filteredImages = images.filter(image => image.times.includes(currentTimeOfDay));
                filteredImages.forEach(image => {
                    const galleryItem = document.createElement('div');
                    galleryItem.classList.add('gallery-item');
                    const img = document.createElement('img');
                    img.src = image.src;
                    img.alt = "Lemar Bistro Gallery Image";
                    img.loading = "lazy";
                    galleryItem.appendChild(img);
                    galleryGrid.appendChild(galleryItem);
                });
            })
            .catch(err => console.error('Error loading gallery:', err));
    }

    // --- Scroll Animation (IntersectionObserver) ---
    const scrollObserverValue = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: stop observing once visible
                // scrollObserverValue.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15 // Trigger when 15% of element is visible
    });

    function initScrollAnimations() {
        if (window.innerWidth <= 768) return;
        document.querySelectorAll('.scroll-animate').forEach((el) => {
            scrollObserverValue.observe(el);
        });
    }

    initScrollAnimations();

    // Snowflake effect
    function createSnow() {
        const snow = document.createElement("div");
        snow.classList.add("snowflake");
        snow.style.left = Math.random() * window.innerWidth + "px";
        snow.style.opacity = Math.random();
        snow.style.animationDuration = (Math.random() * 3 + 2) + "s";
        document.body.appendChild(snow);
        setTimeout(() => { snow.remove(); }, 5000);
    }
    if (window.innerWidth > 768) setInterval(createSnow, 150);


    // --- Sanatçılar (Artists) Loader - Weekly Schedule with Tabs ---
    async function loadArtists() {
        const artistGrid = document.getElementById('artist-display-grid');
        if (!artistGrid) return;

        try {
            const res = await fetch('/api/artists');
            const weekData = await res.json();

            artistGrid.innerHTML = '';

            // Create tab buttons container
            const tabContainer = document.createElement('div');
            tabContainer.className = 'artist-tabs-container';

            // Create content container
            const contentContainer = document.createElement('div');
            contentContainer.id = 'artist-content-container';

            // Get today's day index (0 = Pazartesi, 6 = Pazar)
            const today = new Date();
            const todayDayIndex = (today.getDay() + 6) % 7; // Convert Sunday=0 to Monday=0

            weekData.forEach((day, index) => {
                // Create tab button
                const tabBtn = document.createElement('button');
                tabBtn.className = 'artist-day-tab';
                tabBtn.innerHTML = `
                    <div class="tab-day-name">${day.dayName}</div>
                    ${index === todayDayIndex ? '<div class="tab-today-badge">Bugün</div>' : ''}
                `;

                tabBtn.onclick = () => showArtistDay(index, weekData, tabContainer.children);

                // Auto-select today
                if (index === todayDayIndex) {
                    tabBtn.classList.add('active');
                }

                tabContainer.appendChild(tabBtn);
            });

            artistGrid.appendChild(tabContainer);
            artistGrid.appendChild(contentContainer);

            // Show today by default
            showArtistDay(todayDayIndex, weekData, tabContainer.children);

        } catch (err) {
            console.error('Error loading artists:', err);
        }
    }

    function showArtistDay(dayIndex, weekData, tabButtons) {
        const contentContainer = document.getElementById('artist-content-container');
        const day = weekData[dayIndex];

        // Update tab button styles
        Array.from(tabButtons).forEach((btn, idx) => {
            if (idx === dayIndex) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Clear and create content for selected day
        contentContainer.innerHTML = '';

        const dayContent = document.createElement('div');
        dayContent.className = 'artists-day-content';

        // Artist 1 Card
        const artist1Card = createArtistCard(day.artist1, 'Sahne 1', '#FF6B6B');
        dayContent.appendChild(artist1Card);

        // Artist 2 Card
        const artist2Card = createArtistCard(day.artist2, 'Sahne 2', '#4ECDC4');
        dayContent.appendChild(artist2Card);

        contentContainer.appendChild(dayContent);
    }

    function createArtistCard(artist, stageName, color) {
        const card = document.createElement('div');
        card.className = 'artist-card';
        card.innerHTML = `
            <div class="artist-card-header" style="background: linear-gradient(135deg, ${color}20 0%, ${color}05 100%); border-bottom: 2px solid ${color}40;">
                <span class="artist-stage-badge" style="background: ${color}; color: white;">🎤 ${stageName}</span>
            </div>
            <div class="artist-card-body">
                <div class="artist-avatar-container">
                    <img src="${artist.image}" alt="${artist.name}" class="artist-avatar" style="border: 4px solid ${color}60;" onerror="this.src='uploads/default_artist.png'">
                </div>
                <h3 class="artist-name">${artist.name}</h3>
                <p class="artist-venue">@ Lemar Bistro</p>
            </div>
        `;
        return card;
    }

    loadArtists();

    // --- Testimonials Loader ---
    async function loadTestimonials() {
        const testimonialGrid = document.getElementById('testimonial-display-grid');
        if (!testimonialGrid) return;

        try {
            const res = await fetch('/api/testimonials');
            const data = await res.json();

            testimonialGrid.innerHTML = '';

            data.forEach(t => {
                const card = document.createElement('div');
                card.className = 'testimonial-card scroll-animate';
                card.innerHTML = `
                    <p>"${t.text}"</p>
                    <div class="testimonial-author">- ${t.name}</div>
                `;
                testimonialGrid.appendChild(card);

                if (window.innerWidth > 768) {
                    scrollObserverValue.observe(card);
                }
            });
        } catch (err) {
            console.error('Error loading testimonials:', err);
        }
    }
    loadTestimonials();

    // --- SCROLL TO TOP LOGIC ---
    const scrollToTopBtn = document.getElementById('scroll-to-top');
    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 50) {
                scrollToTopBtn.classList.add('show');
            } else {
                scrollToTopBtn.classList.remove('show');
            }
        });

        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});