import { useState, useEffect } from 'react';
import { 
  IconSparkles, 
  IconArrowRight, 
  IconWifiOff, 
  IconTrendingUp, 
  IconCheckCircle2,
  IconSmartphone,
  IconCoins
} from './Icons';
import { EXCHANGE_RATE_KEY, getGlobalExchangeRate } from '../config';

export default function Hero({ lang = 'fr', t, onOpenPilotModal, onNavigateToApp, siteContent }) {
  const [currency, setCurrency] = useState('USD'); // USD or CDF
  const [activeTab, setActiveTab] = useState('patrimoine'); // patrimoine, caisse, comptes
  const [exchangeRate, setExchangeRate] = useState(getGlobalExchangeRate);

  const getTxt = (siteVal, tVal) => (lang === 'fr' && siteVal ? siteVal : tVal);
  const numberLocale = lang === 'en' ? 'en-US' : lang === 'sw' ? 'sw-KE' : 'fr-FR';

  useEffect(() => {
    const handleRateChange = (event) => {
      if (event.detail?.exchangeRate > 0) setExchangeRate(event.detail.exchangeRate);
    };
    const handleStorage = (event) => {
      if (event.key === EXCHANGE_RATE_KEY) setExchangeRate(getGlobalExchangeRate());
    };
    window.addEventListener('mbegu:exchange-rate-change', handleRateChange);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('mbegu:exchange-rate-change', handleRateChange);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  // Sample financial data
  const baseAssetsUSD = 15850;
  const baseDebtsUSD = 2400;
  const netWorthUSD = baseAssetsUSD - baseDebtsUSD;

  const formatAmount = (usdValue) => {
    if (currency === 'USD') {
      return `$ ${usdValue.toLocaleString(numberLocale)}`;
    } else {
      const cdfValue = usdValue * exchangeRate;
      return `${cdfValue.toLocaleString(numberLocale)} FC`;
    }
  };

  return (
    <section className="bg-mesh-subtle" style={{ position: 'relative', overflow: 'hidden', paddingTop: '56px', paddingBottom: '80px', borderBottom: '1px solid #E2E8F0' }}>
      {/* Subtle Glows */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '650px',
        height: '350px',
        background: 'radial-gradient(circle, rgba(6, 182, 212, 0.12) 0%, rgba(14, 165, 233, 0.05) 50%, rgba(255, 255, 255, 0) 70%)',
        zIndex: 0,
        pointerEvents: 'none',
        filter: 'blur(40px)'
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Top Badges */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'inline-flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <span className="badge-pill">
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }}></span>
              {getTxt(siteContent?.heroBadge, t.hero.badge)}
            </span>
            <span className="badge-cyan">
              <IconWifiOff size={14} />
              {getTxt(siteContent?.heroOfflineCta, t.heroExtra?.offlineCta || '100% Hors-Ligne')}
            </span>
          </div>

          {/* Main Title */}
          <h1 style={{
            fontSize: 'clamp(2.25rem, 5vw, 3.75rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.035em',
            marginTop: '20px',
            marginBottom: '16px',
            maxWidth: '920px',
            color: '#0B192C'
          }}>
            {getTxt(siteContent?.heroTitle, t.hero.titleHighlight)} <br />
            <span className="cyan-gradient">{getTxt(siteContent?.heroSubtitle, t.hero.titleSub)}</span>
          </h1>

          {/* Description */}
          <p style={{
            fontSize: 'clamp(1rem, 1.8vw, 1.1875rem)',
            color: '#475569',
            lineHeight: 1.6,
            maxWidth: '740px',
            marginBottom: '36px'
          }}>
            {getTxt(siteContent?.heroDescription, t.hero.description)}
          </p>

          {/* Call to Actions */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', justifyContent: 'center', marginBottom: '40px' }}>
            <button onClick={onOpenPilotModal} className="btn btn-primary" style={{ padding: '14px 30px', fontSize: '1rem' }}>
              <IconSparkles size={18} />
              {getTxt(siteContent?.heroPrimaryCta, t.hero.ctaPrimary)}
            </button>
            <button onClick={onNavigateToApp} className="btn btn-cyan" style={{ padding: '14px 28px', fontSize: '1rem' }}>
              <IconSmartphone size={18} />
              {getTxt(siteContent?.heroDirectAppCta, t.heroExtra?.ctaDirectApp || "Ouvrir l'App en Direct")}
            </button>
            <a href="#simulateur" className="btn btn-secondary" style={{ padding: '14px 28px', fontSize: '1rem' }}>
              {getTxt(siteContent?.heroSecondaryCta, t.hero.ctaSecondary)}
              <IconArrowRight size={18} />
            </a>
          </div>

          {/* Key Value Prop Icons */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '24px',
            fontSize: '0.875rem',
            color: '#64748B',
            fontWeight: 600
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <IconCheckCircle2 size={16} className="text-cyan-600" style={{ color: '#06B6D4' }} />
              <span>{getTxt(siteContent?.heroStatsUsers, t.hero.statsUsers)}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <IconWifiOff size={16} style={{ color: '#06B6D4' }} />
              <span>{getTxt(siteContent?.heroStatsOffline, t.hero.statsOffline)}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <IconCoins size={16} style={{ color: '#06B6D4' }} />
              <span>{getTxt(siteContent?.heroStatsCurrency, t.hero.statsDualCurrency)}</span>
            </div>
          </div>
        </div>

        {/* Finary-Style Interactive Hero Card */}
        <div style={{
          marginTop: '36px',
          maxWidth: '1000px',
          marginLeft: 'auto',
          marginRight: 'auto',
          background: '#FFFFFF',
          borderRadius: '24px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 25px 60px -15px rgba(11, 25, 44, 0.12), 0 0 0 1px rgba(226, 232, 240, 0.8)',
          overflow: 'hidden'
        }}>
          {/* Top Bar inside Card */}
          <div style={{
            padding: '16px 24px',
            background: '#F8FAFC',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px'
          }}>
            {/* View Switchers */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setActiveTab('patrimoine')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: activeTab === 'patrimoine' ? '#0B192C' : 'transparent',
                  color: activeTab === 'patrimoine' ? '#FFFFFF' : '#64748B',
                  transition: 'all 0.2s'
                }}
              >
                {t.heroExtra?.tabNetWorth || 'Patrimoine Net'}
              </button>
              <button
                onClick={() => setActiveTab('caisse')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: activeTab === 'caisse' ? '#0B192C' : 'transparent',
                  color: activeTab === 'caisse' ? '#FFFFFF' : '#64748B',
                  transition: 'all 0.2s'
                }}
              >
                {t.heroExtra?.tabCashDesk || 'Caisse & Ventes (v0.2)'}
              </button>
            </div>

            {/* Currency Switcher & Timestamp Rate */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'none' }} className="rate-text">
                {t.heroExtra?.rateTimestamped || 'Taux horodaté :'} <strong>1 USD = {exchangeRate} CDF</strong>
              </span>
              <div style={{ display: 'flex', background: '#E2E8F0', borderRadius: '8px', padding: '2px' }}>
                <button
                  onClick={() => setCurrency('USD')}
                  style={{
                    padding: '4px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: currency === 'USD' ? '#FFFFFF' : 'transparent',
                    color: currency === 'USD' ? '#0B192C' : '#64748B',
                    boxShadow: currency === 'USD' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                  }}
                >
                  USD ($)
                </button>
                <button
                  onClick={() => setCurrency('CDF')}
                  style={{
                    padding: '4px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: currency === 'CDF' ? '#FFFFFF' : 'transparent',
                    color: currency === 'CDF' ? '#0B192C' : '#64748B',
                    boxShadow: currency === 'CDF' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                  }}
                >
                  CDF (FC)
                </button>
              </div>
            </div>
          </div>

          {/* Card Body */}
          <div style={{ padding: '32px' }}>
            {activeTab === 'patrimoine' ? (
              <div>
                {/* Net worth header */}
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px', marginBottom: '28px' }}>
                  <div>
                    <div style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                      {t.hero.dashboardPreviewTitle}
                    </div>
                    <div style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, color: '#0B192C', letterSpacing: '-0.03em' }}>
                      {formatAmount(netWorthUSD)}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px', fontSize: '0.875rem' }}>
                      <span style={{ color: '#059669', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <IconTrendingUp size={16} /> {t.heroExtra?.monthlyGrowth || '+12.4% ce mois'}
                      </span>
                      <span style={{ color: '#94A3B8' }}>•</span>
                      <span style={{ color: '#64748B', fontSize: '0.8125rem' }}>
                        {t.heroExtra?.strictCalc || 'Calcul strict : Actifs - Dettes'}
                      </span>
                    </div>
                  </div>

                  {/* Quick Metric Pills */}
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <div style={{ background: '#F8FAFC', padding: '12px 18px', borderRadius: '14px', border: '1px solid #E2E8F0', minWidth: '140px' }}>
                      <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>{t.heroExtra?.totalAssets || 'Total Actifs'}</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A' }}>{formatAmount(baseAssetsUSD)}</div>
                      <div style={{ fontSize: '0.6875rem', color: '#059669', fontWeight: 600 }}>{t.heroExtra?.assetsSub || 'Banque, M-Pesa, Cash, Stock'}</div>
                    </div>
                    <div style={{ background: '#F8FAFC', padding: '12px 18px', borderRadius: '14px', border: '1px solid #E2E8F0', minWidth: '140px' }}>
                      <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>{t.heroExtra?.totalDebts || 'Total Dettes'}</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#DC2626' }}>{formatAmount(baseDebtsUSD)}</div>
                      <div style={{ fontSize: '0.6875rem', color: '#94A3B8', fontWeight: 500 }}>{t.heroExtra?.debtsSub || 'Échéance fournisseurs'}</div>
                    </div>
                  </div>
                </div>

                {/* Account breakdown grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                  gap: '14px',
                  marginBottom: '24px'
                }}>
                  {/* Account 1: Bank */}
                  <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '16px', transition: 'all 0.2s' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#1E293B' }}>Equity BCDC</span>
                      <span style={{ fontSize: '0.6875rem', padding: '2px 6px', background: '#F1F5F9', borderRadius: '4px', color: '#475569' }}>{t.heroExtra?.bank || 'Banque'}</span>
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0B192C' }}>{formatAmount(6200)}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>{t.heroExtra?.verifiedInitial || 'Solde initial vérifié'}</div>
                  </div>

                  {/* Account 2: Vodacom M-Pesa */}
                  <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '16px', transition: 'all 0.2s' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#1E293B' }}>Vodacom M-Pesa</span>
                      <span style={{ fontSize: '0.6875rem', padding: '2px 6px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '4px', color: '#DC2626', fontWeight: 600 }}>{t.heroExtra?.mobile || 'Mobile'}</span>
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0B192C' }}>{formatAmount(1450)}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>{t.heroExtra?.collectedToday || "Encaissé aujourd'hui"}</div>
                  </div>

                  {/* Account 3: Airtel Money */}
                  <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '16px', transition: 'all 0.2s' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#1E293B' }}>Airtel Money</span>
                      <span style={{ fontSize: '0.6875rem', padding: '2px 6px', background: 'rgba(220, 38, 38, 0.1)', borderRadius: '4px', color: '#B91C1C', fontWeight: 600 }}>{t.heroExtra?.mobile || 'Mobile'}</span>
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0B192C' }}>{formatAmount(890)}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>{t.heroExtra?.synced || 'Synchronisé'}</div>
                  </div>

                  {/* Account 4: Cash */}
                  <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '16px', transition: 'all 0.2s' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#1E293B' }}>{t.heroExtra?.vaultCash || 'Espèces (Coffre)'}</span>
                      <span style={{ fontSize: '0.6875rem', padding: '2px 6px', background: '#ECFDF5', borderRadius: '4px', color: '#059669', fontWeight: 600 }}>{t.heroExtra?.cashType || 'Cash'}</span>
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0B192C' }}>{formatAmount(710)}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>{t.heroExtra?.physicalCash || 'Caisse physique'}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                {/* Merchant POS Preview (v0.2) */}
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                  <div>
                    <span className="badge-cyan" style={{ marginBottom: '8px' }}>{t.heroExtra?.posBatch || 'Caisse du Jour #284'}</span>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0B192C' }}>
                      {t.heroExtra?.posNetProfit || 'Bénéfice Net Estimé :'} <span style={{ color: '#059669' }}>{formatAmount(340)}</span>
                    </h3>
                    <p style={{ fontSize: '0.8125rem', color: '#64748B' }}>
                      {lang === 'en'
                        ? `Integrated formula: Sales (${formatAmount(720)}) - Purchases (${formatAmount(260)}) - Expenses (${formatAmount(120)})`
                        : lang === 'sw'
                        ? `Kanuni iliyojengwa: Mauzo (${formatAmount(720)}) - Manunuzi (${formatAmount(260)}) - Matumizi (${formatAmount(120)})`
                        : `Formule intégrée : Ventes (${formatAmount(720)}) - Achats (${formatAmount(260)}) - Dépenses (${formatAmount(120)})`}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <span style={{ fontSize: '0.75rem', padding: '6px 12px', background: '#F1F5F9', borderRadius: '8px', color: '#334155', fontWeight: 600 }}>
                      {lang === 'en' ? 'Cash register variance:' : lang === 'sw' ? 'Tofauti ya sanduku:' : 'Écart de caisse :'} <strong style={{ color: '#059669' }}>0.00 $ ({lang === 'en' ? 'Perfect' : lang === 'sw' ? 'Sahihi' : 'Parfait'})</strong>
                    </span>
                  </div>
                </div>

                {/* Ledger entries */}
                <div style={{ border: '1px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '12px 16px', background: '#F8FAFC', fontSize: '0.75rem', fontWeight: 700, color: '#64748B', borderBottom: '1px solid #E2E8F0' }}>
                    <span>{lang === 'en' ? 'CLIENT / OPERATION' : lang === 'sw' ? 'MTEJA / SHUGHULI' : 'CLIENT / OPÉRATION'}</span>
                    <span>{lang === 'en' ? 'TYPE' : lang === 'sw' ? 'AINA' : 'TYPE'}</span>
                    <span>{lang === 'en' ? 'AMOUNT' : lang === 'sw' ? 'KIASI' : 'MONTANT'}</span>
                    <span>{lang === 'en' ? 'STATUS / ACTION' : lang === 'sw' ? 'HALI / HATUA' : 'STATUT / ACTION'}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '14px 16px', borderBottom: '1px solid #F1F5F9', alignItems: 'center', fontSize: '0.875rem' }}>
                    <div>
                      <div style={{ fontWeight: 700, color: '#0F172A' }}>Maman Nicole (Boutique 4)</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                        {lang === 'en' ? '3 pieces Dutch Wax Fabric' : lang === 'sw' ? 'Vitenge 3 Wax Hollandais' : '3 pièces pagnes Wax Hollandais'}
                      </div>
                    </div>
                    <div><span style={{ fontSize: '0.75rem', padding: '3px 8px', borderRadius: '6px', background: '#FEF3C7', color: '#B45309', fontWeight: 700 }}>
                      {lang === 'en' ? 'Credit Sale' : lang === 'sw' ? 'Mauzo ya Mkopo' : 'Vente à Crédit'}
                    </span></div>
                    <div style={{ fontWeight: 700, color: '#0B192C' }}>{formatAmount(180)}</div>
                    <div>
                      <button style={{ padding: '4px 10px', fontSize: '0.75rem', fontWeight: 700, background: '#F0FDF4', color: '#166534', border: '1px solid #BBF7D0', borderRadius: '6px', cursor: 'pointer' }}>
                        {lang === 'en' ? 'SMS Reminder' : lang === 'sw' ? 'Kumbusho SMS' : 'Relance SMS'}
                      </button>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '14px 16px', alignItems: 'center', fontSize: '0.875rem' }}>
                    <div>
                      <div style={{ fontWeight: 700, color: '#0F172A' }}>Papa Jacques Mukendi</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                        {lang === 'en' ? 'Motorcycle parts TVS' : lang === 'sw' ? 'Vipuri vya pikipiki TVS' : 'Achat pièces moto TVS'}
                      </div>
                    </div>
                    <div><span style={{ fontSize: '0.75rem', padding: '3px 8px', borderRadius: '6px', background: '#ECFDF5', color: '#059669', fontWeight: 700 }}>M-Pesa Direct</span></div>
                    <div style={{ fontWeight: 700, color: '#059669' }}>+ {formatAmount(95)}</div>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>
                        {lang === 'en' ? 'Received' : lang === 'sw' ? 'Imepokelewa' : 'Encaissé'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom status strip */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: '20px',
              borderTop: '1px solid #F1F5F9',
              fontSize: '0.8125rem',
              color: '#64748B',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00D2B4', display: 'inline-block' }}></span>
                <span>
                  {lang === 'en' ? 'Encrypted local storage (Offline Mode active)' : lang === 'sw' ? 'Hifadhi salama ya ndani (Bila Mtandao Imewashwa)' : 'Stockage local chiffré (Mode Hors-Ligne activé)'}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span>{lang === 'en' ? 'Quick entry <10s' : lang === 'sw' ? 'Kurekodi haraka <10s' : 'Saisie rapide <10s'}</span>
                <span>{lang === 'en' ? 'PIN lock 60s' : lang === 'sw' ? 'Ulinzi wa PIN 60s' : 'Protection PIN 60s'}</span>
                <span style={{ color: '#0B192C', fontWeight: 700 }}>{lang === 'en' ? 'v0.1 Ready' : lang === 'sw' ? 'v0.1 Tayari' : 'v0.1 Prêt'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 640px) {
          .rate-text {
            display: inline !important;
          }
        }
      `}</style>
    </section>
  );
}
