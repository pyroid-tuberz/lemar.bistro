import Image from "next/image";
import Script from "next/script";
import { readJson } from "@/lib/db";
import MenuSystem from "@/components/MenuSystem";
import Gallery from "@/components/Gallery";
import Artists from "@/components/Artists";
import Testimonials from "@/components/Testimonials";

export const revalidate = 60;

export default async function Home() {
  // Pre-fetch all data on the server in parallel
  const [menuData, bgData, galleryData, artistsData, testimonialData] = await Promise.all([
    readJson('menu.json') || { items: [], categories: {} },
    readJson('backgrounds.json') || { sabah: "sabah.png", oglen: "oglen.jpg", aksam: "aksam.jpg", times: { sabah: 6, oglen: 12, aksam: 18 } },
    readJson('gallery.json') || { images: [] },
    readJson('artists.json') || [],
    readJson('testimonials.json') || []
  ]);

  // Determine background based on server time
  const currentHour = new Date().getHours();
  const times = bgData.times || { sabah: 6, oglen: 12, aksam: 18 };
  let timeSlot = 'aksam';
  if (currentHour >= times.sabah && currentHour < times.oglen) timeSlot = 'sabah';
  else if (currentHour >= times.oglen && currentHour < times.aksam) timeSlot = 'oglen';

  const bgUrl = bgData[timeSlot] || (timeSlot === 'sabah' ? 'sabah.png' : timeSlot === 'oglen' ? 'oglen.jpg' : 'aksam.jpg');

  // Filter gallery images by time slot
  const filteredGallery = (galleryData.images || []).filter((img: any) => img.times.includes(timeSlot));

  return (
    <>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        backgroundImage: `url('/${bgUrl}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }} />

      <div className={timeSlot} style={{ minHeight: '100vh' }}>
        <div className="header">
          <nav className="main-nav">
            <button className="hamburger" id="hamburger-menu">
              <span className="hamburger-bar"></span>
              <span className="hamburger-bar"></span>
              <span className="hamburger-bar"></span>
            </button>
            <div className="nav-links">
              <a href="#about-section" data-key="nav_about">Hakkımızda</a>
              <a href="#menu-section" data-key="nav_menu">Menü</a>
              <a href="#artists-section" data-key="nav_artists">Sanatçılar</a>
              <a href="#gallery-section" data-key="nav_gallery">Galeri</a>
              <a href="#contact-section" data-key="nav_contact">İletişim</a>
            </div>
          </nav>
          <h1 data-key="welcome_title">
            <span className="thin">Lemara</span><br />
            <span className="bold">Hoşgeldiniz</span>
          </h1>
          <p className="subtitle">Lezzetin en koyu hali</p>
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

        <section id="menu-section">
          <MenuSystem initialData={menuData} />
        </section>

        <div className="section-divider"></div>

        <section id="artists-section" className="content-section scroll-animate">
          <div className="section-container">
            <h2 className="section-title" data-key="artists_title">Sanatçılar</h2>
            <Artists weekData={artistsData} />
          </div>
        </section>

        <div className="section-divider"></div>

        <section id="gallery-section" className="content-section scroll-animate">
          <div className="section-container">
            <h2 className="section-title" data-key="gallery_title">Lezzetlerimizden Kareler</h2>
            <Gallery images={filteredGallery} />
          </div>
        </section>

        <div className="section-divider"></div>

        <section id="testimonial-section" className="content-section scroll-animate">
          <div className="section-container">
            <h2 className="section-title">Misafirlerimiz Ne Diyor?</h2>
            <Testimonials data={testimonialData} />
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

        {/* Load script.js from public folder for remaining interactive logic */}
        <Script src="/script.js" strategy="afterInteractive" />
      </div>
    </>
  );
}
