import { useState, useEffect, useRef } from 'react';
import { IconMenu, IconX, IconGlobe, IconSparkles, IconChevronDown, IconCheck, IconUsers, IconMail } from './Icons';

export default function Navbar({ lang, setLang, t, onNavigateToApp, currentUser, siteContent }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(true);
  const dropdownRef = useRef(null);

  const languages = [
    { code: 'fr', label: 'Français', short: 'FR' },
    { code: 'en', label: 'English', short: 'EN' },
    { code: 'sw', label: 'Kiswahili', short: 'SW' }
  ];

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setLangDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLangObj = languages.find(l => l.code === lang) || languages[0];

  return (
    <nav className="navbar-blur">
      <div 
        className="container" 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          height: '70px',
          gap: '20px'
        }}
      >
        {/* 1. Left: Brand Logo & Title */}
        <a 
          href="#" 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px', 
            textDecoration: 'none',
            flexShrink: 0 
          }}
        >
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '9px',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(11,25,44,0.12)',
            flexShrink: 0
          }}>
            <img src="/logo.jpg" alt="MBEGU Capital Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.025em', color: '#0B192C', whiteSpace: 'nowrap' }}>
              {siteContent?.brandName || 'MBEGU Capital'}
            </span>
            <span style={{
              fontSize: '0.6875rem',
              fontWeight: 700,
              padding: '2px 7px',
              borderRadius: '999px',
              background: 'rgba(6, 182, 212, 0.12)',
              color: '#0891B2',
              border: '1px solid rgba(6, 182, 212, 0.25)',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap'
            }}>
              {siteContent?.brandVersion || 'v0.1'}
            </span>
          </div>
        </a>

        {/* 2. Center: Desktop Navigation Links (Pill Style) */}
        <div 
          className="desktop-links"
          style={{ 
            display: 'none', 
            alignItems: 'center', 
            justifyContent: 'center',
            gap: '2px',
            flexWrap: 'nowrap',
            flex: 1
          }}
        >
          <a href="#patrimoine" className="nav-pill-link">
            {lang === 'fr' ? (siteContent?.navWealth || t.nav.wealth) : t.nav.wealth}
          </a>
          <a href="#simulateur" className="nav-pill-link">
            {lang === 'fr' ? (siteContent?.navSimulator || t.nav.simulator) : t.nav.simulator}
          </a>
          <a href="#commercants" className="nav-pill-link">
            {lang === 'fr' ? (siteContent?.navMerchants || t.nav.merchants) : t.nav.merchants}
          </a>
          <a href="#hors-ligne" className="nav-pill-link">
            {lang === 'fr' ? (siteContent?.navOffline || t.nav.offline) : t.nav.offline}
          </a>
          <a href="#tarifs" className="nav-pill-link">
            {lang === 'fr' ? (siteContent?.navPricing || t.nav.pricing) : t.nav.pricing}
          </a>
          <a href="#faq" className="nav-pill-link">
            {lang === 'fr' ? (siteContent?.navFaq || t.nav.faq) : t.nav.faq}
          </a>

          <a href="#actualites" className="nav-pill-link">
            {lang === 'fr' ? (siteContent?.navNews || t.nav?.news || 'Actualités') : (t.nav?.news || 'News')}
          </a>

          {/* À propos with Dropdown (Equipe, Contact, Centre d'aide) */}
          <div
            className="about-dropdown-container"
          >
            <button
              type="button"
              onClick={() => setAboutDropdownOpen(true)}
              className={`about-dropdown-btn ${aboutDropdownOpen ? 'active' : ''}`}
              aria-expanded={aboutDropdownOpen}
            >
              <span>{lang === 'fr' ? (siteContent?.navAbout || t.nav?.about || 'À propos') : (t.nav?.about || 'About')}</span>
              <IconChevronDown
                size={13}
                style={{
                  color: '#64748B',
                  transform: aboutDropdownOpen ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.2s ease'
                }}
              />
            </button>

            {aboutDropdownOpen && (
              <div className="about-dropdown-menu">
                <a
                  href="#equipe"
                  onClick={() => setAboutDropdownOpen(false)}
                  className="about-dropdown-item"
                >
                  <div className="about-item-icon">
                    <IconUsers size={16} />
                  </div>
                  <div>
                    <div className="about-item-title">{lang === 'fr' ? (siteContent?.navTeam || t.nav?.team || 'Équipe') : (t.nav?.team || 'Team')}</div>
                    <div className="about-item-sub">
                      {lang === 'en' ? 'Founders & DRC experts' : lang === 'sw' ? 'Waanzilishi na wataalamu DRC' : 'Fondateurs & experts RDC'}
                    </div>
                  </div>
                </a>

                <a
                  href="#contact"
                  onClick={() => setAboutDropdownOpen(false)}
                  className="about-dropdown-item"
                >
                  <div className="about-item-icon">
                    <IconMail size={16} />
                  </div>
                  <div>
                    <div className="about-item-title">{lang === 'fr' ? (siteContent?.navContact || t.nav?.contact || 'Contact') : (t.nav?.contact || 'Contact')}</div>
                    <div className="about-item-sub">
                      {lang === 'en' ? 'Kinshasa, Goma & channels' : lang === 'sw' ? 'Kinshasa, Goma na mitandao' : 'Kinshasa, Goma & réseaux'}
                    </div>
                  </div>
                </a>

                <a
                  href="#centre-daide"
                  onClick={() => setAboutDropdownOpen(false)}
                  className="about-dropdown-item"
                >
                  <div className="about-item-icon">
                    <IconSparkles size={16} />
                  </div>
                  <div>
                    <div className="about-item-title">{lang === 'fr' ? (siteContent?.navHelpCenter || t.nav?.helpCenter || "Centre d'aide") : (t.nav?.helpCenter || "Help Center")}</div>
                    <div className="about-item-sub">
                      {lang === 'en' ? 'Support & FAQ' : lang === 'sw' ? 'Msaada na Maswali' : 'Assistance & FAQ'}
                    </div>
                  </div>
                </a>
              </div>
            )}
          </div>

        </div>

        {/* 3. Right: Language & Auth CTAs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          {/* Language Selector Dropdown */}
          <div style={{ position: 'relative' }} ref={dropdownRef}>
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                height: '38px',
                padding: '0 10px',
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '0.8125rem',
                fontWeight: 700,
                color: '#334155',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap'
              }}
              aria-label={lang === 'en' ? 'Select language' : lang === 'sw' ? 'Chagua lugha' : 'Sélectionner la langue'}
            >
              <IconGlobe size={15} style={{ color: '#06B6D4' }} />
              <span>{currentLangObj.short}</span>
              <IconChevronDown size={13} style={{ color: '#94A3B8', transform: langDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>

            {/* Dropdown Options */}
            {langDropdownOpen && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                right: 0,
                background: '#FFFFFF',
                borderRadius: '12px',
                boxShadow: '0 12px 28px -4px rgba(11,25,44,0.12), 0 4px 12px rgba(0,0,0,0.04)',
                border: '1px solid #E2E8F0',
                minWidth: '144px',
                overflow: 'hidden',
                zIndex: 250,
                padding: '4px'
              }}>
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLang(l.code);
                      setLangDropdownOpen(false);
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: 'none',
                      background: lang === l.code ? '#F0FDFA' : 'transparent',
                      color: lang === l.code ? '#0891B2' : '#334155',
                      fontWeight: lang === l.code ? 700 : 500,
                      fontSize: '0.8125rem',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <span>{l.label} ({l.short})</span>
                    {lang === l.code && <IconCheck size={14} style={{ color: '#0891B2' }} />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dynamic Login / Account Access Button */}
          <button
            type="button"
            onClick={onNavigateToApp}
            className="desktop-login-btn"
            title={lang === 'en' ? 'Open the application' : lang === 'sw' ? 'Fungua programu' : "Accéder directement à l'application"}
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '6px',
              height: '38px',
              padding: '0 14px',
              borderRadius: '10px',
              border: '1px solid #CBD5E1',
              background: '#FFFFFF',
              color: '#0B192C',
              fontSize: '0.8125rem',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {currentUser ? (
              <>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }}></span>
                <span>{currentUser.name?.split(' ')[0] || (lang === 'en' ? 'My Account' : lang === 'sw' ? 'Akaunti Yangu' : 'Mon Compte')}</span>
              </>
            ) : (
              t.nav.login
            )}
          </button>

          {/* Mobile hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '38px',
              height: '38px',
              borderRadius: '9px',
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              color: '#0F172A',
              cursor: 'pointer',
              flexShrink: 0
            }}
            className="mobile-toggle"
            aria-label={lang === 'en' ? 'Menu' : lang === 'sw' ? 'Menyu' : 'Menu'}
          >
            {mobileMenuOpen ? <IconX size={18} /> : <IconMenu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div style={{
          background: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
          padding: '20px 24px 28px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.08)'
        }}>
          {/* Mobile Language Selector Tabs */}
          <div style={{
            display: 'flex',
            background: '#F1F5F9',
            padding: '3px',
            borderRadius: '9px',
            marginBottom: '16px'
          }}>
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                style={{
                  flex: 1,
                  padding: '7px 0',
                  border: 'none',
                  borderRadius: '7px',
                  background: lang === l.code ? '#FFFFFF' : 'transparent',
                  color: lang === l.code ? '#0B192C' : '#64748B',
                  fontWeight: 700,
                  fontSize: '0.8125rem',
                  cursor: 'pointer',
                  boxShadow: lang === l.code ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
                }}
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Mobile Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <a 
              href="#patrimoine" 
              onClick={() => setMobileMenuOpen(false)}
              className="mobile-nav-item"
            >
              {t.nav.wealth}
            </a>
            <a 
              href="#simulateur" 
              onClick={() => setMobileMenuOpen(false)}
              className="mobile-nav-item"
            >
              {t.nav.simulator}
            </a>
            <a 
              href="#commercants" 
              onClick={() => setMobileMenuOpen(false)}
              className="mobile-nav-item"
            >
              {t.nav.merchants}
            </a>
            <a 
              href="#hors-ligne" 
              onClick={() => setMobileMenuOpen(false)}
              className="mobile-nav-item"
            >
              {t.nav.offline}
            </a>
            <a 
              href="#tarifs" 
              onClick={() => setMobileMenuOpen(false)}
              className="mobile-nav-item"
            >
              {t.nav.pricing}
            </a>
            <a 
              href="#faq" 
              onClick={() => setMobileMenuOpen(false)}
              className="mobile-nav-item"
            >
              {t.nav.faq}
            </a>
            <a
              href="#actualites"
              onClick={() => setMobileMenuOpen(false)}
              className="mobile-nav-item"
            >
              {lang === 'fr' ? (siteContent?.navNews || t.nav?.news || 'Actualités') : (t.nav?.news || 'News')}
            </a>

            {/* Mobile À propos accordion (Equipe, Contact, Centre d'aide) */}
            <div style={{
              background: '#F8FAFC',
              borderRadius: '10px',
              border: '1px solid #E2E8F0',
              overflow: 'hidden'
            }}>
              <button
                type="button"
                onClick={() => setMobileAboutOpen(true)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  background: 'transparent',
                  border: 'none',
                  fontSize: '0.9375rem',
                  fontWeight: 700,
                  color: '#0F172A',
                  cursor: 'pointer'
                }}
              >
                <span>{t.nav?.about || 'À propos'}</span>
                <IconChevronDown
                  size={16}
                  style={{
                    color: '#64748B',
                    transform: mobileAboutOpen ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.2s'
                  }}
                />
              </button>

              {mobileAboutOpen && (
                <div style={{
                  padding: '0 10px 10px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}>
                  <a
                    href="#equipe"
                    onClick={() => setMobileMenuOpen(false)}
                    className="mobile-nav-subitem"
                  >
                    <IconUsers size={16} style={{ color: '#0891B2' }} />
                    <span>{t.nav?.team || 'Équipe'}</span>
                  </a>
                  <a
                    href="#contact"
                    onClick={() => setMobileMenuOpen(false)}
                    className="mobile-nav-subitem"
                  >
                    <IconMail size={16} style={{ color: '#0891B2' }} />
                    <span>{t.nav?.contact || 'Contact'}</span>
                  </a>
                  <a
                    href="#centre-daide"
                    onClick={() => setMobileMenuOpen(false)}
                    className="mobile-nav-subitem"
                  >
                    <IconSparkles size={16} style={{ color: '#0891B2' }} />
                    <span>{t.nav?.helpCenter || "Centre d'aide"}</span>
                  </a>
                </div>
              )}
            </div>

            {/* Mobile login CTA preserved at the end */}

            {/* Mobile app gateway CTA */}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigateToApp();
              }}
              className="btn btn-secondary"
              style={{ width: '100%', padding: '11px', fontWeight: 700, fontSize: '0.875rem', marginTop: '12px', textAlign: 'center', cursor: 'pointer' }}
            >
              {currentUser 
                ? (lang === 'en' ? 'Access my account →' : lang === 'sw' ? 'Fungua akaunti yangu →' : 'Accéder à mon espace direct →') 
                : t.nav.login}
            </button>
          </div>
        </div>
      )}

      <style>{`
        .nav-pill-link {
          text-decoration: none;
          color: #475569;
          font-weight: 600;
          font-size: 0.8125rem;
          white-space: nowrap !important;
          padding: 5px 8px;
          border-radius: 8px;
          transition: all 0.15s ease;
          display: inline-block;
          flex-shrink: 0;
        }

        .nav-pill-link:hover {
          color: #0B192C;
          background: #F1F5F9;
        }

        .about-dropdown-container {
          position: relative;
          display: inline-block;
          flex-shrink: 0;
        }

        .about-dropdown-btn {
          text-decoration: none;
          color: #475569;
          font-weight: 600;
          font-size: 0.8125rem;
          white-space: nowrap !important;
          padding: 5px 8px;
          border-radius: 8px;
          transition: all 0.15s ease;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: transparent;
          border: none;
          cursor: pointer;
          font-family: inherit;
        }

        .about-dropdown-btn:hover,
        .about-dropdown-btn.active {
          color: #0B192C;
          background: #F1F5F9;
        }

        .about-dropdown-menu {
          position: absolute;
          top: calc(100% + 6px);
          left: 50%;
          transform: translateX(-50%);
          background: #FFFFFF;
          border-radius: 12px;
          box-shadow: 0 14px 34px -4px rgba(11,25,44,0.15), 0 4px 12px rgba(0,0,0,0.06);
          border: 1px solid #E2E8F0;
          min-width: 220px;
          padding: 6px;
          z-index: 300;
          display: flex;
          flex-direction: column;
          gap: 2px;
          animation: aboutFadeSlide 0.18s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes aboutFadeSlide {
          from {
            opacity: 0;
            transform: translate(-50%, -6px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }

        .about-dropdown-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 12px;
          border-radius: 8px;
          text-decoration: none;
          transition: all 0.15s ease;
          color: #0F172A;
        }

        .about-dropdown-item:hover {
          background: #F0FDFA;
          color: #0891B2;
        }

        .about-item-icon {
          width: 30px;
          height: 30px;
          border-radius: 7px;
          background: #F1F5F9;
          color: #0891B2;
          display: flex;
          align-items: center;
          justifyContent: center;
          flex-shrink: 0;
          transition: background 0.15s ease;
        }

        .about-dropdown-item:hover .about-item-icon {
          background: #CCFBF1;
        }

        .about-item-title {
          font-size: 0.8125rem;
          font-weight: 700;
          line-height: 1.2;
        }

        .about-item-sub {
          font-size: 0.6875rem;
          color: #64748B;
          line-height: 1.2;
          margin-top: 2px;
        }

        .mobile-nav-subitem {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 10px;
          border-radius: 7px;
          text-decoration: none;
          color: #334155;
          font-size: 0.875rem;
          font-weight: 600;
          transition: background 0.15s ease;
        }

        .mobile-nav-subitem:hover {
          background: #FFFFFF;
          color: #0891B2;
        }

        .nav-pill-connexion:hover {
          color: #0891B2 !important;
          background: #ECFEFF !important;
        }

        .desktop-login-btn:hover {
          background: #F8FAFC;
          border-color: #0891B2;
          color: #0891B2;
        }

        .mobile-nav-item {
          text-decoration: none;
          color: #0F172A;
          font-weight: 600;
          font-size: 0.9375rem;
          padding: 8px 12px;
          border-radius: 8px;
          transition: background 0.15s ease;
        }

        .mobile-nav-item:hover {
          background: #F1F5F9;
        }

        @media (min-width: 1140px) {
          .desktop-links {
            display: flex !important;
          }
          .desktop-login-btn {
            display: inline-flex !important;
          }
          .mobile-toggle {
            display: none !important;
          }
        }
      `}</style>
    </nav>
  );
}
