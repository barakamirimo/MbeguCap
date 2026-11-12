import React, { useState } from 'react';
import { IconX, IconSparkles, IconCheck, IconShield, IconLock, IconSmartphone, IconMail } from './Icons';
import { ACCOUNT_APP_URL } from '../config';

export default function AuthModal({ isOpen, onClose, t, initialMode = 'login', onAuthSuccess, onNavigateToAdmin }) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'signup'
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [formError, setFormError] = useState(null);

  // Login form state
  const [loginData, setLoginData] = useState({
    identifier: '',
    password: '',
    rememberMe: true
  });

  // Signup form state
  const [signupData, setSignupData] = useState({
    fullName: '',
    phone: '',
    email: '',
    profile: 'commercant',
    pin: '',
    currency: 'USD'
  });

  if (!isOpen) return null;

  // 1-Click Demo Login handler
  const handleDemoLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const demoUser = {
        name: 'Serge Mukendi (Commerçant)',
        fullName: 'Serge Mukendi',
        identifier: '+243 81 999 8888',
        phone: '+243 81 999 8888',
        email: 'serge.mukendi@mbegu.cd',
        profile: 'commercant',
        currency: 'USD',
        pin: '1234',
        loggedInAt: new Date().toISOString()
      };
      try {
        localStorage.setItem('mbegu_user_session', JSON.stringify(demoUser));
      } catch (err) {
        console.error(err);
      }
      setSuccessMessage('Connexion au compte Démo réussie !');
      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
        onAuthSuccess?.(demoUser);
      }, 500);
    }, 300);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!loginData.identifier || !loginData.password) return;
    setFormError(null);

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      let accounts = [];
      try {
        accounts = JSON.parse(localStorage.getItem('mbegu_accounts') || '[]');
      } catch {
        accounts = [];
      }
      let account = accounts.find((item) =>
        item.phone === loginData.identifier ||
        item.email === loginData.identifier ||
        item.identifier === loginData.identifier
      );

      // Check PIN if account exists
      if (account && account.pin && account.pin !== loginData.password) {
        setFormError('Le code PIN saisi est incorrect. (PIN par défaut pour test : 1234)');
        return;
      }

      // If account doesn't exist, auto-create seamlessly so user is never blocked
      if (!account) {
        account = {
          fullName: loginData.identifier.includes('@') ? loginData.identifier.split('@')[0] : 'Membre ' + (loginData.identifier.slice(-4) || 'VIP'),
          identifier: loginData.identifier,
          phone: loginData.identifier.startsWith('+') ? loginData.identifier : '+243 81 000 0000',
          profile: 'commercant',
          currency: 'USD',
          pin: loginData.password
        };
        accounts.push(account);
        try {
          localStorage.setItem('mbegu_accounts', JSON.stringify(accounts));
        } catch (err) {
          console.error(err);
        }
      }

      const user = {
        name: account?.fullName || account?.name || 'Membre MBEGU',
        fullName: account?.fullName || account?.name || 'Membre MBEGU',
        identifier: loginData.identifier,
        phone: account?.phone || loginData.identifier,
        profile: account?.profile || 'commercant',
        currency: account?.currency || 'USD',
        pin: account?.pin || loginData.password,
        loggedInAt: new Date().toISOString()
      };
      try {
        localStorage.setItem('mbegu_user_session', JSON.stringify(user));
      } catch (err) {
        console.error(err);
      }
      setSuccessMessage(t.auth?.loginSuccess || 'Connexion réussie !');
      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
        onAuthSuccess?.(user);
      }, 600);
    }, 500);
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    if (!signupData.fullName || !signupData.phone) return;
    if (!/^\d{4}$/.test(signupData.pin)) {
      setFormError('Choisissez un code PIN de 4 chiffres (ex: 1234).');
      return;
    }
    setFormError(null);

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const user = {
        name: signupData.fullName,
        fullName: signupData.fullName,
        phone: signupData.phone,
        email: signupData.email,
        profile: signupData.profile,
        currency: signupData.currency,
        pin: signupData.pin,
        loggedInAt: new Date().toISOString()
      };
      try {
        const accounts = JSON.parse(localStorage.getItem('mbegu_accounts') || '[]');
        const account = {
          ...user,
          identifier: signupData.email || signupData.phone
        };
        const existingIndex = accounts.findIndex((item) =>
          item.phone === signupData.phone || (signupData.email && item.email === signupData.email)
        );
        if (existingIndex >= 0) accounts[existingIndex] = account;
        else accounts.push(account);
        localStorage.setItem('mbegu_accounts', JSON.stringify(accounts));
        localStorage.setItem('mbegu_user_session', JSON.stringify(account));

        // Also register in pilot list
        const pilots = JSON.parse(localStorage.getItem('mbegu_pilot_signups') || '[]');
        pilots.push(user);
        localStorage.setItem('mbegu_pilot_signups', JSON.stringify(pilots));
      } catch (err) {
        console.error(err);
      }
      setSuccessMessage(t.auth?.signupSuccess || 'Compte créé avec succès !');
      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
        onAuthSuccess?.(user);
      }, 700);
    }, 600);
  };

  const handleGoogleAuth = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const user = {
        name: 'Membre Google',
        fullName: 'Membre Google',
        email: 'utilisateur@gmail.com',
        identifier: 'utilisateur@gmail.com',
        profile: 'particulier',
        currency: 'USD',
        pin: '1234',
        loggedInAt: new Date().toISOString()
      };
      try {
        localStorage.setItem('mbegu_user_session', JSON.stringify(user));
      } catch (err) {
        console.error(err);
      }
      setSuccessMessage('Connexion Google réussie !');
      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
        onAuthSuccess?.(user);
      }, 600);
    }, 500);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(11, 25, 44, 0.72)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1100,
      padding: '20px'
    }}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '500px',
        maxHeight: '92vh',
        overflowY: 'auto',
        boxShadow: '0 25px 60px -15px rgba(0,0,0,0.3)',
        position: 'relative',
        animation: 'fadeIn 0.25s ease-out'
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
            color: '#64748B',
            zIndex: 10
          }}
          aria-label="Fermer"
        >
          <IconX size={18} />
        </button>

        {successMessage ? (
          <div style={{ padding: '56px 36px', textAlign: 'center' }}>
            <div style={{ width: '68px', height: '68px', borderRadius: '50%', background: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <IconCheck size={36} />
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0B192C', marginBottom: '8px' }}>
              {successMessage}
            </h3>
            <p style={{ fontSize: '0.9375rem', color: '#64748B' }}>
              Chargement de votre session MBEGU Capital sécurisée...
            </p>
          </div>
        ) : (
          <div style={{ padding: '36px' }}>
            {/* Logo & Header */}
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', overflow: 'hidden' }}>
                  <img src="/logo.jpg" alt="MBEGU Capital" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0B192C' }}>
                  MBEGU <span style={{ color: '#06B6D4' }}>Capital</span>
                </span>
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0B192C', letterSpacing: '-0.02em', marginBottom: '6px' }}>
                {mode === 'login' ? t.auth?.loginTitle : t.auth?.signupTitle}
              </h2>
              <p style={{ fontSize: '0.875rem', color: '#64748B' }}>
                {mode === 'login' ? t.auth?.loginSubtitle : t.auth?.signupSubtitle}
              </p>
            </div>

            {/* Mode Switcher Tabs */}
            <div style={{ display: 'flex', background: '#F1F5F9', padding: '4px', borderRadius: '12px', marginBottom: '24px' }}>
              <button
                type="button"
                onClick={() => setMode('login')}
                style={{
                  flex: 1,
                  padding: '9px 0',
                  borderRadius: '9px',
                  border: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: mode === 'login' ? '#FFFFFF' : 'transparent',
                  color: mode === 'login' ? '#0B192C' : '#64748B',
                  boxShadow: mode === 'login' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                {t.auth?.tabLogin}
              </button>
              <button
                type="button"
                onClick={() => setMode('signup')}
                style={{
                  flex: 1,
                  padding: '9px 0',
                  borderRadius: '9px',
                  border: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: mode === 'signup' ? '#FFFFFF' : 'transparent',
                  color: mode === 'signup' ? '#0B192C' : '#64748B',
                  boxShadow: mode === 'signup' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                {t.auth?.tabSignup}
              </button>
            </div>

            {/* 1-Click Instant Demo Access */}
            <div style={{ marginBottom: '16px' }}>
              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '1.5px solid #06B6D4',
                  background: 'linear-gradient(135deg, #ECFEFF 0%, #CFFAFE 100%)',
                  color: '#0891B2',
                  fontSize: '0.875rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 2px 8px rgba(6, 182, 212, 0.15)',
                  transition: 'all 0.2s'
                }}
              >
                <IconSparkles size={16} />
                <span>Tester le Compte Démo Dynamique (1 clic)</span>
              </button>
            </div>

            {/* Google Social Login */}
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={loading}
              style={{
                width: '100%',
                padding: '11px',
                borderRadius: '10px',
                border: '1px solid #CBD5E1',
                background: '#FFFFFF',
                color: '#1E293B',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                marginBottom: '20px',
                transition: 'background 0.2s'
              }}
            >
              {/* Google SVG G */}
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z" />
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.94H1.27v3.15C3.25 21.35 7.31 24 12 24z" />
                <path fill="#FBBC05" d="M5.28 14.26c-.25-.72-.38-1.49-.38-2.26s.13-1.54.38-2.26V6.59H1.27C.46 8.21 0 10.05 0 12s.46 3.79 1.27 5.41l4.01-3.15z" />
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.65 1.27 6.59l4.01 3.15c.95-2.84 3.6-4.99 6.72-4.99z" />
              </svg>
              <span>{t.auth?.googleAuth}</span>
            </button>

            {/* Separator */}
            <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', gap: '12px' }}>
              <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }}></div>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase' }}>
                {t.auth?.orSocial}
              </span>
              <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }}></div>
            </div>

            {/* Forms */}
            {formError && (
              <div
                role="alert"
                style={{
                  marginBottom: '14px',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  background: '#FEF2F2',
                  border: '1px solid #FECACA',
                  color: '#B91C1C',
                  fontSize: '0.8125rem'
                }}
              >
                {formError}
              </div>
            )}
            {mode === 'login' ? (
              <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    {t.auth?.identifierLabel} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={t.auth?.identifierPlaceholder}
                    value={loginData.identifier}
                    onChange={(e) => setLoginData({ ...loginData, identifier: e.target.value })}
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

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#334155' }}>
                      {t.auth?.passwordLabel} *
                    </label>
                    <a href="#contact" onClick={onClose} style={{ fontSize: '0.75rem', color: '#0891B2', textDecoration: 'none', fontWeight: 600 }}>
                      {t.auth?.forgotPassword}
                    </a>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder={t.auth?.passwordPlaceholder}
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        borderRadius: '10px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.875rem',
                        outline: 'none'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: '#64748B',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      {showPassword ? 'Masquer' : 'Afficher'}
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: '#64748B' }}>
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={loginData.rememberMe}
                    onChange={(e) => setLoginData({ ...loginData, rememberMe: e.target.checked })}
                    style={{ cursor: 'pointer' }}
                  />
                  <label htmlFor="rememberMe" style={{ cursor: 'pointer' }}>
                    {t.auth?.rememberMe}
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '13px', marginTop: '6px' }}
                >
                  {loading ? 'Connexion en cours...' : t.auth?.btnLoginSubmit}
                </button>

                <div style={{ textAlign: 'center', fontSize: '0.8125rem', color: '#64748B', marginTop: '12px' }}>
                  {t.auth?.noAccount}{' '}
                  <button
                    type="button"
                    onClick={() => setMode('signup')}
                    style={{ background: 'none', border: 'none', color: '#0891B2', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    {t.auth?.tabSignup}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSignupSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    {t.auth?.fullNameLabel} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={t.auth?.fullNamePlaceholder}
                    value={signupData.fullName}
                    onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
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
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    {t.auth?.phoneLabel} *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+243 81 000 0000"
                    value={signupData.phone}
                    onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
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

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                      {t.auth?.profileLabel}
                    </label>
                    <select
                      value={signupData.profile}
                      onChange={(e) => setSignupData({ ...signupData, profile: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.8125rem',
                        background: '#FFFFFF',
                        outline: 'none'
                      }}
                    >
                      <option value="particulier">{t.auth?.profilePersonal}</option>
                      <option value="commercant">{t.auth?.profileMerchant}</option>
                      <option value="pme">{t.auth?.profileSME}</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                      Code PIN à 4 chiffres *
                    </label>
                    <input
                      type="password"
                      maxLength="4"
                      inputMode="numeric"
                      pattern="[0-9]{4}"
                      required
                      placeholder="ex: 1234"
                      value={signupData.pin}
                      onChange={(e) => setSignupData({ ...signupData, pin: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.875rem',
                        outline: 'none',
                        letterSpacing: '3px',
                        textAlign: 'center'
                      }}
                    />
                  </div>
                </div>

                <div style={{ background: '#F0FDF4', padding: '10px 14px', borderRadius: '8px', border: '1px solid #BBF7D0', fontSize: '0.75rem', color: '#166534' }}>
                  {t.auth?.pinSecurityNotice}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-cyan"
                  style={{ width: '100%', padding: '13px', marginTop: '4px' }}
                >
                  <IconSparkles size={16} />
                  {loading ? 'Création du compte...' : t.auth?.btnSignupSubmit}
                </button>

                <div style={{ textAlign: 'center', fontSize: '0.8125rem', color: '#64748B', marginTop: '10px' }}>
                  {t.auth?.alreadyAccount}{' '}
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    style={{ background: 'none', border: 'none', color: '#0891B2', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    {t.auth?.tabLogin}
                  </button>
                </div>
              </form>
            )}

            {/* Terms notice */}
            <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.6875rem', color: '#94A3B8', lineHeight: 1.5 }}>
              {t.auth?.termsAgreement}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
