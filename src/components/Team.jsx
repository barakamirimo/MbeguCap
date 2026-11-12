import { IconUsers, IconMapPin, IconCheckCircle2 } from './Icons';

export default function Team({ lang = 'fr', t, siteContent }) {
  const savedMembers = siteContent?.teamMembers;
  const localizedDefaults = t?.teamSection?.members || [
    {
      name: 'Dieudonné Mwamba',
      role: 'Co-Fondateur & Directeur Général',
      bio: 'Ex-consultant en inclusion financière et microfinance en RDC. Passionné par la numérisation du commerce informel.',
      location: 'Kinshasa, Gombe',
      badge: 'Direction',
      avatarColor: 'linear-gradient(135deg, #0891B2 0%, #0B192C 100%)',
      initials: 'DM'
    },
    {
      name: 'Arsène Kalonda',
      role: 'Lead Ingénieur & Architecte Offline',
      bio: 'Spécialiste des architectures offline-first et de la synchronisation de données hautement résiliente sans Internet continu.',
      location: 'Goma, Nord-Kivu',
      badge: 'Technologie',
      avatarColor: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
      initials: 'AK'
    },
    {
      name: 'Grace Bolamba',
      role: 'Responsable Produit & Partenariats Commerçants',
      bio: 'Plus de 7 ans d\'expérience sur le terrain auprès des PME, quincailleries, dépôts et coopératives d\'épargne.',
      location: 'Lubumbashi, Haut-Katanga',
      badge: 'Opérations',
      avatarColor: 'linear-gradient(135deg, #0D9488 0%, #115E59 100%)',
      initials: 'GB'
    },
    {
      name: 'Dr. Christian Lumbala',
      role: 'Conseiller Financier & Modélisation Bancaire',
      bio: 'Analyste quantitatif garantissant la rigueur mathématique des amortissements et des simulations bi-devises CDF/USD.',
      location: 'Kinshasa & International',
      badge: 'Conformité Bancaire',
      avatarColor: 'linear-gradient(135deg, #4F46E5 0%, #312E81 100%)',
      initials: 'CL'
    }
  ];
  const teamMembers = Array.isArray(savedMembers)
    ? savedMembers.map((member) => {
        const translation = lang === 'fr'
          ? null
          : localizedDefaults.find((candidate) => candidate.name === member.name);
        return translation
          ? {
              ...member,
              role: member.translations?.[lang]?.role || translation.role,
              bio: member.translations?.[lang]?.bio ?? translation.bio,
              location: member.translations?.[lang]?.location || translation.location,
              badge: member.translations?.[lang]?.badge || translation.badge
            }
          : lang === 'fr' ? member : {
              ...member,
              role: member.translations?.[lang]?.role || member.role,
              bio: member.translations?.[lang]?.bio ?? member.bio,
              location: member.translations?.[lang]?.location || member.location,
              badge: member.translations?.[lang]?.badge || ''
            };
      })
    : localizedDefaults;

  const pillars = t?.teamSection?.pillars || [
    {
      title: 'Ancrage Terrain 100% RDC',
      desc: 'Pensé et testé directement auprès des entrepreneurs de Kinshasa, Goma et Lubumbashi.'
    },
    {
      title: 'Rigueur & Modélisation Certifiée',
      desc: 'Respect des formules financières bancaires strictes sans approximations.'
    },
    {
      title: 'Souveraineté & Données Sécurisées',
      desc: 'Chiffrement local AES-256 et contrôle total de vos données financières.'
    }
  ];

  return (
    <section id="equipe" style={{ padding: '96px 0', background: '#FFFFFF', borderBottom: '1px solid #E2E8F0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 56px' }}>
          <span className="badge-cyan" style={{ marginBottom: '14px' }}>
            <IconUsers size={14} />
            {t?.teamSection?.badge || 'À Propos • Notre Équipe'}
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 3.8vw, 2.85rem)', fontWeight: 800, color: '#0B192C', letterSpacing: '-0.03em', marginBottom: '16px' }}>
            {t?.teamSection?.title || "Des bâtisseurs engagés pour l'économie congolaise"}
          </h2>
          <p style={{ fontSize: '1.125rem', color: '#64748B', lineHeight: 1.6 }}>
            {t?.teamSection?.desc || 'Une équipe pluridisciplinaire combinant expertise en finance bancaire, ingénierie logicielle locale résiliente et présence active sur le terrain en RDC.'}
          </p>
        </div>

        {/* Team Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '24px',
          marginBottom: '56px'
        }}>
          {teamMembers.map((member, idx) => (
            <div
              key={member.id || idx}
              className="card-finary"
              style={{
                padding: '28px 24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                background: '#FFFFFF',
                boxShadow: '0 4px 20px -2px rgba(11,25,44,0.05)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                  <div style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '14px',
                    background: member.avatarColor,
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '1.125rem',
                    letterSpacing: '0.05em',
                    boxShadow: '0 4px 12px rgba(11,25,44,0.15)'
                  }}>
                    {member.photo ? (
                      <img
                        src={member.photo}
                        alt={member.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }}
                      />
                    ) : member.initials}
                  </div>
                  {member.badge && <span style={{
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    padding: '3px 8px',
                    borderRadius: '999px',
                    background: '#F0FDFA',
                    color: '#0891B2',
                    border: '1px solid #CCFBF1'
                  }}>
                    {member.badge}
                  </span>}
                </div>

                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0B192C', marginBottom: '6px' }}>
                  {member.name}
                </h3>
                <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0891B2', marginBottom: '14px' }}>
                  {member.role}
                </div>
                {member.bio && (
                  <p style={{ fontSize: '0.875rem', color: '#64748B', lineHeight: 1.55, marginBottom: '20px' }}>
                    {member.bio}
                  </p>
                )}
              </div>

              {member.location && <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.75rem',
                color: '#94A3B8',
                fontWeight: 600,
                borderTop: '1px solid #F1F5F9',
                paddingTop: '12px'
              }}>
                <IconMapPin size={14} style={{ color: '#06B6D4' }} />
                <span>{member.location}</span>
              </div>}
            </div>
          ))}
        </div>

        {/* Pillars / Values Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #0B192C 0%, #152A4A 100%)',
          borderRadius: '18px',
          padding: '36px',
          color: '#FFFFFF',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '24px'
        }}>
          {pillars.map((pillar, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(6, 182, 212, 0.15)',
                color: '#00D2B4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <IconCheckCircle2 size={18} />
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '6px' }}>
                  {pillar.title}
                </h4>
                <p style={{ fontSize: '0.8125rem', color: '#94A3B8', lineHeight: 1.5, margin: 0 }}>
                  {pillar.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
