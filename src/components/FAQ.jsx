import React, { useState } from 'react';
import { IconChevronDown } from './Icons';

export default function FAQ({ lang = 'fr', t, siteContent }) {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = (lang === 'fr' && Array.isArray(siteContent?.faqs) && siteContent.faqs.length > 0)
    ? siteContent.faqs
    : (t?.faqList?.items || [
        {
          q: 'Puis-je continuer à utiliser MBEGU sans Internet ?',
          a: 'Oui. Votre caisse, vos ventes et vos créances restent enregistrées sur votre téléphone même lorsqu\'il n\'y a aucun réseau. Dès que la connexion revient, les données sont synchronisées discrètement et en sécurité avec votre compte.'
        },
        {
          q: 'Comment fonctionne l\'usage du CDF et du dollar USD ?',
          a: 'Vous choisissez la devise utilisée pour chaque opération. Le montant et le taux du jour sont conservés avec l\'écriture, afin que vos anciens mouvements gardent leur valeur réelle même si le taux de change change ensuite.'
        },
        {
          q: 'Le simulateur peut-il me donner une idée de mes mensualités ?',
          a: 'Oui. Indiquez simplement le montant, la durée et le taux proposés. Le simulateur vous présente une estimation claire de la mensualité et du coût total. Il reste indicatif et ne remplace pas l\'offre finale de votre établissement financier.'
        },
        {
          q: 'Puis-je transmettre mes données à ma banque ?',
          a: 'Bien sûr. Vous pouvez exporter vos informations en PDF ou CSV, puis les imprimer ou les partager avec votre banquier, votre coopérative ou votre partenaire financier. Cela facilite la présentation de vos revenus et de vos dépenses.'
        },
        {
          q: 'Qui peut consulter mes informations financières ?',
          a: 'Vos données restent liées à votre compte et ne doivent pas être accessibles à une tierce personne. Pour protéger l\'application, vous pouvez utiliser un code PIN ou la reconnaissance biométrique, disponible selon votre téléphone. Vous pouvez aussi exporter vos données ou demander la fermeture de votre compte.'
        },
        {
          q: 'Puis-je utiliser MBEGU en kiswahili ?',
          a: 'Oui. La version disponible propose le français, l\'anglais et le kiswahili. Vous pouvez passer d\'une langue à l\'autre depuis le menu principal, selon celle dans laquelle vous êtes le plus à l\'aise.'
        }
      ]);

  return (
    <section id="faq" style={{ padding: '96px 0', background: '#FAFCFF', borderBottom: '1px solid #E2E8F0', position: 'relative' }}>
      <div id="centre-daide" style={{ position: 'absolute', top: '-40px' }}></div>
      <div className="container" style={{ maxWidth: '860px' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <span className="badge-cyan" style={{ marginBottom: '12px' }}>
            {t?.faqList?.badge || (lang === 'en' ? 'Help Center & Support' : lang === 'sw' ? 'Kituo cha Msaada & Usaidizi' : "Centre d'aide & Assistance")}
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.85rem)', fontWeight: 800, color: '#0B192C', margin: 0 }}>
            {lang === 'fr' ? (siteContent?.faqTitle || t?.faq?.title || 'Questions Fréquentes & Centre d\'aide') : (t?.faqList?.title || t?.faq?.title || 'Frequently Asked Questions')}
          </h2>
        </div>
        {/* Accordion */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                style={{
                  background: '#FFFFFF',
                  border: isOpen ? '1px solid #06B6D4' : '1px solid #E2E8F0',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  transition: 'all 0.2s ease',
                  boxShadow: isOpen ? '0 8px 24px -4px rgba(6, 182, 212, 0.1)' : 'var(--shadow-sm)'
                }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  style={{
                    width: '100%',
                    padding: '22px 24px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <span style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#0B192C', paddingRight: '16px' }}>
                    {faq.q}
                  </span>
                  <div style={{
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease',
                    color: isOpen ? '#06B6D4' : '#64748B'
                  }}>
                    <IconChevronDown size={20} />
                  </div>
                </button>

                {isOpen && (
                  <div style={{ padding: '0 24px 22px', fontSize: '0.9375rem', color: '#475569', lineHeight: 1.65 }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
