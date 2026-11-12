import { 
  IconShield, 
  IconLock, 
  IconWallet, 
  IconCoins, 
  IconFileSpreadsheet, 
  IconSparkles, 
  IconCheck
} from './Icons';

export default function FeaturesBento({ lang = 'fr', t, siteContent }) {
  const getTxt = (siteVal, tVal) => (lang === 'fr' && siteVal ? siteVal : tVal);

  return (
    <section id="patrimoine" style={{ padding: '96px 0', background: '#FFFFFF', borderBottom: '1px solid #E2E8F0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 56px' }}>
          <span className="badge-cyan" style={{ marginBottom: '14px' }}>
            <IconSparkles size={14} />
            {getTxt(siteContent?.featuresBadge, t.features?.badge || "L'Écosystème MBEGU Capital")}
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 3.8vw, 2.85rem)', fontWeight: 800, color: '#0B192C', letterSpacing: '-0.03em', marginBottom: '16px' }}>
            {getTxt(siteContent?.featuresTitle, t.features?.title || 'Une suite financière pensée pour vos défis réels')}
          </h2>
          <p style={{ fontSize: '1.0625rem', color: '#475569', lineHeight: 1.6 }}>
            {getTxt(siteContent?.featuresDescription, t.features?.description || 'De la gestion de votre épargne personnelle jusqu’au dossier de crédit bancaire, découvrez comment MBEGU Capital unifie vos finances.')}
          </p>
        </div>

        {/* Bento Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: '24px'
        }}>
          {/* Card 1: Multi-Accounts aggregation (7 cols) */}
          <div className="card-finary" style={{ gridColumn: 'span 7', padding: '36px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }} id="bento-1">
            <div>
              <div style={{ display: 'inline-flex', padding: '8px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.1)', color: '#0891B2', marginBottom: '16px' }}>
                <IconWallet size={24} />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0B192C', marginBottom: '10px' }}>
                {t.features?.card1Title || 'Comptes Multiples & Mobile Money Unifiés'}
              </h3>
              <p style={{ fontSize: '0.9375rem', color: '#475569', lineHeight: 1.6, marginBottom: '20px' }}>
                {t.features?.card1Desc || 'Rassemblez vos comptes en devises multiples : Espèces en coffre, Vodacom M-Pesa, Airtel Money, Orange Money, Banques. Le solde est calculé strictement : Solde initial + Entrées - Sorties.'}
              </p>
            </div>

            <div style={{ background: '#F8FAFC', borderRadius: '14px', padding: '16px', border: '1px solid #E2E8F0', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '4px 10px', borderRadius: '6px', background: '#FFFFFF', border: '1px solid #E2E8F0' }}>💵 {t.features?.cash || 'Espèces'}</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '4px 10px', borderRadius: '6px', background: '#FFFFFF', border: '1px solid #E2E8F0' }}>📱 Vodacom M-Pesa</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '4px 10px', borderRadius: '6px', background: '#FFFFFF', border: '1px solid #E2E8F0' }}>📱 Airtel Money</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '4px 10px', borderRadius: '6px', background: '#FFFFFF', border: '1px solid #E2E8F0' }}>📱 Orange Money</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '4px 10px', borderRadius: '6px', background: '#FFFFFF', border: '1px solid #E2E8F0' }}>🏦 {t.features?.partnerBanks || 'Banques partenaires'}</span>
            </div>
          </div>

          {/* Card 2: Dual Currency CDF / USD (5 cols) */}
          <div className="card-finary" style={{ gridColumn: 'span 5', padding: '36px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }} id="bento-2">
            <div>
              <div style={{ display: 'inline-flex', padding: '8px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', color: '#059669', marginBottom: '16px' }}>
                <IconCoins size={24} />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0B192C', marginBottom: '10px' }}>
                {t.features?.card2Title || 'Double Devise CDF & USD avec Taux Horodaté'}
              </h3>
              <p style={{ fontSize: '0.9375rem', color: '#475569', lineHeight: 1.6 }}>
                {t.features?.card2Desc || "Chaque transaction conserve sa devise d'origine ainsi que le taux de change exact au moment de l'enregistrement, évitant tout décalage comptable lors des fluctuations."}
              </p>
            </div>

            <div style={{ background: '#F0FDF4', borderRadius: '12px', padding: '14px', border: '1px solid #BBF7D0', marginTop: '16px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#166534' }}>{t.features?.convRuleTitle || 'RÈGLE DE CONVERSION :'}</div>
              <div style={{ fontSize: '0.8125rem', color: '#15803D' }}>{t.features?.convRuleDesc || 'Montant CDF = Montant USD × Taux horodaté'}</div>
            </div>
          </div>

          {/* Card 3: Bank Credit Dossier Export (5 cols) */}
          <div className="card-finary" style={{ gridColumn: 'span 5', padding: '36px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }} id="bento-3">
            <div>
              <div style={{ display: 'inline-flex', padding: '8px', borderRadius: '10px', background: 'rgba(2, 132, 199, 0.1)', color: '#0284C7', marginBottom: '16px' }}>
                <IconFileSpreadsheet size={24} />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0B192C', marginBottom: '10px' }}>
                {t.features?.card3Title || 'Export Bancaire Certifié (PDF / CSV)'}
              </h3>
              <p style={{ fontSize: '0.9375rem', color: '#475569', lineHeight: 1.6 }}>
                {t.features?.card3Desc || 'Générez en un clic des états financiers clairs et exploitables pour votre banque, votre microfinance ou vos associés.'}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: '#0284C7', fontWeight: 700 }}>
              <IconCheck size={16} /> {t.features?.pdfReport || 'Rapport officiel PDF'} • {t.features?.csvReport || 'Export données CSV'}
            </div>
          </div>

          {/* Card 4: PIN & Biometrics Security (7 cols) */}
          <div className="card-finary" style={{ gridColumn: 'span 7', padding: '36px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }} id="bento-4">
            <div>
              <div style={{ display: 'inline-flex', padding: '8px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.1)', color: '#D97706', marginBottom: '16px' }}>
                <IconShield size={24} />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0B192C', marginBottom: '10px' }}>
                {t.features?.card4Title || 'Sécurité Maximale & Données 100% Locales'}
              </h3>
              <p style={{ fontSize: '0.9375rem', color: '#475569', lineHeight: 1.6, marginBottom: '20px' }}>
                {t.features?.card4Desc || 'Vos chiffres restent les vôtres. Chiffrement local AES-256 et verrouillage automatique par PIN ou biométrie.'}
              </p>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', fontSize: '0.8125rem', color: '#334155' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><IconLock size={14} style={{ color: '#00D2B4' }} /> {t.features?.localDb || 'Base chiffrée AES-256'}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><IconLock size={14} style={{ color: '#00D2B4' }} /> {t.features?.autoLock || 'Verrouillage 60s'}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><IconLock size={14} style={{ color: '#00D2B4' }} /> {t.features?.offlineBadge || 'Fonctionne sans réseau'}</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          #bento-1, #bento-2, #bento-3, #bento-4 {
            grid-column: span 12 !important;
          }
        }
      `}</style>
    </section>
  );
}
