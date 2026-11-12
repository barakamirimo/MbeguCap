import { useState } from 'react';
import { 
  IconSparkles, 
  IconWhatsApp, 
  IconLinkedIn, 
  IconXSocial, 
  IconFacebook, 
  IconInstagram, 
  IconTikTok,
  IconYouTube,
  IconMail, 
  IconMapPin, 
  IconSend, 
  IconCheck, 
  IconArrowUpRight 
} from './Icons';

export default function Contact({ lang = 'fr', t, siteContent }) {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [formSent, setFormSent] = useState(false);
  const [messageForm, setMessageForm] = useState({
    name: '',
    contact: '',
    subject: 'question',
    message: ''
  });

  const getTxt = (siteVal, tVal) => (lang === 'fr' && siteVal ? siteVal : tVal);
  const localized = (fr, en, sw) => ({ fr, en, sw })[lang] || fr;

  const handleCopyEmail = () => {
    navigator.clipboard?.writeText(siteContent?.contactEmail || 'mbegucapital@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageForm.name || !messageForm.message) return;
    setFormSent(true);
  };

  const socialNetworks = [
    {
      name: 'WhatsApp Business',
      tag: localized('Assistance & Pilote', 'Support & Pilot', 'Msaada na Jaribio'),
      handle: siteContent?.whatsappDisplay || '+243 902 725 344',
      desc: localized(
        'Assistance directe 7j/7 et groupe privé des commerçants et particuliers pilotes.',
        'Direct support 7 days a week and a private group for pilot merchants and individuals.',
        'Msaada wa moja kwa moja siku 7 kwa wiki na kundi la faragha la wafanyabiashara na watumiaji wa jaribio.'
      ),
      color: '#25D366',
      bgLight: 'rgba(37, 211, 102, 0.08)',
      icon: <IconWhatsApp size={24} style={{ color: '#25D366' }} />,
      url: `https://wa.me/${siteContent?.whatsapp || '243902725344'}`
    },
    {
      name: 'Instagram',
      tag: localized('Conseils & Coulisses', 'Tips & Behind the Scenes', 'Vidokezo na Maisha ya Ndani'),
      handle: '@mbengucapital',
      desc: localized(
        'Conseils visuels d\'épargne, infographies et coulisses de l\'équipe.',
        'Visual savings tips, infographics, and behind-the-scenes moments with the team.',
        'Vidokezo vya picha kuhusu akiba, infografia na shughuli za timu.'
      ),
      color: '#E1306C',
      bgLight: 'rgba(225, 48, 108, 0.08)',
      icon: <IconInstagram size={24} style={{ color: '#E1306C' }} />,
      url: siteContent?.instagram || 'https://www.instagram.com/mbengucapital?vrfl=dmQ4MjByem9nM2Zt'
    },
    {
      name: 'TikTok',
      tag: localized('Vidéos & Tendances', 'Videos & Trends', 'Video na Mitindo'),
      handle: '@MbenguCapital',
      desc: localized(
        'Conseils pratiques, astuces en vidéo et actualités du pilote en formats courts.',
        'Practical advice, video tips, and short updates from the pilot program.',
        'Ushauri wa vitendo, vidokezo vya video na habari fupi za jaribio.'
      ),
      color: '#0F172A',
      bgLight: 'rgba(15, 23, 42, 0.06)',
      icon: <IconTikTok size={24} style={{ color: '#0F172A' }} />,
      url: siteContent?.tiktok || 'https://vm.tiktok.com/ZS9fLESbXrMYV-vew5v/'
    },
    {
      name: 'YouTube',
      tag: localized('Vidéos & Tutoriels', 'Videos & Tutorials', 'Video na Mafunzo'),
      handle: '@MbenguCapital',
      desc: localized(
        'Démonstrations de l\'application, guides pas-à-pas et conseils de gestion financière.',
        'App demonstrations, step-by-step guides, and financial management advice.',
        'Maonyesho ya programu, miongozo ya hatua kwa hatua na ushauri wa usimamizi wa fedha.'
      ),
      color: '#EF4444',
      bgLight: 'rgba(239, 68, 68, 0.08)',
      icon: <IconYouTube size={24} style={{ color: '#EF4444' }} />,
      url: siteContent?.youtube || 'https://www.youtube.com/@MbenguCapital'
    },
    {
      name: 'X (Twitter)',
      tag: localized('Fintech & Mises à jour', 'Fintech & Updates', 'Teknolojia ya Fedha na Habari'),
      handle: '@MbenguCapital',
      desc: localized(
        'Annonces produit en direct, notes de version v0.1 et veille financière.',
        'Live product announcements, v0.1 release notes, and financial updates.',
        'Matangazo ya bidhaa, maelezo ya toleo la v0.1 na habari za fedha.'
      ),
      color: '#0F172A',
      bgLight: 'rgba(15, 23, 42, 0.06)',
      icon: <IconXSocial size={24} style={{ color: '#0F172A' }} />,
      url: siteContent?.twitter || 'https://x.com/MbenguCapital'
    },
    {
      name: 'Facebook',
      tag: localized('Communauté PME', 'SME Community', 'Jumuiya ya Biashara Ndogo'),
      handle: 'MBENGU Capital',
      desc: localized(
        'Événements, astuces de gestion de caisse et communauté d\'entrepreneurs.',
        'Events, cash management tips, and a community of entrepreneurs.',
        'Matukio, vidokezo vya kusimamia fedha na jumuiya ya wajasiriamali.'
      ),
      color: '#1877F2',
      bgLight: 'rgba(24, 119, 242, 0.08)',
      icon: <IconFacebook size={24} style={{ color: '#1877F2' }} />,
      url: siteContent?.facebook || 'https://www.facebook.com/profile.php?id=61596401847801'
    },
    {
      name: 'LinkedIn',
      tag: localized('Institutionnel', 'Corporate', 'Taarifa Rasmi'),
      handle: 'MBENGU Capital',
      desc: localized(
        'Actualités stratégiques, partenariats bancaires et développement en RDC.',
        'Strategic updates, banking partnerships, and our growth in the DRC.',
        'Habari za kimkakati, ushirikiano na benki na maendeleo yetu nchini DRC.'
      ),
      color: '#0A66C2',
      bgLight: 'rgba(10, 102, 194, 0.08)',
      icon: <IconLinkedIn size={24} style={{ color: '#0A66C2' }} />,
      url: siteContent?.linkedin || 'https://www.linkedin.com/in/mbengu-capital-40401944a?utm_source=share_via&utm_content=profile&utm_medium=member_android'
    }
  ];

  return (
    <section id="contact" style={{ padding: '96px 0', background: '#FFFFFF', borderBottom: '1px solid #E2E8F0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 56px' }}>
          <span className="badge-cyan" style={{ marginBottom: '14px' }}>
            <IconSparkles size={14} />
            {getTxt(siteContent?.contactTag, t.contact?.tag || 'Restons Connectés')}
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 3.8vw, 2.85rem)', fontWeight: 800, color: '#0B192C', letterSpacing: '-0.03em', marginBottom: '16px' }}>
            {getTxt(siteContent?.contactTitle, t.contact?.title || 'Contactez-nous & Rejoignez la Communauté')}
          </h2>
          <p style={{ fontSize: '1.0625rem', color: '#475569', lineHeight: 1.6 }}>
            {getTxt(siteContent?.contactSubtitle, t.contact?.subtitle || 'Une question sur le pilote, un partenariat ou besoin d\'assistance ? Retrouvez MBEGU Capital sur nos réseaux ou contactez notre équipe.')}
          </p>
        </div>

        {/* 5 Social Networks Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
          marginBottom: '56px'
        }}>
          {socialNetworks.map((net, idx) => (
            <a
              key={idx}
              href={net.url}
              target="_blank"
              rel="noopener noreferrer"
              className="card-finary"
              style={{
                padding: '24px',
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: '1px solid #E2E8F0',
                borderRadius: '18px',
                transition: 'all 0.25s ease'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: net.bgLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {net.icon}
                  </div>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', background: '#F1F5F9', color: '#475569' }}>
                    {net.tag}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#0B192C', marginBottom: '4px' }}>
                  {net.name}
                </h3>
                <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0891B2', marginBottom: '8px' }}>
                  {net.handle}
                </div>
                <p style={{ fontSize: '0.8125rem', color: '#64748B', lineHeight: 1.5, marginBottom: '18px' }}>
                  {net.desc}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', fontWeight: 700, color: '#0B192C' }}>
                <span>{lang === 'en' ? 'Join' : lang === 'sw' ? 'Jiunge' : 'Rejoindre'}</span>
                <IconArrowUpRight size={15} />
              </div>
            </a>
          ))}
        </div>

        {/* Direct Contact & Quick Message Box */}
        <div style={{
          background: '#F8FAFC',
          borderRadius: '24px',
          border: '1px solid #E2E8F0',
          padding: '40px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '36px'
        }}>
          {/* Left Column: Direct Info */}
          <div>
            <span className="badge-pill" style={{ marginBottom: '12px' }}>
              {lang === 'en' ? 'Our Contact Details' : lang === 'sw' ? 'Mawasiliano Yetu' : 'Nos Coordonnées'}
            </span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0B192C', marginBottom: '12px' }}>
              {lang === 'en' ? 'A team listening to you' : lang === 'sw' ? 'Timu iliyo tayari kukuhudumia' : 'Une équipe à votre écoute'}
            </h3>
            <p style={{ fontSize: '0.9375rem', color: '#475569', lineHeight: 1.6, marginBottom: '28px' }}>
              {lang === 'en'
                ? 'We support every pilot user to configure their CDF/USD accounts and first cash register records.'
                : lang === 'sw'
                ? 'Tunasaidia kila mtumiaji wa majaribio kuweka akaunti zake za CDF/USD na kurekodi miamala ya kwanza.'
                : 'Nous accompagnons chaque utilisateur du pilote pour configurer ses comptes en CDF/USD et ses premières écritures de caisse.'}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Email */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#FFFFFF', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0891B2', flexShrink: 0 }}>
                  <IconMail size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                    {t.contact?.emailTitle || 'E-mail Direct'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                    <a href={`mailto:${siteContent?.contactEmail || 'mbegucapital@gmail.com'}`} style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0B192C', textDecoration: 'none' }}>
                      {siteContent?.contactEmail || 'mbegucapital@gmail.com'}
                    </a>
                    <button
                      onClick={handleCopyEmail}
                      style={{
                        padding: '2px 8px',
                        fontSize: '0.6875rem',
                        fontWeight: 700,
                        borderRadius: '4px',
                        border: '1px solid #CBD5E1',
                        background: '#FFFFFF',
                        cursor: 'pointer',
                        color: copiedEmail ? '#059669' : '#475569'
                      }}
                    >
                      {copiedEmail ? (lang === 'en' ? 'Copied!' : lang === 'sw' ? 'Imenakiliwa!' : 'Copié !') : (lang === 'en' ? 'Copy' : lang === 'sw' ? 'Nakili' : 'Copier')}
                    </button>
                  </div>
                </div>
              </div>

              {/* WhatsApp Direct */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#FFFFFF', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#25D366', flexShrink: 0 }}>
                  <IconWhatsApp size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                    {lang === 'en' ? 'Official WhatsApp' : lang === 'sw' ? 'WhatsApp Rasmi' : 'WhatsApp Officiel'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px', flexWrap: 'wrap' }}>
                    <a
                      href={`https://wa.me/${siteContent?.whatsapp || '243902725344'}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0B192C', textDecoration: 'none' }}
                    >
                      {siteContent?.whatsappDisplay || '+243 902 725 344'}
                    </a>
                    <a
                      href={`https://wa.me/${siteContent?.whatsapp || '243902725344'}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: '2px 8px',
                        fontSize: '0.6875rem',
                        fontWeight: 700,
                        borderRadius: '4px',
                        border: '1px solid #A7F3D0',
                        background: '#ECFDF5',
                        color: '#059669',
                        textDecoration: 'none'
                      }}
                    >
                      {lang === 'en' ? 'Chat on WhatsApp →' : lang === 'sw' ? 'Wasiliana kwa WhatsApp →' : 'Discuter sur WhatsApp →'}
                    </a>
                  </div>
                </div>
              </div>

              {/* Locations */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#FFFFFF', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0891B2', flexShrink: 0 }}>
                  <IconMapPin size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                    {t.contact?.officeTitle || 'Présence en RDC'}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#334155', marginTop: '2px' }}>
                    <div>• {getTxt(siteContent?.officeKinshasa, t.contact?.officeKinshasa || 'Kinshasa : Gombe, RDC')}</div>
                    <div>• {getTxt(siteContent?.officeGoma, t.contact?.officeGoma || 'Goma : Nord-Kivu, RDC')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Quick Contact Form */}
          <div style={{ background: '#FFFFFF', borderRadius: '18px', padding: '28px', border: '1px solid #E2E8F0' }}>
            {formSent ? (
              <div style={{ textAlign: 'center', padding: '36px 12px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <IconCheck size={28} />
                </div>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0B192C', marginBottom: '8px' }}>
                  {lang === 'en' ? 'Message received!' : lang === 'sw' ? 'Ujumbe umepokelewa!' : 'Message bien reçu !'}
                </h4>
                <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.6, marginBottom: '20px' }}>
                  {lang === 'en'
                    ? `Thank you ${messageForm.name}. Our team will respond via email or WhatsApp (${siteContent?.whatsappDisplay || '+243 902 725 344'}) within the day.`
                    : lang === 'sw'
                    ? `Asante ${messageForm.name}. Timu yetu itakujibu kupitia barua pepe au WhatsApp (${siteContent?.whatsappDisplay || '+243 902 725 344'}) ndani ya siku.`
                    : `Merci ${messageForm.name}. Notre équipe vous répondra par e-mail ou WhatsApp (${siteContent?.whatsappDisplay || '+243 902 725 344'}) dans la journée.`}
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <a
                    href={`https://wa.me/${siteContent?.whatsapp || '243902725344'}?text=${encodeURIComponent(`Bonjour MBEGU Capital, je suis ${messageForm.name} : ${messageForm.message}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '9px 16px',
                      borderRadius: '8px',
                      background: '#ECFDF5',
                      color: '#059669',
                      border: '1px solid #A7F3D0',
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                      textDecoration: 'none'
                    }}
                  >
                    <IconWhatsApp size={16} />
                    <span>{lang === 'en' ? 'Also send on WhatsApp' : lang === 'sw' ? 'Tuma pia kwa WhatsApp' : 'Envoyer aussi sur WhatsApp'}</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setFormSent(false);
                      setMessageForm({ name: '', contact: '', subject: 'question', message: '' });
                    }}
                    style={{
                      padding: '9px 16px',
                      borderRadius: '8px',
                      background: '#F1F5F9',
                      color: '#475569',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {lang === 'en' ? 'Send another message' : lang === 'sw' ? 'Tuma ujumbe mwingine' : 'Envoyer un autre message'}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <h4 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0B192C', marginBottom: '4px' }}>
                  {lang === 'en' ? 'Send a direct message' : lang === 'sw' ? 'Tuma ujumbe wa moja kwa moja' : 'Envoyer un message direct'}
                </h4>

                <div>
                  <input
                    type="text"
                    required
                    placeholder={lang === 'en' ? 'Your full name *' : lang === 'sw' ? 'Jina lako kamili *' : 'Votre nom complet *'}
                    value={messageForm.name}
                    onChange={(e) => setMessageForm({ ...messageForm, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.875rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <input
                    type="text"
                    required
                    placeholder={lang === 'en' ? 'Email or WhatsApp number *' : lang === 'sw' ? 'Barua pepe au nambari ya WhatsApp *' : 'E-mail ou numéro WhatsApp *'}
                    value={messageForm.contact}
                    onChange={(e) => setMessageForm({ ...messageForm, contact: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.875rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <textarea
                    required
                    rows="3"
                    placeholder={lang === 'en' ? 'Your message or question *' : lang === 'sw' ? 'Ujumbe au swali lako *' : 'Votre message ou question *'}
                    value={messageForm.message}
                    onChange={(e) => setMessageForm({ ...messageForm, message: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.875rem',
                      outline: 'none',
                      resize: 'none'
                    }}
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ padding: '12px', fontSize: '0.875rem', marginTop: '6px' }}>
                  <IconSend size={15} />
                  {lang === 'en' ? 'Send to MBEGU team' : lang === 'sw' ? 'Tuma kwa timu ya MBEGU' : "Envoyer à l'équipe MBEGU"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
