import { useState } from 'react';
import { 
  IconStore, 
  IconTrendingUp, 
  IconUsers, 
  IconSend, 
  IconAlertCircle, 
  IconCheck
} from './Icons';

export default function MerchantHub({ lang = 'fr', t, onOpenPilotModal }) {
  const [remindedClients, setRemindedClients] = useState({});

  const handleRemind = (clientId) => {
    setRemindedClients(prev => ({ ...prev, [clientId]: true }));
    setTimeout(() => {
      // simulate sent feedback
    }, 2000);
  };

  const sampleClients = [
    {
      id: 1,
      name: 'Maman Sarah (Kintambo)',
      phone: '+243 81 445 2291',
      product: {
        fr: '12 Pagnes Super Wax',
        en: '12 Super Wax fabrics',
        sw: 'Vitambaa 12 vya Super Wax'
      },
      totalUSD: 420,
      paidUSD: 250,
      debtUSD: 170,
      daysOverdue: 8,
      status: 'urgent'
    },
    {
      id: 2,
      name: 'Ets Mukalayi & Fils (Marché Central)',
      phone: '+243 99 812 7700',
      product: {
        fr: 'Cartons Huile végétale',
        en: 'Cartons of cooking oil',
        sw: 'Katoni za mafuta ya kupikia'
      },
      totalUSD: 850,
      paidUSD: 600,
      debtUSD: 250,
      daysOverdue: 3,
      status: 'normal'
    },
    {
      id: 3,
      name: 'M. Justin Kalombo',
      phone: '+243 97 109 4321',
      product: {
        fr: 'Pièces détachées moto',
        en: 'Motorcycle spare parts',
        sw: 'Vipuri vya pikipiki'
      },
      totalUSD: 160,
      paidUSD: 100,
      debtUSD: 60,
      daysOverdue: 14,
      status: 'urgent'
    }
  ];

  return (
    <section id="commercants" style={{ padding: '96px 0', background: '#FFFFFF', borderBottom: '1px solid #E2E8F0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 54px' }}>
          <span className="badge-cyan" style={{ marginBottom: '14px' }}>
            <IconStore size={14} />
            {t.merchants.tag}
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 3.8vw, 2.85rem)', fontWeight: 800, color: '#0B192C', letterSpacing: '-0.03em', marginBottom: '16px' }}>
            {t.merchants.title}
          </h2>
          <p style={{ fontSize: '1.0625rem', color: '#475569', lineHeight: 1.6 }}>
            {t.merchants.description}
          </p>
        </div>

        {/* 4 Feature Pillars Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '24px',
          marginBottom: '56px'
        }}>
          {/* Pillar 1 */}
          <div className="card-finary" style={{ padding: '28px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.1)', color: '#0891B2', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
              <IconStore size={22} />
            </div>
            <h3 style={{ fontSize: '1.1875rem', fontWeight: 700, color: '#0B192C', marginBottom: '10px' }}>
              {t.merchants.feature1Title}
            </h3>
            <p style={{ fontSize: '0.9375rem', color: '#475569', lineHeight: 1.5 }}>
              {t.merchants.feature1Desc}
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="card-finary" style={{ padding: '28px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
              <IconUsers size={22} />
            </div>
            <h3 style={{ fontSize: '1.1875rem', fontWeight: 700, color: '#0B192C', marginBottom: '10px' }}>
              {t.merchants.feature2Title}
            </h3>
            <p style={{ fontSize: '0.9375rem', color: '#475569', lineHeight: 1.5 }}>
              {t.merchants.feature2Desc}
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="card-finary" style={{ padding: '28px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(2, 132, 199, 0.1)', color: '#0284C7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
              <IconTrendingUp size={22} />
            </div>
            <h3 style={{ fontSize: '1.1875rem', fontWeight: 700, color: '#0B192C', marginBottom: '10px' }}>
              {t.merchants.feature3Title}
            </h3>
            <p style={{ fontSize: '0.9375rem', color: '#475569', lineHeight: 1.5 }}>
              {t.merchants.feature3Desc}
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="card-finary" style={{ padding: '28px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.1)', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
              <IconAlertCircle size={22} />
            </div>
            <h3 style={{ fontSize: '1.1875rem', fontWeight: 700, color: '#0B192C', marginBottom: '10px' }}>
              {t.merchants.feature4Title}
            </h3>
            <p style={{ fontSize: '0.9375rem', color: '#475569', lineHeight: 1.5 }}>
              {t.merchants.feature4Desc}
            </p>
          </div>
        </div>

        {/* Live Interactive Merchant Ledger Simulator */}
        <div style={{
          background: '#F8FAFC',
          borderRadius: '24px',
          border: '1px solid #E2E8F0',
          padding: '36px',
          boxShadow: '0 10px 30px -5px rgba(0,0,0,0.04)'
        }}>
          {/* Subheader */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
            <div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0891B2', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {lang === 'en' ? 'Live Showcase' : lang === 'sw' ? 'Onyesho la Moja kwa Moja' : 'Démonstrateur En Direct'}
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0B192C' }}>
                {lang === 'en' ? 'Debt Ledger & Instant Reminder' : lang === 'sw' ? 'Daftari la Madeni & Kikumbusho cha Papo Hapo' : 'Registre des Créances & Relance Instantanée'}
              </h3>
            </div>

            {/* Total Debt Outstanding */}
            <div style={{ background: '#FFFFFF', padding: '10px 20px', borderRadius: '12px', border: '1px solid #CBD5E1', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 600 }}>
                {lang === 'en' ? 'Total to Recover:' : lang === 'sw' ? 'Jumla ya Kukusanya:' : 'Total à Récupérer :'}
              </span>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#DC2626' }}>$ 480 USD</span>
              <span style={{ fontSize: '0.75rem', color: '#64748B' }}>(1 344 000 FC)</span>
            </div>
          </div>

          {/* Interactive Table */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            overflow: 'hidden'
          }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
                <thead>
                  <tr style={{ background: '#F1F5F9', borderBottom: '1px solid #E2E8F0', fontSize: '0.75rem', fontWeight: 800, color: '#475569', letterSpacing: '0.04em' }}>
                    <th style={{ padding: '14px 20px' }}>{lang === 'en' ? 'CLIENT / CONTACT' : lang === 'sw' ? 'MTEJA / MAWASILIANO' : 'CLIENT / COORDONNÉES'}</th>
                    <th style={{ padding: '14px 20px' }}>{lang === 'en' ? 'ITEM / PURCHASE' : lang === 'sw' ? 'BIDHAA / MANUNUZI' : 'ARTICLE / ACHAT'}</th>
                    <th style={{ padding: '14px 20px' }}>TOTAL</th>
                    <th style={{ padding: '14px 20px' }}>{lang === 'en' ? 'PAID DEPOSIT' : lang === 'sw' ? 'KILICHOLIPWA' : 'ACOMPTE PAYÉ'}</th>
                    <th style={{ padding: '14px 20px' }}>{lang === 'en' ? 'BALANCE DUE' : lang === 'sw' ? 'INAYOBAKI' : 'RESTE DÛ'}</th>
                    <th style={{ padding: '14px 20px', textAlign: 'center' }}>{lang === 'en' ? 'CLIENT REMINDER' : lang === 'sw' ? 'KUMBUSHA MTEJA' : 'RELANCE CLIENT'}</th>
                  </tr>
                </thead>
                <tbody>
                  {sampleClients.map((client) => {
                    const isReminded = remindedClients[client.id];
                    return (
                      <tr key={client.id} style={{ borderBottom: '1px solid #F1F5F9', fontSize: '0.875rem' }}>
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ fontWeight: 700, color: '#0F172A' }}>{client.name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{client.phone}</div>
                        </td>
                        <td style={{ padding: '16px 20px', color: '#334155' }}>
                          {client.product[lang] || client.product.fr}
                        </td>
                        <td style={{ padding: '16px 20px', fontWeight: 600, color: '#0F172A' }}>
                          ${client.totalUSD}
                        </td>
                        <td style={{ padding: '16px 20px', color: '#059669', fontWeight: 600 }}>
                          ${client.paidUSD}
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ fontWeight: 800, color: '#DC2626' }}>${client.debtUSD}</div>
                          <div style={{ fontSize: '0.6875rem', color: '#94A3B8' }}>
                            {client.daysOverdue} {lang === 'en' ? 'days overdue' : lang === 'sw' ? 'siku zimepita' : 'j de retard'}
                          </div>
                        </td>
                        <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                          {isReminded ? (
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '6px 14px',
                              borderRadius: '8px',
                              background: '#ECFDF5',
                              color: '#059669',
                              fontSize: '0.75rem',
                              fontWeight: 700
                            }}>
                              <IconCheck size={14} /> {lang === 'en' ? 'WhatsApp reminder sent!' : lang === 'sw' ? 'Ujumbe wa WhatsApp umetumwa!' : 'Relance WhatsApp envoyée !'}
                            </span>
                          ) : (
                            <button
                              onClick={() => handleRemind(client.id)}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '8px 16px',
                                borderRadius: '8px',
                                border: '1px solid #06B6D4',
                                background: '#F0FDFA',
                                color: '#0891B2',
                                fontWeight: 700,
                                fontSize: '0.8125rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                              title={lang === 'en' ? 'Send a polite automatic reminder via WhatsApp' : lang === 'sw' ? 'Tuma ukumbusho wa heshima kwenye WhatsApp' : 'Envoyer un rappel poli et automatique sur WhatsApp'}
                            >
                              <IconSend size={14} />
                              {lang === 'en' ? '1-click remind' : lang === 'sw' ? 'Kumbusha mara 1' : 'Relancer en 1 clic'}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Bottom summary note */}
            <div style={{ padding: '16px 24px', background: '#F8FAFC', borderTop: '1px solid #E2E8F0', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8125rem', color: '#64748B' }}>
              <span>
                {lang === 'en'
                  ? <>🚀 With this module, pilot merchants recover on average <strong>35% of unpaid customer debts</strong> during their first week.</>
                  : lang === 'sw'
                  ? <>🚀 Kupitia moduli hii, wafanyabiashara wa jaribio wanakusanya wastani wa <strong>35% ya madeni yaliyosubiri</strong> ndani ya wiki ya kwanza.</>
                  : <>🚀 Grâce à ce module, les commerçants pilotes récupèrent en moyenne <strong>35% de leurs créances impayées</strong> dès la 1ère semaine.</>}
              </span>
              <button onClick={onOpenPilotModal} style={{ background: 'none', border: 'none', color: '#0284C7', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}>
                {lang === 'en' ? 'Try in your shop →' : lang === 'sw' ? 'Jaribu kwenye duka lako →' : 'Tester dans votre boutique →'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
