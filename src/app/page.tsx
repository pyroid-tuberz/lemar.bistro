'use client';

import Image from "next/image";
import Script from "next/script";

export default function Home() {
  return (
    <>
      <div className="header">
        <nav className="main-nav">
          <button className="hamburger" id="hamburger-menu">
            <span className="hamburger-bar"></span>
            <span className="hamburger-bar"></span>
            <span className="hamburger-bar"></span>
          </button>
          <div className="nav-links">
            <a href="#featured-section" data-key="nav_featured">Öne Çıkanlar</a>
            <a href="#menu-section" data-key="nav_menu">Menü</a>
            <a href="#artists-section" data-key="nav_artists">Sanatçılar</a>
            <a href="#gallery-section" data-key="nav_gallery">Galeri</a>
            <a href="#contact-section" data-key="nav_contact">İletişim</a>
            <a href="#about-section" data-key="nav_about">Hakkımızda</a>
          </div>
        </nav>
        <h1 data-key="welcome_title">Lemara Hoşgeldiniz</h1>
        <a href="#menu-section" className="menu-button" data-key="discover_menu">Menümüzü Keşfedin</a>
      </div>

      <section id="about-section" className="content-section scroll-animate">
        <div className="section-container">
          <h2 className="section-title" data-key="our_story_title">Bizim Hikayemiz</h2>
          <p className="section-paragraph" data-key="our_story_text">
            2024 yılında lezzet tutkunları için kapılarını aralayan Lemar Bistro, en taze
            malzemelerle hazırlanan eşsiz menüsü, sıcak atmosferi ve kaliteli hizmet anlayışıyla kısa sürede şehrin
            buluşma noktası haline geldi. Her damak zevkine hitap eden zengin seçeneklerimizle sizleri bekliyoruz.
          </p>
        </div>
      </section>

      <div className="section-divider"></div>

      <div className="section-divider"></div>

      <section id="menu-section">
        <div className="menu-system">
          {/* Search Bar */}
          <div className="search-container">
            <input type="text" id="search-input" placeholder="Ürün Ara... (Örn: Votka, Burger)"
              data-key-placeholder="search_placeholder" />
          </div>

          {/* Persistent Navigation Bar */}
          <div id="menu-nav-bar"
            style={{ display: 'none', padding: '0 20px 10px 20px', gap: '10px', zIndex: 100, position: 'relative' }}>
            <button id="btn-back" className="nav-control-btn" data-key="btn_back">← Geri</button>
            <button id="btn-home" className="nav-control-btn" data-key="btn_home">⌂ Ana Menü</button>
          </div>

          {/* Dynamic Menu Injected Here */}
        </div>
      </section>

      <div className="section-divider"></div>

      <section id="artists-section" className="content-section scroll-animate">
        <div className="section-container">
          <h2 className="section-title" data-key="artists_title">Sanatçılar</h2>
          <div className="artist-grid" id="artist-display-grid">
            {/* Dynamically loaded from server */}
          </div>
        </div>
      </section>

      <div className="section-divider"></div>

      <section id="gallery-section" className="content-section scroll-animate">
        <div className="section-container">
          <h2 className="section-title" data-key="gallery_title">Lezzetlerimizden Kareler</h2>
          <div className="gallery-grid">
            {/* Gallery is populated via script.js finding this div */}
          </div>
        </div>
      </section>

      <div className="section-divider"></div>

      <section id="testimonial-section" className="content-section scroll-animate">
        <div className="section-container">
          <h2 className="section-title">Misafirlerimiz Ne Diyor?</h2>
          <div className="testimonial-grid" id="testimonial-display-grid">
            {/* Dynamically loaded from server */}
          </div>
        </div>
      </section>

      <div className="section-divider"></div>
      <section id="contact-section" className="content-section scroll-animate">
        <div className="section-container">
          <h2 className="section-title" data-key="contact_title">Bize Ulaşın</h2>
          <div className="contact-container">
            <div className="contact-info">
              <h3 data-key="address_title">Adres</h3>
              <p>Kınıklı, Hüseyin Yılmaz Cd. No:72, 20160 Denizli Merkez/Denizli</p>
              <h3 data-key="phone_title">Telefon</h3>
              <p>+90 0542 534 45 18</p>
              <h3>Email</h3>
              <p>info@lemarbistro.com</p>
            </div>
            <div className="contact-map">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3155.025661498502!2d29.095605799999998!3d37.742542199999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14c73eded470245f%3A0xd21c1bddbf8b148a!2sLemar%20Bistro!5e0!3m2!1str!2str!4v1765576015767!5m2!1str!2str"
                width="600" height="450" style={{ border: 0 }} allowFullScreen={true} loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"></iframe>
            </div>
          </div>
        </div>
      </section>

      <footer className="main-footer">
        <div className="social-links">
          <a href="https://www.instagram.com/lemar.bistro/" aria-label="Instagram" target="_blank"
            rel="noopener noreferrer">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </a>
          <a href="https://www.facebook.com/lemarbistro.denizli/" aria-label="Facebook" target="_blank"
            rel="noopener noreferrer">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
            </svg>
          </a>
          <a href="#" aria-label="Twitter">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path
                d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z">
              </path>
            </svg>
          </a>
        </div>
        <p data-key="footer_rights">© 2025 Lemar Bistro. Tüm Hakları Saklıdır.</p>
        <a href="/admin" className="admin-link">Admin</a>
      </footer>

      <button id="scroll-to-top" title="Yukarı Çık">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
      </button>

      {/* Load script.js from public folder */}
      <Script src="/script.js" strategy="afterInteractive" />
    </>
  );
}

