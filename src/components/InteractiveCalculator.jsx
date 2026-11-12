import { useState, useMemo, useEffect } from 'react';
import { 
  IconSparkles, 
  IconAlertCircle, 
  IconCheck 
} from './Icons';
import { EXCHANGE_RATE_KEY, getGlobalExchangeRate } from '../config';

export default function InteractiveCalculator({ lang = 'fr', t }) {
  const [activeTab, setActiveTab] = useState('credit'); // 'credit' | 'savings' | 'conversion'
  const [currency, setCurrency] = useState('USD'); // 'USD' | 'CDF'

  const [exchangeRate, setExchangeRate] = useState(getGlobalExchangeRate);

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

  // Credit Simulator State
  const [loanAmountUSD, setLoanAmountUSD] = useState(1000);
  const [annualRate, setAnnualRate] = useState(12); // %
  const [durationMonths, setDurationMonths] = useState(12);

  // Savings Simulator State
  const defaultGoalName = lang === 'en'
    ? 'Shop working capital'
    : lang === 'sw'
    ? 'Mtaji wa duka'
    : 'Fonds de roulement boutique';
  const [goalName, setGoalName] = useState(null);
  const displayedGoalName = goalName ?? defaultGoalName;
  const [targetAmountUSD, setTargetAmountUSD] = useState(2400);
  const [currentSavingsUSD, setCurrentSavingsUSD] = useState(400);
  const [savingsMonths, setSavingsMonths] = useState(10);

  // Currency Converter State
  const [convertUSD, setConvertUSD] = useState(100);
  const customRate = exchangeRate;
  const numberLocale = lang === 'en' ? 'en-US' : lang === 'sw' ? 'sw-KE' : 'fr-FR';

  // Exact Credit Calculation conforming to Chapter 19
  // Formula: r = annualRate / 12 / 100
  // Monthly payment M = (C * r) / (1 - (1 + r)^(-n))
  const creditResults = useMemo(() => {
    const C = loanAmountUSD;
    const r = (annualRate / 100) / 12;
    const n = durationMonths;

    const monthlyPaymentUSD = r > 0 ? (C * r) / (1 - Math.pow(1 + r, -n)) : C / n;

    const totalCostUSD = monthlyPaymentUSD * n;
    const totalInterestUSD = totalCostUSD - C;

    return {
      monthlyPaymentUSD,
      totalCostUSD,
      totalInterestUSD,
      monthlyPaymentCDF: monthlyPaymentUSD * exchangeRate,
      totalCostCDF: totalCostUSD * exchangeRate,
      totalInterestCDF: totalInterestUSD * exchangeRate,
      principalCDF: C * exchangeRate
    };
  }, [loanAmountUSD, annualRate, durationMonths, exchangeRate]);

  // Savings Calculation
  const savingsResults = useMemo(() => {
    const remainingToSave = Math.max(0, targetAmountUSD - currentSavingsUSD);
    const monthlyNeededUSD = savingsMonths > 0 ? remainingToSave / savingsMonths : 0;
    return {
      remainingUSD: remainingToSave,
      monthlyNeededUSD,
      monthlyNeededCDF: monthlyNeededUSD * exchangeRate,
      targetCDF: targetAmountUSD * exchangeRate,
      progressPercent: Math.min(100, Math.round((currentSavingsUSD / targetAmountUSD) * 100))
    };
  }, [targetAmountUSD, currentSavingsUSD, savingsMonths, exchangeRate]);

  const formatCurrency = (usdVal, cdfVal) => {
    if (currency === 'USD') {
      return `$ ${usdVal.toLocaleString(numberLocale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `${Math.round(cdfVal).toLocaleString(numberLocale)} FC`;
  };

  return (
    <section id="simulateur" style={{ padding: '90px 0', background: '#FAFCFF', borderBottom: '1px solid #E2E8F0' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 48px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <span className="badge-cyan">
              <IconSparkles size={14} />
              {t.calculator.tag}
            </span>
          </div>
          <h2 style={{ fontSize: 'clamp(1.875rem, 3.5vw, 2.75rem)', fontWeight: 800, color: '#0B192C', letterSpacing: '-0.03em', marginBottom: '14px' }}>
            {t.calculator.title}
          </h2>
          <p style={{ fontSize: '1.0625rem', color: '#475569', lineHeight: 1.6 }}>
            {t.calculator.description}
          </p>

          {/* Currency Toggle */}
          <div style={{ display: 'inline-flex', background: '#E2E8F0', padding: '4px', borderRadius: '12px', marginTop: '20px' }}>
            <button
              onClick={() => setCurrency('USD')}
              style={{
                padding: '8px 18px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '0.875rem',
                background: currency === 'USD' ? '#0B192C' : 'transparent',
                color: currency === 'USD' ? '#FFFFFF' : '#475569',
                transition: 'all 0.2s'
              }}
            >
              {lang === 'en' ? 'Show in USD ($)' : lang === 'sw' ? 'Onyesha kwa USD ($)' : 'Afficher en USD ($)'}
            </button>
            <button
              onClick={() => setCurrency('CDF')}
              style={{
                padding: '8px 18px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '0.875rem',
                background: currency === 'CDF' ? '#0B192C' : 'transparent',
                color: currency === 'CDF' ? '#FFFFFF' : '#475569',
                transition: 'all 0.2s'
              }}
            >
              {lang === 'en' ? 'Show in Francs (CDF)' : lang === 'sw' ? 'Onyesha kwa Faranga (CDF)' : 'Afficher en Francs (CDF)'}
            </button>
          </div>
        </div>

        {/* Calculator Main Box */}
        <div style={{
          maxWidth: '960px',
          margin: '0 auto',
          background: '#FFFFFF',
          borderRadius: '24px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 20px 45px -8px rgba(11, 25, 44, 0.08)',
          overflow: 'hidden'
        }}>
          {/* Sub Navigation Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid #E2E8F0', background: '#F8FAFC' }}>
            <button
              onClick={() => setActiveTab('credit')}
              style={{
                flex: 1,
                padding: '18px 20px',
                border: 'none',
                background: activeTab === 'credit' ? '#FFFFFF' : 'transparent',
                color: activeTab === 'credit' ? '#0B192C' : '#64748B',
                fontWeight: 700,
                fontSize: '0.9375rem',
                cursor: 'pointer',
                borderBottom: activeTab === 'credit' ? '3px solid #06B6D4' : '3px solid transparent',
                transition: 'all 0.2s'
              }}
            >
              {t.calculator.tabCredit}
            </button>
            <button
              onClick={() => setActiveTab('savings')}
              style={{
                flex: 1,
                padding: '18px 20px',
                border: 'none',
                background: activeTab === 'savings' ? '#FFFFFF' : 'transparent',
                color: activeTab === 'savings' ? '#0B192C' : '#64748B',
                fontWeight: 700,
                fontSize: '0.9375rem',
                cursor: 'pointer',
                borderBottom: activeTab === 'savings' ? '3px solid #06B6D4' : '3px solid transparent',
                transition: 'all 0.2s'
              }}
            >
              {t.calculator.tabSavings}
            </button>
            <button
              onClick={() => setActiveTab('conversion')}
              style={{
                flex: 1,
                padding: '18px 20px',
                border: 'none',
                background: activeTab === 'conversion' ? '#FFFFFF' : 'transparent',
                color: activeTab === 'conversion' ? '#0B192C' : '#64748B',
                fontWeight: 700,
                fontSize: '0.9375rem',
                cursor: 'pointer',
                borderBottom: activeTab === 'conversion' ? '3px solid #06B6D4' : '3px solid transparent',
                transition: 'all 0.2s'
              }}
            >
              {t.calculator.tabConverter}
            </button>
          </div>

          <div style={{ padding: '36px' }}>
            {activeTab === 'credit' && (
              <div>
                {/* Verified Formula Highlight Banner */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: '#F0FDF4',
                  border: '1px solid #BBF7D0',
                  borderRadius: '12px',
                  padding: '12px 18px',
                  marginBottom: '28px',
                  fontSize: '0.875rem',
                  color: '#166534'
                }}>
                  <IconCheck size={18} style={{ color: '#16A34A', flexShrink: 0 }} />
                  <div>
                    <strong>{t.calculator.formulaNotice}</strong>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '36px' }}>
                  {/* Left Column: Sliders */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
                    {/* Amount Slider */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>
                          {t.calculator.amountLabel}
                        </label>
                        <span style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0B192C' }}>
                          {formatCurrency(loanAmountUSD, loanAmountUSD * exchangeRate)}
                        </span>
                      </div>
                      <input 
                        type="range" 
                        min="100" 
                        max="10000" 
                        step="50" 
                        value={loanAmountUSD}
                        onChange={(e) => setLoanAmountUSD(Number(e.target.value))}
                      />
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94A3B8', marginTop: '6px' }}>
                        <span>$100</span>
                        <span>$5 000</span>
                        <span>$10 000</span>
                      </div>
                    </div>

                    {/* Interest Rate Slider */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>
                          {t.calculator.rateLabel}
                        </label>
                        <span style={{ fontSize: '1.125rem', fontWeight: 800, color: '#06B6D4' }}>
                          {annualRate} % / an
                        </span>
                      </div>
                      <input 
                        type="range" 
                        min="2" 
                        max="30" 
                        step="0.5" 
                        value={annualRate}
                        onChange={(e) => setAnnualRate(Number(e.target.value))}
                      />
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94A3B8', marginTop: '6px' }}>
                        <span>2%</span>
                        <span>12% (Standard)</span>
                        <span>30%</span>
                      </div>
                    </div>

                    {/* Duration Slider */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>
                          {t.calculator.durationLabel}
                        </label>
                        <span style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0B192C' }}>
                          {durationMonths} {t.calculator.months}
                        </span>
                      </div>
                      <input 
                        type="range" 
                        min="3" 
                        max="48" 
                        step="1" 
                        value={durationMonths}
                        onChange={(e) => setDurationMonths(Number(e.target.value))}
                      />
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94A3B8', marginTop: '6px' }}>
                        <span>3 {t.calculator.months}</span>
                        <span>12 {t.calculator.months} ({lang === 'en' ? '1 yr' : lang === 'sw' ? 'mwaka 1' : '1 an'})</span>
                        <span>48 {t.calculator.months}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Calculated Results */}
                  <div style={{
                    background: 'linear-gradient(135deg, #0B192C 0%, #152A4A 100%)',
                    borderRadius: '18px',
                    padding: '28px',
                    color: '#FFFFFF',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#00D2B4', fontWeight: 700 }}>
                        {t.calculator.monthlyPayment}
                      </span>
                      <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#FFFFFF', marginTop: '4px', marginBottom: '8px', letterSpacing: '-0.02em' }}>
                        {formatCurrency(creditResults.monthlyPaymentUSD, creditResults.monthlyPaymentCDF)}
                        <span style={{ fontSize: '1rem', fontWeight: 500, color: '#94A3B8' }}> / {lang === 'en' ? 'month' : lang === 'sw' ? 'mwezi' : 'mois'}</span>
                      </div>
                      <div style={{ fontSize: '0.8125rem', color: '#CBD5E1' }}>
                        {lang === 'en'
                          ? `Exact calculation for $${loanAmountUSD} over ${durationMonths} months at ${annualRate}%`
                          : lang === 'sw'
                          ? `Hesabu kamili ya $${loanAmountUSD} kwa miezi ${durationMonths} kwa ${annualRate}%`
                          : `Calcul exact pour ${loanAmountUSD} $ sur ${durationMonths} mois à ${annualRate}%`}
                      </div>
                    </div>

                    {/* Breakdown */}
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: '20px', marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                        <span style={{ color: '#94A3B8' }}>{t.calculator.totalInterest}</span>
                        <span style={{ fontWeight: 700, color: '#38BDF8' }}>
                          {formatCurrency(creditResults.totalInterestUSD, creditResults.totalInterestCDF)}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                        <span style={{ color: '#94A3B8' }}>{t.calculator.totalCost}</span>
                        <span style={{ fontWeight: 800, color: '#FFFFFF' }}>
                          {formatCurrency(creditResults.totalCostUSD, creditResults.totalCostCDF)}
                        </span>
                      </div>
                    </div>

                    {/* Mandatory Disclaimer */}
                    <div style={{
                      marginTop: '24px',
                      padding: '10px 14px',
                      background: 'rgba(255, 255, 255, 0.06)',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      fontSize: '0.75rem',
                      color: '#94A3B8',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <IconAlertCircle size={14} style={{ color: '#F59E0B', flexShrink: 0 }} />
                      <span>{t.calculator.disclaimer}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'savings' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '36px' }}>
                {/* Savings inputs */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '8px' }}>
                      {t.calculator.savingsGoalName}
                    </label>
                    <input
                      type="text"
                      value={displayedGoalName}
                      onChange={(e) => setGoalName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '10px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.9375rem',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>
                        {t.calculator.savingsTarget}
                      </label>
                      <span style={{ fontWeight: 700, color: '#0B192C' }}>
                        {formatCurrency(targetAmountUSD, targetAmountUSD * exchangeRate)}
                      </span>
                    </div>
                    <input 
                      type="range" 
                      min="200" 
                      max="20000" 
                      step="100" 
                      value={targetAmountUSD}
                      onChange={(e) => setTargetAmountUSD(Number(e.target.value))}
                    />
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>
                        {lang === 'en' ? 'Savings already available' : lang === 'sw' ? 'Akiba iliyopo sasa' : 'Épargne déjà disponible'}
                      </label>
                      <span style={{ fontWeight: 700, color: '#059669' }}>
                        {formatCurrency(currentSavingsUSD, currentSavingsUSD * exchangeRate)}
                      </span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max={targetAmountUSD} 
                      step="50" 
                      value={currentSavingsUSD}
                      onChange={(e) => setCurrentSavingsUSD(Number(e.target.value))}
                    />
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>
                        {t.calculator.savingsMonths}
                      </label>
                      <span style={{ fontWeight: 700, color: '#0B192C' }}>
                        {savingsMonths} {t.calculator.months}
                      </span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="36" 
                      step="1" 
                      value={savingsMonths}
                      onChange={(e) => setSavingsMonths(Number(e.target.value))}
                    />
                  </div>
                </div>

                {/* Savings Output */}
                <div style={{
                  background: 'linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%)',
                  borderRadius: '18px',
                  padding: '28px',
                  border: '1px solid #A7F3D0',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#047857', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {t.calculator.savingsMonthlyRec}
                    </div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#065F46', marginTop: '6px', marginBottom: '10px' }}>
                      {formatCurrency(savingsResults.monthlyNeededUSD, savingsResults.monthlyNeededCDF)}
                      <span style={{ fontSize: '1rem', color: '#047857', fontWeight: 500 }}> / {lang === 'en' ? 'month' : lang === 'sw' ? 'mwezi' : 'mois'}</span>
                    </div>

                    {/* Progress indicator */}
                    <div style={{ marginTop: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', fontWeight: 600, color: '#047857', marginBottom: '6px' }}>
                        <span>{lang === 'en' ? 'Current progress' : lang === 'sw' ? 'Maendeleo ya sasa' : 'Progression actuelle'}</span>
                        <span>{savingsResults.progressPercent}%</span>
                      </div>
                      <div style={{ height: '8px', background: '#D1FAE5', borderRadius: '999px', overflow: 'hidden' }}>
                        <div style={{ width: `${savingsResults.progressPercent}%`, height: '100%', background: '#059669', borderRadius: '999px' }}></div>
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: '24px', padding: '14px', background: '#FFFFFF', borderRadius: '12px', border: '1px solid #BBF7D0' }}>
                    <div style={{ fontSize: '0.8125rem', color: '#334155' }}>
                      {lang === 'en' ? (
                        <>💡 <strong>MBEGU Tip:</strong> By depositing this sum at the beginning of each month into your dedicated Airtel Money or M-Pesa account, you will reach your goal for <strong>"{displayedGoalName}"</strong> on time.</>
                      ) : lang === 'sw' ? (
                        <>💡 <strong>Ushauri wa MBEGU:</strong> Kwa kuweka kiasi hiki mwanzoni mwa kila mwezi kwenye akaunti yako ya Airtel Money au M-Pesa, utatimiza lengo lako la <strong>"{displayedGoalName}"</strong> kwa wakati.</>
                      ) : (
                        <>💡 <strong>Conseil MBEGU :</strong> En versant automatiquement cette somme au début de chaque mois sur votre compte Airtel Money ou M-Pesa dédié, vous atteindrez votre objectif pour <strong>"{displayedGoalName}"</strong> en temps voulu.</>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'conversion' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '28px', alignItems: 'center' }}>
                <div style={{ background: '#F8FAFC', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '6px' }}>
                    {lang === 'en' ? 'AMOUNT IN DOLLARS (USD)' : lang === 'sw' ? 'KIASI KWA DOLA (USD)' : 'MONTANT EN DOLLARS (USD)'}
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0B192C' }}>$</span>
                    <input
                      type="number"
                      value={convertUSD}
                      onChange={(e) => setConvertUSD(Number(e.target.value))}
                      style={{
                        width: '100%',
                        fontSize: '1.5rem',
                        fontWeight: 800,
                        border: 'none',
                        background: 'transparent',
                        outline: 'none',
                        color: '#0B192C'
                      }}
                    />
                  </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <div style={{ display: 'inline-flex', padding: '10px 16px', borderRadius: '999px', background: '#F1F5F9', border: '1px solid #E2E8F0', fontSize: '0.8125rem', fontWeight: 700, color: '#0B192C' }}>
                    1 USD = {customRate} CDF ({lang === 'en' ? 'Timestamped' : lang === 'sw' ? 'Wakati Halisi' : 'Horodaté'})
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '6px' }}>
                    {lang === 'en' ? 'Every transaction preserves its historical rate' : lang === 'sw' ? 'Kila muamala unahifadhi kiwango chake cha kubadilisha' : 'Chaque transaction conserve son taux historique'}
                  </div>
                </div>

                <div style={{ background: '#F0FDF4', padding: '24px', borderRadius: '16px', border: '1px solid #BBF7D0' }}>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#166534', display: 'block', marginBottom: '6px' }}>
                    {lang === 'en' ? 'EQUIVALENT IN CONGOLESE FRANCS (CDF)' : lang === 'sw' ? 'SAWA NA FARANGA ZA KONGO (CDF)' : 'ÉQUIVALENT EN FRANCS CONGOLAIS (CDF)'}
                  </label>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#166534' }}>
                    {(convertUSD * customRate).toLocaleString(numberLocale)} FC
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
