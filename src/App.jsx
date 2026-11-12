import { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FeaturesBento from './components/FeaturesBento';
import InteractiveCalculator from './components/InteractiveCalculator';
import MerchantHub from './components/MerchantHub';
import OfflineArchitecture from './components/OfflineArchitecture';
import Pricing from './components/Pricing';
import News from './components/News';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import Team from './components/Team';
import Contact from './components/Contact';
import PilotModal from './components/PilotModal';
import AdminDashboard from './components/AdminDashboard';
import Footer from './components/Footer';
import { translations } from './data/translations';
import { IconSparkles, IconArrowRight } from './components/Icons';
import { getAppConnectionUrl, getAppDeepLink } from './config';
import { getSiteContent } from './config/siteContent';
import './App.css';

export default function App() {
  const [lang, setLang] = useState(() => {
    try {
      const savedLanguage = localStorage.getItem('mbegu_public_language');
      return savedLanguage && translations[savedLanguage] ? savedLanguage : 'fr';
    } catch {
      return 'fr';
    }
  });
  const [isPilotModalOpen, setIsPilotModalOpen] = useState(false);
  const [siteContent, setSiteContent] = useState(getSiteContent);

  useEffect(() => {
    const refreshContent = () => setSiteContent(getSiteContent());
    window.addEventListener('mbegu:site-content-change', refreshContent);
    window.addEventListener('storage', refreshContent);
    return () => {
      window.removeEventListener('mbegu:site-content-change', refreshContent);
      window.removeEventListener('storage', refreshContent);
    };
  }, []);
  
  // Track active view: 'website' | 'app' | 'admin'
  const [view, setView] = useState(() => {
    if (typeof window !== 'undefined') {
      if (window.location.hash === '#admin') return 'admin';
    }
    return 'website';
  });

  // Load user session if already authenticated
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('mbegu_user_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const t = translations[lang] || translations.fr;

  useEffect(() => {
    try {
      localStorage.setItem('mbegu_public_language', lang);
    } catch (error) {
      console.error(error);
    }
    document.documentElement.lang = lang;
  }, [lang]);

  const handleNavigateToApp = useCallback(() => {
    const isAndroid = /Android/i.test(navigator.userAgent);
    const configuredUrl = (siteContent?.connectionAppUrl && siteContent.connectionAppUrl.trim())
      ? siteContent.connectionAppUrl.trim()
      : getAppConnectionUrl();
    const configuredDeepLink = (siteContent?.connectionDeepLink && siteContent.connectionDeepLink.trim())
      ? siteContent.connectionDeepLink.trim()
      : getAppDeepLink();

    if (isAndroid && configuredDeepLink) {
      window.location.href = configuredDeepLink;
      return;
    }

    if (configuredUrl) {
      window.open(configuredUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    alert(lang === 'en'
      ? 'The application redirect link has not been configured in the admin space yet.'
      : lang === 'sw'
      ? 'Kiungo cha kwenda kwenye programu bado hakijawekwa kwenye sehemu ya usimamizi.'
      : "Le lien de redirection vers l'application n'a pas encore été configuré dans l'espace administrateur.");
  }, [siteContent, lang]);

  // Keep view in sync with URL hash (#app, #admin, or #website / anchor)
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setView('admin');
      } else if (window.location.hash === '#connexion' || window.location.hash === '#login' || window.location.hash === '#app') {
        handleNavigateToApp();
        window.history.replaceState(null, '', window.location.pathname);
      } else if (view !== 'website' && !window.location.hash.startsWith('#app') && !window.location.hash.startsWith('#admin')) {
        setView('website');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [view, siteContent, handleNavigateToApp]);

  const handleOpenPilotModal = () => {
    setIsPilotModalOpen(true);
  };

  const handleClosePilotModal = () => {
    setIsPilotModalOpen(false);
  };

  const handleNavigateToAdmin = () => {
    setView('admin');
    window.location.hash = '#admin';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReturnToWebsite = () => {
    setView('website');
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('mbegu_user_session');
    } catch (e) {
      console.error(e);
    }
    setView('website');
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 1. If in 'admin' view, render the dedicated Admin Console
  if (view === 'admin') {
    return (
      <AdminDashboard
        onReturnToWebsite={handleReturnToWebsite}
        lang={lang}
      />
    );
  }

  // 2. Render the public website
  return (
    <div className="app-wrapper">
      {/* Top Banner */}
      <div style={{
        background: 'linear-gradient(90deg, #0B192C 0%, #152A4A 50%, #0891B2 100%)',
        color: '#FFFFFF',
        fontSize: '0.8125rem',
        fontWeight: 600,
        padding: '8px 16px',
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px'
      }}>
        <span>{lang === 'fr' ? siteContent.topBannerText : t.topBannerText}</span>
        <button
          onClick={handleOpenPilotModal}
          style={{
            background: 'none',
            border: 'none',
            color: '#00D2B4',
            fontWeight: 700,
            cursor: 'pointer',
            textDecoration: 'underline',
            fontSize: '0.8125rem'
          }}
        >
          {lang === 'fr' ? siteContent.topBannerAction : t.topBannerAction}
        </button>
      </div>

      {/* Main Navigation */}
      <Navbar
        lang={lang}
        setLang={setLang}
        t={t}
        currentUser={currentUser}
        onOpenPilotModal={handleOpenPilotModal}
        onNavigateToApp={handleNavigateToApp}
        onNavigateToAdmin={handleNavigateToAdmin}
        siteContent={siteContent}
      />

      <main>
        {/* Hero Section */}
        <Hero
          lang={lang}
          t={t}
          onOpenPilotModal={handleOpenPilotModal}
          onNavigateToApp={handleNavigateToApp}
          siteContent={siteContent}
        />

        {/* Features Bento Grid */}
        <FeaturesBento
          lang={lang}
          t={t}
          onOpenPilotModal={handleOpenPilotModal}
          siteContent={siteContent}
        />

        {/* Interactive Credit & Savings Calculator */}
        <InteractiveCalculator
          lang={lang}
          t={t}
        />

        {/* Merchant & POS Hub (v0.2 Showcase) */}
        <MerchantHub
          lang={lang}
          t={t}
          onOpenPilotModal={handleOpenPilotModal}
        />

        {/* Offline Architecture Section */}
        <OfflineArchitecture
          lang={lang}
          t={t}
        />

        {/* Transparent Pricing */}
        <Pricing
          lang={lang}
          t={t}
          onOpenPilotModal={handleOpenPilotModal}
          onNavigateToApp={handleNavigateToApp}
        />

        {/* News & Updates Section */}
        <News lang={lang} t={t} />

        {/* Testimonials */}
        <Testimonials lang={lang} t={t} siteContent={siteContent} />

        {/* Pre-FAQ CTA Banner */}
        <section style={{
          padding: '80px 0',
          background: 'linear-gradient(135deg, #0B192C 0%, #112644 100%)',
          color: '#FFFFFF',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Subtle glow */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '600px',
            height: '250px',
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.2) 0%, transparent 70%)',
            pointerEvents: 'none'
          }}></div>

          <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1, maxWidth: '780px' }}>
            <span className="badge-cyan" style={{ marginBottom: '16px', background: 'rgba(6, 182, 212, 0.15)', color: '#00D2B4', border: '1px solid rgba(6, 182, 212, 0.3)' }}>
              {lang === 'fr' ? (siteContent.ctaBannerBadge || t.ctaBannerBadge) : t.ctaBannerBadge}
            </span>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.03em', marginBottom: '18px' }}>
              {lang === 'fr' ? (siteContent.ctaBannerTitle || t.ctaBannerTitle) : t.ctaBannerTitle}
            </h2>
            <p style={{ fontSize: '1.125rem', color: '#CBD5E1', lineHeight: 1.6, marginBottom: '36px' }}>
              {lang === 'fr' ? (siteContent.ctaBannerDesc || t.ctaBannerDesc) : t.ctaBannerDesc}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', justifyContent: 'center' }}>
              <button
                onClick={handleNavigateToApp}
                className="btn btn-cyan"
                style={{ padding: '14px 32px', fontSize: '1rem' }}
              >
                <IconSparkles size={18} />
                {currentUser 
                  ? (lang === 'en' ? 'Access My Account' : lang === 'sw' ? 'Fungua Akaunti Yangu' : 'Accéder à Mon Compte') 
                  : (lang === 'fr' ? (siteContent.ctaBannerApp || 'Tester l\'Application en Direct') : t.heroExtra.ctaDirectApp)}
              </button>
              <button
                onClick={handleOpenPilotModal}
                className="btn btn-secondary"
                style={{ padding: '14px 28px', fontSize: '1rem', background: 'rgba(255,255,255,0.08)', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.18)' }}
              >
                {lang === 'fr' ? (siteContent.ctaBannerSecondary || t.ctaBannerBtnPrimary) : t.ctaBannerBtnPrimary}
                <IconArrowRight size={18} />
              </button>
            </div>
          </div>
        </section>

        {/* FAQ & Centre d'aide */}
        <FAQ lang={lang} t={t} siteContent={siteContent} />

        {/* Team & Leadership */}
        <Team lang={lang} t={t} siteContent={siteContent} />

        {/* Contact & Social Networks */}
        <Contact lang={lang} t={t} siteContent={siteContent} />
      </main>

      {/* Footer */}
      <Footer
        lang={lang}
        setLang={setLang}
        t={t}
        onNavigateToAdmin={handleNavigateToAdmin}
        siteContent={siteContent}
      />

      {/* Pilot Registration Modal */}
      <PilotModal
        isOpen={isPilotModalOpen}
        onClose={handleClosePilotModal}
        lang={lang}
        t={t}
      />
    </div>
  );
}