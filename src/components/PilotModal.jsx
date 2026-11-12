import { useState } from 'react';
import { IconX, IconSparkles, IconCheck, IconLock } from './Icons';

export default function PilotModal({ isOpen, onClose, lang = 'fr', t }) {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    role: 'commercant',
    city: 'Kinshasa',
    currencyPref: 'CDF_USD'
  });
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone) return;

    // Save locally
    try {
      const existing = JSON.parse(localStorage.getItem('mbegu_pilot_signups') || '[]');
      existing.push({ ...formData, timestamp: new Date().toISOString() });
      localStorage.setItem('mbegu_pilot_signups', JSON.stringify(existing));
    } catch (err) {
      console.error(err);
    }

    setSubmitted(true);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(11, 25, 44, 0.65)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '540px',
        boxShadow: '0 25px 60px -15px rgba(0,0,0,0.3)',
        overflow: 'hidden',
        position: 'relative',
        animation: 'fadeIn 0.2s ease-out'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: '#F1F5F9',
            border: 'none',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#64748B'
          }}
          aria-label={lang === 'en' ? 'Close' : lang === 'sw' ? 'Funga' : 'Fermer'}
        >
          <IconX size={18} />
        </button>

        {submitted ? (
          <div style={{ padding: '48px 36px', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <IconCheck size={32} />
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0B192C', marginBottom: '12px' }}>
              {t.waitlist.successTitle}
            </h3>
            <p style={{ fontSize: '0.9375rem', color: '#475569', lineHeight: 1.6, marginBottom: '28px' }}>
              {t.waitlist.successDesc}
            </p>
            <div style={{ padding: '14px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '0.8125rem', color: '#64748B', marginBottom: '24px' }}>
              {lang === 'en' ? 'Registered number:' : lang === 'sw' ? 'Nambari iliyosajiliwa:' : 'Numéro enregistré :'} <strong>{formData.phone}</strong> ({formData.city})
            </div>
            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px' }}
            >
              {lang === 'en' ? 'Close and explore site' : lang === 'sw' ? 'Funga na uendelee' : 'Fermer et explorer le site'}
            </button>
          </div>
        ) : (
          <div style={{ padding: '36px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <span className="badge-pill">
                <IconSparkles size={14} />
                {t.waitlist.badge}
              </span>
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0B192C', marginBottom: '8px' }}>
              {t.waitlist.title}
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#64748B', lineHeight: 1.5, marginBottom: '24px' }}>
              {t.waitlist.subtitle}
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  {lang === 'en' ? 'Full name *' : lang === 'sw' ? 'Jina kamili *' : 'Nom complet *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={t.waitlist.namePlaceholder}
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.9375rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  {lang === 'en' ? 'WhatsApp Number (for pilot link) *' : lang === 'sw' ? 'Nambari ya WhatsApp (kwa kiungo cha jaribio) *' : 'Numéro WhatsApp (pour le lien du pilote) *'}
                </label>
                <input
                  type="tel"
                  required
                  placeholder={t.waitlist.phonePlaceholder}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.9375rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    {lang === 'en' ? 'Your Profile' : lang === 'sw' ? 'Wasifu Wako' : 'Votre Profil'}
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '10px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.875rem',
                      background: '#FFFFFF',
                      outline: 'none'
                    }}
                  >
                    <option value="particulier">{t.waitlist.rolePersonal}</option>
                    <option value="commercant">{t.waitlist.roleMerchant}</option>
                    <option value="pme">{t.waitlist.roleSME}</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    {lang === 'en' ? 'City of residence' : lang === 'sw' ? 'Mji unapoishi' : 'Ville de résidence'}
                  </label>
                  <input
                    type="text"
                    placeholder={t.waitlist.cityPlaceholder}
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '10px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.875rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-cyan" style={{ width: '100%', padding: '13px', marginTop: '12px' }}>
                <IconSparkles size={16} />
                {t.waitlist.submitBtn}
              </button>

              <div style={{ textAlign: 'center', fontSize: '0.75rem', color: '#94A3B8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <IconLock size={12} /> {lang === 'en' ? 'Your contact details remain strictly confidential.' : lang === 'sw' ? 'Taarifa zako zinalindwa kwa usiri mkubwa.' : 'Vos coordonnées restent strictement confidentielles.'}
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

