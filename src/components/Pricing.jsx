import { useState } from 'react';
import { IconCheck, IconSparkles } from './Icons';

export default function Pricing({ lang = 'fr', t, onOpenPilotModal, onNavigateToApp }) {
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'yearly'

  return (
    <section id="tarifs" style={{ padding: '96px 0', background: '#FAFCFF', borderBottom: '1px solid #E2E8F0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 48px' }}>
          <span className="badge-cyan" style={{ marginBottom: '14px' }}>
            <IconSparkles size={14} />
            {t.pricing.tag}
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 3.8vw, 2.85rem)', fontWeight: 800, color: '#0B192C', letterSpacing: '-0.03em', marginBottom: '16px' }}>
            {t.pricing.title}
          </h2>
          <p style={{ fontSize: '1.0625rem', color: '#475569', lineHeight: 1.6 }}>
            {t.pricing.subtitle}
          </p>

          {/* Billing cycle switch */}
          <div style={{ display: 'inline-flex', background: '#E2E8F0', padding: '4px', borderRadius: '12px', marginTop: '24px' }}>
            <button
              onClick={() => setBillingCycle('monthly')}
              style={{
                padding: '8px 18px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '0.875rem',
                background: billingCycle === 'monthly' ? '#0B192C' : 'transparent',
                color: billingCycle === 'monthly' ? '#FFFFFF' : '#475569',
                transition: 'all 0.2s'
              }}
            >
              {lang === 'en' ? 'Monthly' : lang === 'sw' ? 'Kila Mwezi' : 'Mensuel'}
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              style={{
                padding: '8px 18px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '0.875rem',
                background: billingCycle === 'yearly' ? '#0B192C' : 'transparent',
                color: billingCycle === 'yearly' ? '#FFFFFF' : '#475569',
                transition: 'all 0.2s'
              }}
            >
              {lang === 'en' ? 'Yearly' : lang === 'sw' ? 'Kila Mwaka' : 'Annuel'} <span style={{ color: '#00D2B4', fontSize: '0.75rem', marginLeft: '4px' }}>(-20%)</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
          gap: '28px',
          alignItems: 'stretch'
        }}>
          {/* Plan 1: Free */}
          <div className="card-finary" style={{ padding: '36px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '1.1875rem', fontWeight: 800, color: '#0B192C', marginBottom: '6px' }}>
                {t.pricing.freePlan}
              </div>
              <p style={{ fontSize: '0.875rem', color: '#64748B', minHeight: '40px' }}>
                {lang === 'en'
                  ? 'Perfect for individuals looking to track money and simulate credits.'
                  : lang === 'sw'
                  ? 'Bora kwa watu binafsi wanaotaka kufuatilia pesa zao na kukadiria mikopo.'
                  : 'Parfait pour les particuliers qui veulent suivre leur argent et simuler leurs crédits.'}
              </p>

              <div style={{ margin: '24px 0 28px' }}>
                <span style={{ fontSize: '2.75rem', fontWeight: 800, color: '#0B192C' }}>{t.pricing.freePrice}</span>
                <span style={{ fontSize: '0.875rem', color: '#64748B', marginLeft: '6px' }}>{t.pricing.freePeriod}</span>
              </div>

              <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '20px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0B192C', textTransform: 'uppercase', marginBottom: '14px' }}>
                  {lang === 'en' ? "What's included:" : lang === 'sw' ? 'Yaliyomo:' : 'Ce qui est inclus :'}
                </div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.875rem', color: '#334155' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><IconCheck size={16} style={{ color: '#059669' }} /> {lang === 'en' ? 'Unlimited accounts (Cash, Mobile, Bank)' : lang === 'sw' ? 'Akaunti zisizo na kikomo (Pesa taslimu, Simu, Benki)' : 'Comptes illimités (Cash, Mobile, Banque)'}</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><IconCheck size={16} style={{ color: '#059669' }} /> {lang === 'en' ? '100% offline mode with sync' : lang === 'sw' ? '100% bila mtandao pamoja na usawazishaji' : 'Mode 100% hors-ligne avec synchro'}</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><IconCheck size={16} style={{ color: '#059669' }} /> {lang === 'en' ? 'CDF & USD entries with timestamped rates' : lang === 'sw' ? 'Kurekodi kwa CDF na USD kwa wakati halisi' : 'Saisie en CDF et USD avec taux horodaté'}</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><IconCheck size={16} style={{ color: '#059669' }} /> {lang === 'en' ? 'Credit simulator & savings target calculator' : lang === 'sw' ? 'Kikokotoo cha mikopo na malengo ya akiba' : "Simulateur de crédit & calcul d'épargne"}</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><IconCheck size={16} style={{ color: '#059669' }} /> {lang === 'en' ? 'PIN and Biometric protection' : lang === 'sw' ? 'Ulinzi wa PIN na Biometria' : 'Protection PIN et Biométrie'}</li>
                </ul>
              </div>
            </div>

            <button 
              type="button"
              onClick={onNavigateToApp || onOpenPilotModal} 
              className="btn btn-secondary" 
              style={{ width: '100%', marginTop: '32px', textAlign: 'center', cursor: 'pointer' }}
            >
              {t.pricing.btnGetStarted}
            </button>
          </div>

          {/* Plan 2: Pro Merchant (Highlighted) */}
          <div className="card-finary card-featured" style={{ padding: '36px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '16px', right: '20px' }}>
              <span className="badge-cyan" style={{ background: '#06B6D4', color: '#FFFFFF', border: 'none' }}>
                {lang === 'en' ? 'Popular • Merchants' : lang === 'sw' ? 'Maarufu • Wafanyabiashara' : 'Populaire • Commerçants'}
              </span>
            </div>

            <div>
              <div style={{ fontSize: '1.1875rem', fontWeight: 800, color: '#0B192C', marginBottom: '6px' }}>
                {t.pricing.proPlan}
              </div>
              <p style={{ fontSize: '0.875rem', color: '#64748B', minHeight: '40px' }}>
                {lang === 'en'
                  ? 'For retail shop owners, kiosks, and traders looking to secure daily cash.'
                  : lang === 'sw'
                  ? 'Kwa wenye maduka, vibanda na wafanyabiashara wanaotaka kulinda sanduku lao.'
                  : 'Pour les gérants de boutiques, kiosques et marchands souhaitant sécuriser leur caisse.'}
              </p>

              <div style={{ margin: '24px 0 28px' }}>
                <span style={{ fontSize: '2.75rem', fontWeight: 800, color: '#0B192C' }}>
                  {billingCycle === 'yearly' ? (lang === 'fr' ? '$3,99' : '$3.99') : t.pricing.proPrice}
                </span>
                <span style={{ fontSize: '0.875rem', color: '#64748B', marginLeft: '6px' }}>{t.pricing.proPeriod}</span>
              </div>

              <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '20px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0891B2', textTransform: 'uppercase', marginBottom: '14px' }}>
                  {lang === 'en' ? 'All Free features, plus:' : lang === 'sw' ? 'Yote ya Mpango wa Bure, pamoja na:' : 'Tout le plan Gratuit, plus :'}
                </div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.875rem', color: '#1E293B' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><IconCheck size={16} style={{ color: '#0891B2' }} /> <strong>{lang === 'en' ? 'Cash register ledger & variance reconciliation' : lang === 'sw' ? 'Daftari la sanduku na hesabu ya tofauti' : 'Journal de caisse & calcul des écarts'}</strong></li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><IconCheck size={16} style={{ color: '#0891B2' }} /> <strong>{lang === 'en' ? 'Credit sales & customer reminders' : lang === 'sw' ? 'Mauzo ya mkopo na ukumbusho wa wateja' : 'Ventes à crédit & relances clients'}</strong></li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><IconCheck size={16} style={{ color: '#0891B2' }} /> {lang === 'en' ? 'Daily net profit calculation' : lang === 'sw' ? 'Hesabu ya faida halisi ya siku' : 'Calcul du bénéfice net journalier'}</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><IconCheck size={16} style={{ color: '#0891B2' }} /> {lang === 'en' ? 'Budget alerts at 80% and 100%' : lang === 'sw' ? 'Ilani ya bajeti kwa 80% na 100%' : 'Alertes budget à 80% et 100%'}</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><IconCheck size={16} style={{ color: '#0891B2' }} /> {lang === 'en' ? 'PDF & CSV export for banks' : lang === 'sw' ? 'Ripoti za PDF na CSV kwa ajili ya benki' : 'Export PDF & CSV pour les banques'}</li>
                </ul>
              </div>
            </div>

            <button onClick={onOpenPilotModal} className="btn btn-cyan" style={{ width: '100%', marginTop: '32px' }}>
              {t.pricing.btnStartPilot}
            </button>
          </div>

          {/* Plan 3: Enterprise PME */}
          <div className="card-finary" style={{ padding: '36px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '1.1875rem', fontWeight: 800, color: '#0B192C', marginBottom: '6px' }}>
                {t.pricing.enterprisePlan}
              </div>
              <p style={{ fontSize: '0.875rem', color: '#64748B', minHeight: '40px' }}>
                {lang === 'en'
                  ? 'For businesses with multiple outlets or several staff members.'
                  : lang === 'sw'
                  ? 'Kwa biashara zenye maduka au matawi kadhaa na wafanyakazi wengi.'
                  : 'Pour les entreprises ayant plusieurs points de vente ou plusieurs collaborateurs.'}
              </p>

              <div style={{ margin: '24px 0 28px' }}>
                <span style={{ fontSize: '2.75rem', fontWeight: 800, color: '#0B192C' }}>
                  {billingCycle === 'yearly' ? (lang === 'fr' ? '$11,99' : '$11.99') : t.pricing.enterprisePrice}
                </span>
                <span style={{ fontSize: '0.875rem', color: '#64748B', marginLeft: '6px' }}>{t.pricing.enterprisePeriod}</span>
              </div>

              <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '20px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0B192C', textTransform: 'uppercase', marginBottom: '14px' }}>
                  {lang === 'en' ? 'All Pro features, plus:' : lang === 'sw' ? 'Yote ya Mpango wa Pro, pamoja na:' : 'Tout le plan Pro, plus :'}
                </div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.875rem', color: '#334155' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><IconCheck size={16} style={{ color: '#059669' }} /> {lang === 'en' ? 'Multi-user roles (Cashier / Manager permissions)' : lang === 'sw' ? 'Watumiaji wengi (Mweka hazina / Meneja)' : 'Multi-utilisateurs (Droits Caissier/Gérant)'}</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><IconCheck size={16} style={{ color: '#059669' }} /> {lang === 'en' ? 'Multi-store & inventory tracking' : lang === 'sw' ? 'Maduka mengi na hesabu ya bidhaa' : 'Multi-boutiques & inventaire de stock'}</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><IconCheck size={16} style={{ color: '#059669' }} /> {lang === 'en' ? 'Dedicated web admin dashboard' : lang === 'sw' ? 'Dashibodi maalum ya usimamizi mtandaoni' : "Tableau d'administration web dédié"}</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><IconCheck size={16} style={{ color: '#059669' }} /> {lang === 'en' ? 'Priority phone & WhatsApp support' : lang === 'sw' ? 'Msaada wa kipaumbele kwa simu na WhatsApp' : 'Support téléphonique & WhatsApp prioritaire'}</li>
                </ul>
              </div>
            </div>

            <button onClick={onOpenPilotModal} className="btn btn-secondary" style={{ width: '100%', marginTop: '32px' }}>
              {lang === 'en' ? 'Contact Team' : lang === 'sw' ? 'Wasiliana na Timu' : "Contacter l'équipe"}
            </button>
          </div>
        </div>

        {/* Mobile Money Payment Strip */}
        <div style={{
          marginTop: '44px',
          padding: '20px 28px',
          background: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0F172A' }}>
              {lang === 'en'
                ? 'Local mobile money accepted without credit card:'
                : lang === 'sw'
                ? 'Malipo ya ndani yanakubaliwa bila kadi ya benki:'
                : 'Paiements locaux acceptés sans carte de crédit :'}
            </span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, padding: '6px 14px', borderRadius: '8px', background: '#FEE2E2', color: '#991B1B' }}>Vodacom M-Pesa</span>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, padding: '6px 14px', borderRadius: '8px', background: '#FEE2E2', color: '#B91C1C' }}>Airtel Money</span>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, padding: '6px 14px', borderRadius: '8px', background: '#FFEDD5', color: '#C2410C' }}>Orange Money</span>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, padding: '6px 14px', borderRadius: '8px', background: '#E0F2FE', color: '#0369A1' }}>{lang === 'en' ? 'Visa / Mastercard Cards' : lang === 'sw' ? 'Kadi za Visa / Mastercard' : 'Cartes Visa / Mastercard'}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
