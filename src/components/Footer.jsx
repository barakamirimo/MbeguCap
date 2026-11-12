import {
  IconWhatsApp,
  IconLinkedIn,
  IconXSocial,
  IconFacebook,
  IconInstagram,
  IconTikTok,
  IconYouTube
} from './Icons';

export default function Footer({ lang = 'fr', setLang, t, onNavigateToAdmin, siteContent }) {
  const getTxt = (siteVal, tVal) => (lang === 'fr' && siteVal ? siteVal : tVal);

  return (
    <footer style={{ background: '#0B192C', color: '#CBD5E1', paddingTop: '80px', paddingBottom: '48px', borderTop: '1px solid #1E293B' }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '40px',
          marginBottom: '60px'
        }}>
          {/* Brand info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.2)' }}>
                <img src="/logo.jpg" alt="MBEGU Capital" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                {siteContent?.brandName || 'MBEGU Capital'}
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#94A3B8', lineHeight: 1.6, marginBottom: '20px' }}>
              {getTxt(siteContent?.footerDescription, t?.footerSection?.description || 'La première plateforme de gestion financière tout-en-un pour particuliers et commerçants en République Démocratique du Congo et en Afrique.')}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: '#00D2B4', fontWeight: 600 }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00D2B4' }}></span>
                {getTxt(siteContent?.footerStatus, t?.footerSection?.status || 'Architecture 100% Offline-First active')}
              </div>
              <a href={`mailto:${siteContent?.contactEmail || 'mbegucapital@gmail.com'}`} style={{ fontSize: '0.8125rem', color: '#38BDF8', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px' }} title={lang === 'en' ? 'Email us' : lang === 'sw' ? 'Tutumie barua pepe' : 'Nous écrire par e-mail'}>
                <span>✉️ {siteContent?.contactEmail || 'mbegucapital@gmail.com'}</span>
              </a>
            </div>

            {/* 7 Social Networks Icons */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
              <a href={`https://wa.me/${siteContent?.whatsapp || '243902725344'}`} target="_blank" rel="noopener noreferrer" style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'rgba(255,255,255,0.08)', color: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }} title="WhatsApp (+243 902 725 344)">
                <IconWhatsApp size={18} />
              </a>
              <a href={siteContent?.instagram || 'https://www.instagram.com/mbengucapital?vrfl=dmQ4MjByem9nM2Zt'} target="_blank" rel="noopener noreferrer" style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'rgba(255,255,255,0.08)', color: '#F472B6', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }} title="Instagram (@mbengucapital)">
                <IconInstagram size={18} />
              </a>
              <a href={siteContent?.tiktok || 'https://vm.tiktok.com/ZS9fLESbXrMYV-vew5v/'} target="_blank" rel="noopener noreferrer" style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'rgba(255,255,255,0.08)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }} title="TikTok (@MbenguCapital)">
                <IconTikTok size={18} />
              </a>
              <a href={siteContent?.youtube || 'https://www.youtube.com/@MbenguCapital'} target="_blank" rel="noopener noreferrer" style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'rgba(255,255,255,0.08)', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }} title="YouTube (@MbenguCapital)">
                <IconYouTube size={18} />
              </a>
              <a href={siteContent?.twitter || 'https://x.com/MbenguCapital'} target="_blank" rel="noopener noreferrer" style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'rgba(255,255,255,0.08)', color: '#CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }} title="X / Twitter (@MbenguCapital)">
                <IconXSocial size={18} />
              </a>
              <a href={siteContent?.facebook || 'https://www.facebook.com/profile.php?id=61596401847801'} target="_blank" rel="noopener noreferrer" style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'rgba(255,255,255,0.08)', color: '#60A5FA', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }} title="Facebook (MBENGU Capital)">
                <IconFacebook size={18} />
              </a>
              <a href={siteContent?.linkedin || 'https://www.linkedin.com/in/mbengu-capital-40401944a?utm_source=share_via&utm_content=profile&utm_medium=member_android'} target="_blank" rel="noopener noreferrer" style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'rgba(255,255,255,0.08)', color: '#38BDF8', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }} title="LinkedIn (MBENGU Capital)">
                <IconLinkedIn size={18} />
              </a>
            </div>
          </div>

          {/* Product links */}
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '18px' }}>
              {getTxt(siteContent?.footerProductTitle, t?.footerSection?.productTitle || 'Produit & Fonctionnalités')}
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.875rem' }}>
              <li><a href="#patrimoine" style={{ color: '#94A3B8', textDecoration: 'none' }}>{t?.footerSection?.itemWealth || 'Patrimoine Net Consolidé'}</a></li>
              <li><a href="#commercants" style={{ color: '#94A3B8', textDecoration: 'none' }}>{t?.footerSection?.itemMerchants || 'Module Commerçants & POS'}</a></li>
              <li><a href="#simulateur" style={{ color: '#94A3B8', textDecoration: 'none' }}>{t?.footerSection?.itemSimulator || 'Simulateur de Crédit & Épargne'}</a></li>
              <li><a href="#hors-ligne" style={{ color: '#94A3B8', textDecoration: 'none' }}>{t?.footerSection?.itemOffline || 'Mode 100% Hors-Ligne'}</a></li>
              <li><a href="#tarifs" style={{ color: '#94A3B8', textDecoration: 'none' }}>{t?.footerSection?.itemPricing || 'Tarifs & Abonnements'}</a></li>
              <li><a href="#actualites" style={{ color: '#94A3B8', textDecoration: 'none' }}>{t?.footerSection?.itemNews || 'Actualités & Annonces'}</a></li>
              <li><a href="#equipe" style={{ color: '#94A3B8', textDecoration: 'none' }}>{t?.footerSection?.itemTeam || 'Notre Équipe'}</a></li>
              <li><a href="#centre-daide" style={{ color: '#94A3B8', textDecoration: 'none' }}>{t?.footerSection?.itemHelp || "Centre d'aide & FAQ"}</a></li>
              <li><a href="#contact" style={{ color: '#00D2B4', textDecoration: 'none', fontWeight: 600 }}>{t?.footerSection?.itemContact || 'Contact & Réseaux Sociaux →'}</a></li>
            </ul>
          </div>

          {/* Compliance & Formulas */}
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '18px' }}>
              {getTxt(siteContent?.footerComplianceTitle, t?.footerSection?.complianceTitle || 'Rigueur & Formules')}
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.875rem', color: '#94A3B8' }}>
              <li>{t?.footerSection?.compPeriodic || '• Taux périodique : r = Taux / 12'}</li>
              <li>{t?.footerSection?.compDual || '• Bi-devise CDF / USD horodatée'}</li>
              <li>{t?.footerSection?.compReports || '• Rapports bancaires certifiés (PDF/CSV)'}</li>
              <li>{t?.footerSection?.compProfit || '• Calcul bénéfice net automatisé'}</li>
            </ul>
          </div>

          {/* Security & Language */}
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '18px' }}>
              {getTxt(siteContent?.footerSecurityTitle, t?.footerSection?.securityTitle || 'Langues & Sécurité')}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setLang('fr')}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: '1px solid #334155',
                    background: lang === 'fr' ? '#06B6D4' : 'transparent',
                    color: lang === 'fr' ? '#FFFFFF' : '#94A3B8',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    fontWeight: 700
                  }}
                >
                  Français
                </button>
                <button
                  onClick={() => setLang('en')}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: '1px solid #334155',
                    background: lang === 'en' ? '#06B6D4' : 'transparent',
                    color: lang === 'en' ? '#FFFFFF' : '#94A3B8',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    fontWeight: 700
                  }}
                >
                  English
                </button>
                <button
                  onClick={() => setLang('sw')}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: '1px solid #334155',
                    background: lang === 'sw' ? '#06B6D4' : 'transparent',
                    color: lang === 'sw' ? '#FFFFFF' : '#94A3B8',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    fontWeight: 700
                  }}
                >
                  Kiswahili
                </button>
              </div>
              <p style={{ fontSize: '0.8125rem', color: '#64748B', lineHeight: 1.5 }}>
                {t?.footerSection?.securityNotice || "Chiffrement local AES-256. Code PIN à 4 chiffres ou biométrie avec verrouillage automatique après 60s d'inactivité."}
              </p>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div style={{
          borderTop: '1px solid #1E293B',
          paddingTop: '28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          fontSize: '0.75rem',
          color: '#64748B',
          lineHeight: 1.6
        }}>
          <div>
            <strong>{t?.footerSection?.disclaimerTitle || 'Mention Légale & Avertissement :'}</strong> {t?.footerSection?.disclaimerText || 'MBEGU Capital est une solution technologique de gestion financière, de suivi patrimonial et d\'assistance comptable pour les commerçants et les particuliers. MBEGU Capital n\'est pas un établissement de crédit ou une institution financière. Les calculs et simulations de mensualités ne constituent pas une offre de crédit contractuelle.'}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
            <span>&copy; {new Date().getFullYear()} MBEGU Capital Inc. {t?.footerSection?.rightsReserved || 'Tous droits réservés. Kinshasa • Goma • Lubumbashi.'}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <a href="#" style={{ color: '#64748B', textDecoration: 'none' }}>{t?.footerSection?.privacy || 'Confidentialité'}</a>
              <a href="#" style={{ color: '#64748B', textDecoration: 'none' }}>{t?.footerSection?.terms || 'Conditions Générales'}</a>
              <button
                type="button"
                onClick={onNavigateToAdmin}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#00D2B4',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: 0
                }}
              >
                🔐 {t?.footerSection?.adminSpace || 'Espace Administrateur'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
