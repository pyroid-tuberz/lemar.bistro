'use client';

import Image from "next/image";
import Script from "next/script";
import { useLanguage } from "@/contexts/LanguageContext";
import MenuSystem from "@/components/MenuSystem";
import Gallery from "@/components/Gallery";
import Artists from "@/components/Artists";
import Testimonials from "@/components/Testimonials";
import LanguageSwitcher from "./LanguageSwitcher";

export default function PageContent({ menuData, bgData, galleryData, artistsData, testimonialData, timeSlot, bgUrl, filteredGallery }: any) {
  const { lang } = useLanguage();

  const translations: any = {
    nav_about: { tr: "Hakkımızda", en: "About Us" },
    nav_menu: { tr: "Menü", en: "Menu" },
    nav_artists: { tr: "Sanatçılar", en: "Artists" },
    nav_gallery: { tr: "Galeri", en: "Gallery" },
    nav_contact: { tr: "İletişim", en: "Contact" },
    welcome_title_1: { tr: "Lemara", en: "to Lemar" },
    welcome_title_2: { tr: "Hoşgeldiniz", en: "Welcome" },
    subtitle: { tr: "Lezzetin en koyu hali", en: "The darkest state of flavor" },
    discover_menu: { tr: "Menümüzü Keşfedin", en: "Discover Our Menu" },
    our_story_title: { tr: "Bizim Hikayemiz", en: "Our Story" },
    our_story_text: {
      tr: `2024 yılında lezzet tutkunları için kapılarını aralayan Lemar Bistro, en taze
          malzemelerle hazırlanan eşsiz menüsü, sıcak atmosferi ve kaliteli hizmet anlayışıyla kısa sürede şehrin
          buluşma noktası haline geldi. Her damak zevkine hitap eden zengin seçeneklerimizle sizleri bekliyoruz.`,
      en: `Lemar Bistro, which opened its doors in 2024 for taste enthusiasts, quickly became the meeting point of the city with its unique menu prepared with the freshest ingredients, warm atmosphere, and quality service approach. We are waiting for you with our rich options that appeal to every palate.`
    },
    artists_title: { tr: "Sanatçılar", en: "Artists" },
    gallery_title: { tr: "Lezzetlerimizden Kareler", en: "Frames from Our Delicacies" },
    testimonials_title: { tr: "Misafirlerimiz Ne Diyor?", en: "What Our Guests Say?" },
    contact_title: { tr: "Bize Ulaşın", en: "Contact Us" },
    address_title: { tr: "Adres", en: "Address" },
    phone_title: { tr: "Telefon", en: "Phone" },
    footer_rights: { tr: "© 2025 Lemar Bistro. Tüm Hakları Saklıdır.", en: "© 2025 Lemar Bistro. All Rights Reserved." }
  };

  const t = (key: string) => translations[key]?.[lang] || key;

  return (
    <div className={timeSlot} style={{
      backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url('/${bgUrl}')`,
      backgroundAttachment: 'fixed',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh'
    }}>
      <div className="header">
        <nav className="main-nav">
          <button className="hamburger" id="hamburger-menu">
            <span className="hamburger-bar"></span>
            <span className="hamburger-bar"></span>
            <span className="hamburger-bar"></span>
          </button>
          <div className="nav-links">
            <a href="#about-section">{t('nav_about')}</a>
            <a href="#menu-section">{t('nav_menu')}</a>
            <a href="#artists-section">{t('nav_artists')}</a>
            <a href="#gallery-section">{t('nav_gallery')}</a>
            <a href="#contact-section">{t('nav_contact')}</a>
            <LanguageSwitcher />
          </div>
        </nav>
        <h1>
          <span className="thin">{t('welcome_title_1')}</span><br />
          <span className="bold">{t('welcome_title_2')}</span>
        </h1>
        <p className="subtitle">{t('subtitle')}</p>
        <a href="#menu-section" className="menu-button">{t('discover_menu')}</a>
      </div>

      <section id="about-section" className="content-section scroll-animate">
        <div className="section-container">
          <h2 className="section-title">{t('our_story_title')}</h2>
          <p className="section-paragraph">{t('our_story_text')}</p>
        </div>
      </section>

      <div className="section-divider"></div>

      <section id="menu-section">
        <MenuSystem initialData={menuData} lang={lang} />
      </section>

      <div className="section-divider"></div>

      <section id="artists-section" className="content-section scroll-animate">
        <div className="section-container">
          <h2 className="section-title">{t('artists_title')}</h2>
          <Artists weekData={artistsData} lang={lang} />
        </div>
      </section>

      <div className="section-divider"></div>

      <section id="gallery-section" className="content-section scroll-animate">
        <div className="section-container">
          <h2 className="section-title">{t('gallery_title')}</h2>
          <Gallery images={filteredGallery} />
        </div>
      </section>

      <div className="section-divider"></div>

      <section id="testimonial-section" className="content-section scroll-animate">
        <div className="section-container">
          <h2 className="section-title">{t('testimonials_title')}</h2>
          <Testimonials data={testimonialData} lang={lang} />
        </div>
      </section>

      <div className="section-divider"></div>
      <section id="contact-section" className="content-section scroll-animate">
        <div className="section-container">
          <h2 className="section-title">{t('contact_title')}</h2>
          <div className="contact-container">
            <div className="contact-info">
              <h3 data-key="address_title">{t('address_title')}</h3>
              <p>Kınıklı, Hüseyin Yılmaz Cd. No:72, 20160 Denizli Merkez/Denizli</p>
              <h3 data-key="phone_title">{t('phone_title')}</h3>
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
        </div>
        <p>{t('footer_rights')}</p>
        <a href="/admin" className="admin-link">Admin</a>
      </footer>

      <button id="scroll-to-top" title="Yukarı Çık">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
      </button>

      {/* Load script.js from public folder for remaining interactive logic */}
      <Script src="/script.js" strategy="afterInteractive" />
    </div>
  );
}