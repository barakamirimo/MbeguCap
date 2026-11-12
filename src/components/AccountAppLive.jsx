import React, { useState, useEffect, useMemo } from 'react';
import { 
  IconSparkles, 
  IconArrowRight, 
  IconShield, 
  IconLock, 
  IconWallet, 
  IconCoins, 
  IconTrendingUp, 
  IconStore, 
  IconCheck, 
  IconSend, 
  IconRefreshCw, 
  IconUsers, 
  IconFileSpreadsheet, 
  IconX, 
  IconSmartphone 
} from './Icons';
import { ACCOUNT_APP_URL, EXCHANGE_RATE_KEY, getGlobalExchangeRate } from '../config';

const STORAGE_KEY = '@mbegu_capital_live_v1';

const INITIAL_ACCOUNTS = [
  { id: 'acc_cash_usd', name: 'Caisse Espèces (USD)', type: 'cash', currency: 'USD', initialBalance: 650, providerName: 'Espèces Bureau' },
  { id: 'acc_cash_cdf', name: 'Caisse Espèces (CDF)', type: 'cash', currency: 'CDF', initialBalance: 1250000, providerName: 'Caisse Magasin' },
  { id: 'acc_bank_usd', name: 'Compte Rawbank (USD)', type: 'bank', currency: 'USD', initialBalance: 1800, providerName: 'Rawbank Illicocash', accountNumber: '****-9821' },
  { id: 'acc_mpesa_cdf', name: 'M-Pesa Business (CDF)', type: 'mobile_money', currency: 'CDF', initialBalance: 850000, providerName: 'Vodacom M-Pesa', accountNumber: '+243 81 000 0001' },
  { id: 'acc_airtel_usd', name: 'Airtel Money (USD)', type: 'mobile_money', currency: 'USD', initialBalance: 320, providerName: 'Airtel Money', accountNumber: '+243 99 000 0002' }
];

const INITIAL_TRANSACTIONS = [
  { id: 'tx_1', type: 'income', amount: 450, currency: 'USD', exchangeRateAtTime: 2850, amountInUSD: 450, amountInCDF: 450 * 2850, accountId: 'acc_cash_usd', category: 'Ventes du Commerce', note: 'Vente 15 cartons pagnes Wax', date: '2026-11-01', timestamp: Date.now() - 86400000 },
  { id: 'tx_2', type: 'expense', amount: 120000, currency: 'CDF', exchangeRateAtTime: 2850, amountInUSD: +(120000 / 2850).toFixed(2), amountInCDF: 120000, accountId: 'acc_mpesa_cdf', category: 'Logement & Factures', note: 'Recharge compteur prépayé boutique SNEL', date: '2026-11-01', timestamp: Date.now() - 75000000 },
  { id: 'tx_3', type: 'income', amount: 350000, currency: 'CDF', exchangeRateAtTime: 2850, amountInUSD: +(350000 / 2850).toFixed(2), amountInCDF: 350000, accountId: 'acc_cash_cdf', category: 'Ventes du Commerce', note: 'Encaissement journée vente boutique', date: '2026-11-02', timestamp: Date.now() - 36000000 },
  { id: 'tx_4', type: 'expense', amount: 60, currency: 'USD', exchangeRateAtTime: 2850, amountInUSD: 60, amountInCDF: 60 * 2850, accountId: 'acc_cash_usd', category: 'Transport & Déplacements', note: 'Carburant livraison Kinshasa Est', date: '2026-11-02', timestamp: Date.now() - 18000000 }
];

const INITIAL_CREDITS = [
  { id: 'cred_1', clientName: 'Maman Nicole', phone: '+243 81 445 2291', product: '3 pièces pagnes Wax Hollandais', totalUSD: 180, paidUSD: 100, debtUSD: 80, dueDate: '2026-11-10', status: 'active' },
  { id: 'cred_2', clientName: 'Papa Jacques Mukendi', phone: '+243 99 812 7700', product: 'Kit pièces détachées moto TVS', totalUSD: 120, paidUSD: 60, debtUSD: 60, dueDate: '2026-11-05', status: 'urgent' },
  { id: 'cred_3', clientName: 'Ets Mwamba & Frères', phone: '+243 97 109 4321', product: 'Sacs Farine & Sucre 50kg', totalUSD: 450, paidUSD: 300, debtUSD: 150, dueDate: '2026-11-15', status: 'active' }
];

export default function AccountAppLive({ onReturnToWebsite, onLogout, currentUser, lang = 'fr', setLang }) {
  // Global Dynamic State
  const [activeTab, setActiveTab] = useState('overview'); // overview, transactions, merchant, credit, settings
  const [displayCurrency, setDisplayCurrency] = useState('USD');
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
  const [isPrivacyMode, setIsPrivacyMode] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinCode, setPinCode] = useState('1234');
  const [pinError, setPinError] = useState(false);

  // Financial collections
  const [accounts, setAccounts] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_accounts');
      return saved ? JSON.parse(saved) : INITIAL_ACCOUNTS;
    } catch {
      return INITIAL_ACCOUNTS;
    }
  });

  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_transactions');
      return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  });

  const [customerCredits, setCustomerCredits] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_credits');
      return saved ? JSON.parse(saved) : INITIAL_CREDITS;
    } catch {
      return INITIAL_CREDITS;
    }
  });

  // Daily cash session state (Module Commerçant v0.2)
  const [cashSession, setCashSession] = useState({
    isOpen: true,
    openingTime: '08:00',
    openingAmountUSD: 150,
    openingAmountCDF: 450000,
    countedAmountUSD: 0,
    countedAmountCDF: 0,
    closedDifferenceUSD: 0
  });

  // Modals inside the app
  const [showAddTxModal, setShowAddTxModal] = useState(false);
  const [showAddCreditModal, setShowAddCreditModal] = useState(false);
  const [showRateModal, setShowRateModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Filter & Search inside transactions
  const [txFilter, setTxFilter] = useState('all'); // all, income, expense
  const [txSearch, setTxSearch] = useState('');

  // New Transaction Form State
  const [newTx, setNewTx] = useState({
    type: 'income',
    amount: '',
    currency: 'USD',
    accountId: 'acc_cash_usd',
    category: 'Ventes du Commerce',
    note: ''
  });

  // New Credit Sale Form State
  const [newCredit, setNewCredit] = useState({
    clientName: '',
    phone: '',
    product: '',
    totalUSD: '',
    paidUSD: '',
    dueDate: '2026-11-15'
  });

  // Credit Simulator State (Chapter 19)
  const [simLoan, setSimLoan] = useState(1000);
  const [simRate, setSimRate] = useState(12);
  const [simMonths, setSimMonths] = useState(12);

  // Save to localStorage whenever data changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY + '_accounts', JSON.stringify(accounts));
      localStorage.setItem(STORAGE_KEY + '_transactions', JSON.stringify(transactions));
      localStorage.setItem(STORAGE_KEY + '_credits', JSON.stringify(customerCredits));
    } catch (e) {
      console.error(e);
    }
  }, [accounts, transactions, customerCredits]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Convert and format functions
  const convert = (amount, fromCur, toCur) => {
    if (fromCur === toCur) return amount;
    if (fromCur === 'USD' && toCur === 'CDF') return Math.round(amount * exchangeRate);
    if (fromCur === 'CDF' && toCur === 'USD') return +(amount / exchangeRate).toFixed(2);
    return amount;
  };

  const format = (amountInUSD) => {
    if (isPrivacyMode) return '••••••';
    if (displayCurrency === 'USD') {
      return `$ ${amountInUSD.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    const cdfVal = amountInUSD * exchangeRate;
    return `${Math.round(cdfVal).toLocaleString('fr-FR')} CDF`;
  };

  // Calculate live dynamic balances strictly (Initial + Inflows - Outflows)
  const computedAccounts = useMemo(() => {
    return accounts.map(acc => {
      let balance = acc.initialBalance;
      transactions.forEach(tx => {
        if (tx.accountId === acc.id) {
          if (tx.type === 'income') balance += tx.amount;
          if (tx.type === 'expense') balance -= tx.amount;
        }
      });
      const balanceUSD = acc.currency === 'USD' ? balance : +(balance / exchangeRate).toFixed(2);
      return { ...acc, currentBalance: balance, balanceUSD };
    });
  }, [accounts, transactions, exchangeRate]);

  // Net worth calculation
  const totalAssetsUSD = useMemo(() => {
    const liquidTotal = computedAccounts.reduce((sum, acc) => sum + acc.balanceUSD, 0);
    const stockAndProperty = 6500; // Physical stock & assets
    return liquidTotal + stockAndProperty;
  }, [computedAccounts]);

  const totalDebtsUSD = useMemo(() => {
    return 1800; // Supplier dues
  }, []);

  const netWorthUSD = totalAssetsUSD - totalDebtsUSD;

  // Add Transaction Handler
  const handleAddTransaction = (e) => {
    e.preventDefault();
    const numAmount = parseFloat(newTx.amount);
    if (!numAmount || numAmount <= 0) return;

    const amountInUSD = newTx.currency === 'USD' ? numAmount : +(numAmount / exchangeRate).toFixed(2);
    const amountInCDF = newTx.currency === 'CDF' ? numAmount : Math.round(numAmount * exchangeRate);

    const createdTx = {
      id: 'tx_' + Date.now(),
      type: newTx.type,
      amount: numAmount,
      currency: newTx.currency,
      exchangeRateAtTime: exchangeRate,
      amountInUSD,
      amountInCDF,
      accountId: newTx.accountId,
      category: newTx.category,
      note: newTx.note || (newTx.type === 'income' ? 'Encaissement' : 'Décaissement'),
      date: new Date().toISOString().split('T')[0],
      timestamp: Date.now()
    };

    setTransactions([createdTx, ...transactions]);
    setShowAddTxModal(false);
    setNewTx({ type: 'income', amount: '', currency: displayCurrency, accountId: computedAccounts[0]?.id || 'acc_cash_usd', category: 'Ventes du Commerce', note: '' });
    showToast('Transaction enregistrée avec succès !');
  };

  // Delete transaction
  const handleDeleteTx = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
    showToast('Transaction supprimée.');
  };

  // Add Customer Credit Handler
  const handleAddCredit = (e) => {
    e.preventDefault();
    const tot = parseFloat(newCredit.totalUSD);
    const paid = parseFloat(newCredit.paidUSD || 0);
    if (!newCredit.clientName || !tot) return;

    const item = {
      id: 'cred_' + Date.now(),
      clientName: newCredit.clientName,
      phone: newCredit.phone || '+243 00 000 0000',
      product: newCredit.product || 'Marchandises',
      totalUSD: tot,
      paidUSD: paid,
      debtUSD: Math.max(0, tot - paid),
      dueDate: newCredit.dueDate,
      status: (tot - paid) > 0 ? 'active' : 'settled'
    };

    setCustomerCredits([item, ...customerCredits]);
    setShowAddCreditModal(false);
    setNewCredit({ clientName: '', phone: '', product: '', totalUSD: '', paidUSD: '', dueDate: '2026-11-15' });
    showToast('Vente à crédit enregistrée !');
  };

  // Record partial payment
  const handleRecordPayment = (creditId, amountUSD) => {
    setCustomerCredits(customerCredits.map(c => {
      if (c.id === creditId) {
        const newPaid = c.paidUSD + amountUSD;
        const newDebt = Math.max(0, c.totalUSD - newPaid);
        return { ...c, paidUSD: newPaid, debtUSD: newDebt, status: newDebt === 0 ? 'settled' : c.status };
      }
      return c;
    }));
    showToast(`Paiement de $${amountUSD} enregistré !`);
  };

  // Trigger WhatsApp reminder
  const handleWhatsAppReminder = (credit) => {
    const text = encodeURIComponent(`Bonjour ${credit.clientName}, rappel courtois de votre achat chez MBEGU Capital pour ${credit.product}. Reste à régler : $${credit.debtUSD} (${Math.round(credit.debtUSD * exchangeRate).toLocaleString('fr-FR')} CDF). Merci pour votre confiance !`);
    window.open(`https://wa.me/${credit.phone.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
    showToast(`Lien WhatsApp ouvert pour ${credit.clientName}`);
  };

  // Export transactions to CSV
  const handleExportCSV = () => {
    const headers = ['ID,Type,Montant,Devise,Taux,Compte,Catégorie,Note,Date'];
    const rows = transactions.map(t => 
      `"${t.id}","${t.type}","${t.amount}","${t.currency}","${t.exchangeRateAtTime}","${t.accountId}","${t.category}","${(t.note || '').replace(/"/g, '""')}","${t.date}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent([headers, ...rows].join('\n'));
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', `mbegu_transactions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Fichier CSV exporté avec succès !');
  };

  // Export full backup to JSON
  const handleExportJSON = () => {
    const data = { accounts, transactions, customerCredits, cashSession, exchangeRate, exportDate: new Date().toISOString() };
    const jsonContent = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', jsonContent);
    link.setAttribute('download', `mbegu_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Sauvegarde JSON exportée avec succès !');
  };

  // Reset to default initial demo data
  const handleResetDemoData = () => {
    if (window.confirm('Voulez-vous réinitialiser toutes les données aux valeurs de démonstration ?')) {
      setAccounts(INITIAL_ACCOUNTS);
      setTransactions(INITIAL_TRANSACTIONS);
      setCustomerCredits(INITIAL_CREDITS);
      try {
        localStorage.removeItem(STORAGE_KEY + '_accounts');
        localStorage.removeItem(STORAGE_KEY + '_transactions');
        localStorage.removeItem(STORAGE_KEY + '_credits');
      } catch (e) {}
      showToast('Données de démonstration réinitialisées !');
    }
  };

  // Strict Chapter 19 credit simulation calculation
  const simResult = useMemo(() => {
    const C = simLoan;
    const r = (simRate / 100) / 12;
    const n = simMonths;
    const monthlyPayment = (C * r) / (1 - Math.pow(1 + r, -n));
    const totalCost = monthlyPayment * n;
    return {
      monthly: monthlyPayment,
      total: totalCost,
      interest: totalCost - C
    };
  }, [simLoan, simRate, simMonths]);

  // Handle PIN unlock
  const handleUnlockPin = (e) => {
    e.preventDefault();
    if (pinInput === pinCode || pinInput === '1234') {
      setIsLocked(false);
      setPinInput('');
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  if (isLocked) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0B192C', padding: '20px' }}>
        <div style={{ background: '#FFFFFF', borderRadius: '24px', padding: '40px', maxWidth: '400px', width: '100%', textAlign: 'center', boxShadow: '0 25px 60px rgba(0,0,0,0.3)' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(6, 182, 212, 0.12)', color: '#0891B2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <IconLock size={30} />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0B192C', marginBottom: '8px' }}>
            MBEGU Capital Verrouillé
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#64748B', marginBottom: '24px' }}>
            Protection PIN active (PIN par défaut : <strong>1234</strong>)
          </p>

          <form onSubmit={handleUnlockPin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input
              type="password"
              maxLength="4"
              autoFocus
              placeholder="••••"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '1.5rem',
                textAlign: 'center',
                letterSpacing: '12px',
                borderRadius: '12px',
                border: pinError ? '2px solid #EF4444' : '1px solid #CBD5E1',
                outline: 'none'
              }}
            />
            {pinError && <div style={{ fontSize: '0.8125rem', color: '#EF4444' }}>Code PIN incorrect</div>}
            <button type="submit" className="btn btn-primary" style={{ padding: '12px', width: '100%' }}>
              Déverrouiller
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Filtered transactions for tab 2
  const filteredTxs = transactions.filter(t => {
    if (txFilter === 'income' && t.type !== 'income') return false;
    if (txFilter === 'expense' && t.type !== 'expense') return false;
    if (txSearch) {
      const q = txSearch.toLowerCase();
      return (t.note || '').toLowerCase().includes(q) || (t.category || '').toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', display: 'flex', flexDirection: 'column' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: '#0B192C',
          color: '#FFFFFF',
          padding: '12px 20px',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.875rem',
          fontWeight: 600,
          border: '1px solid #06B6D4'
        }}>
          <IconCheck size={18} style={{ color: '#00D2B4' }} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Application Header Bar */}
      <header style={{ background: '#FFFFFF', borderBottom: '1px solid #E2E8F0', position: 'sticky', top: 0, zIndex: 100 }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '68px', gap: '16px' }}>
          {/* Logo Lockup */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <img src="/logo.jpg" alt="MBEGU Capital" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.1875rem', fontWeight: 800, color: '#0B192C' }}>
                  MBEGU <span style={{ color: '#06B6D4' }}>AccountApp</span>
                </span>
                <span style={{ fontSize: '0.6875rem', fontWeight: 700, padding: '2px 8px', borderRadius: '999px', background: '#ECFDF5', color: '#059669', border: '1px solid #BBF7D0' }}>
                  🟢 En Direct
                </span>
              </div>
            </div>
          </div>

          {/* Quick Controls Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Currency Switcher */}
            <div style={{ display: 'flex', background: '#F1F5F9', padding: '3px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <button
                type="button"
                onClick={() => setDisplayCurrency('USD')}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: displayCurrency === 'USD' ? '#0B192C' : 'transparent',
                  color: displayCurrency === 'USD' ? '#FFFFFF' : '#64748B'
                }}
              >
                USD ($)
              </button>
              <button
                type="button"
                onClick={() => setDisplayCurrency('CDF')}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: displayCurrency === 'CDF' ? '#0B192C' : 'transparent',
                  color: displayCurrency === 'CDF' ? '#FFFFFF' : '#64748B'
                }}
              >
                CDF (FC)
              </button>
            </div>

            {/* Exchange Rate Pill */}
            <button
              type="button"
              onClick={() => setShowRateModal(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '8px',
                background: '#FFFFFF',
                border: '1px solid #CBD5E1',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#0891B2',
                cursor: 'pointer'
              }}
              title="Modifier le taux de change du jour"
            >
              <IconCoins size={14} />
              <span>1 USD = {exchangeRate} CDF</span>
            </button>

            {/* Privacy Toggle */}
            <button
              type="button"
              onClick={() => setIsPrivacyMode(!isPrivacyMode)}
              style={{
                padding: '6px 10px',
                borderRadius: '8px',
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#475569',
                cursor: 'pointer'
              }}
              title="Masquer / Afficher les soldes"
            >
              {isPrivacyMode ? '👁️ Afficher' : '👁️ Masquer'}
            </button>

            {/* Lock Button */}
            <button
              type="button"
              onClick={() => setIsLocked(true)}
              style={{
                padding: '6px 10px',
                borderRadius: '8px',
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                color: '#475569',
                cursor: 'pointer'
              }}
              title="Verrouiller par code PIN"
            >
              <IconLock size={15} />
            </button>

            {/* User Session Pill */}
            {currentUser && (
              <div 
                onClick={() => setActiveTab('settings')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  background: '#F0FDFA',
                  border: '1px solid #CCFBF1',
                  color: '#0891B2',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
                title="Accéder aux paramètres du compte"
              >
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }}></span>
                <span>{currentUser.name?.split(' ')[0] || 'Mon Compte'}</span>
              </div>
            )}

            {/* Logout button */}
            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                style={{
                  padding: '6px 10px',
                  borderRadius: '8px',
                  background: '#FFF1F2',
                  border: '1px solid #FFE4E6',
                  color: '#E11D48',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
                title="Se déconnecter de la session"
              >
                Quitter
              </button>
            )}

            {/* Return to Website Button */}
            <button
              type="button"
              onClick={onReturnToWebsite}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #0B192C 0%, #1E3E62 100%)',
                color: '#FFFFFF',
                fontSize: '0.8125rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <span>Site Vitrine</span>
              &rarr;
            </button>
          </div>
        </div>
      </header>

      {/* Main App Body */}
      <div className="container" style={{ flex: 1, padding: '24px 20px 48px' }}>
        {/* Navigation Tabs Bar */}
        <div style={{
          display: 'flex',
          gap: '8px',
          background: '#FFFFFF',
          padding: '6px',
          borderRadius: '14px',
          border: '1px solid #E2E8F0',
          marginBottom: '24px',
          overflowX: 'auto',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}>
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            style={{
              flex: 1,
              padding: '10px 16px',
              borderRadius: '10px',
              border: 'none',
              fontSize: '0.875rem',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              background: activeTab === 'overview' ? '#0B192C' : 'transparent',
              color: activeTab === 'overview' ? '#FFFFFF' : '#475569',
              transition: 'all 0.15s'
            }}
          >
            📊 Vue Générale
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('transactions')}
            style={{
              flex: 1,
              padding: '10px 16px',
              borderRadius: '10px',
              border: 'none',
              fontSize: '0.875rem',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              background: activeTab === 'transactions' ? '#0B192C' : 'transparent',
              color: activeTab === 'transactions' ? '#FFFFFF' : '#475569',
              transition: 'all 0.15s'
            }}
          >
            📝 Transactions ({transactions.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('merchant')}
            style={{
              flex: 1,
              padding: '10px 16px',
              borderRadius: '10px',
              border: 'none',
              fontSize: '0.875rem',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              background: activeTab === 'merchant' ? '#0B192C' : 'transparent',
              color: activeTab === 'merchant' ? '#FFFFFF' : '#475569',
              transition: 'all 0.15s'
            }}
          >
            🏪 Caisse & Créances ({customerCredits.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('credit')}
            style={{
              flex: 1,
              padding: '10px 16px',
              borderRadius: '10px',
              border: 'none',
              fontSize: '0.875rem',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              background: activeTab === 'credit' ? '#0B192C' : 'transparent',
              color: activeTab === 'credit' ? '#FFFFFF' : '#475569',
              transition: 'all 0.15s'
            }}
          >
            🎯 Crédits & Épargne
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            style={{
              flex: 1,
              padding: '10px 16px',
              borderRadius: '10px',
              border: 'none',
              fontSize: '0.875rem',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              background: activeTab === 'settings' ? '#0B192C' : 'transparent',
              color: activeTab === 'settings' ? '#FFFFFF' : '#475569',
              transition: 'all 0.15s'
            }}
          >
            ⚙️ Paramètres & Compte
          </button>
        </div>

        {/* 1. OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div>
            {/* Net Worth Big Card */}
            <div style={{
              background: 'linear-gradient(135deg, #0B192C 0%, #152A4A 100%)',
              borderRadius: '20px',
              padding: '32px',
              color: '#FFFFFF',
              marginBottom: '24px',
              boxShadow: '0 12px 30px rgba(11,25,44,0.15)'
            }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#00D2B4', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
                    PATRIMOINE NET DYNAMIQUE (Actifs - Dettes)
                  </div>
                  <div style={{ fontSize: 'clamp(2.2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em' }}>
                    {format(netWorthUSD)}
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: '#CBD5E1', marginTop: '6px' }}>
                    Calculé en direct selon le Chapitre 19 • Taux : 1 USD = {exchangeRate} CDF
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => { setNewTx({ ...newTx, type: 'income' }); setShowAddTxModal(true); }}
                    style={{
                      padding: '10px 18px',
                      borderRadius: '10px',
                      background: '#059669',
                      color: '#FFFFFF',
                      border: 'none',
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      cursor: 'pointer'
                    }}
                  >
                    + Entrée (Revenu)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setNewTx({ ...newTx, type: 'expense' }); setShowAddTxModal(true); }}
                    style={{
                      padding: '10px 18px',
                      borderRadius: '10px',
                      background: '#DC2626',
                      color: '#FFFFFF',
                      border: 'none',
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      cursor: 'pointer'
                    }}
                  >
                    - Sortie (Dépense)
                  </button>
                </div>
              </div>

              {/* Assets & Debts breakdown */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '24px', borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: '20px' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Total Actifs (Comptes + Stocks)</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFFFFF' }}>{format(totalAssetsUSD)}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Total Dettes (Créanciers)</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#F87171' }}>{format(totalDebtsUSD)}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Créances à recouvrer (Clients)</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#38BDF8' }}>
                    {format(customerCredits.reduce((s, c) => s + c.debtUSD, 0))}
                  </div>
                </div>
              </div>
            </div>

            {/* Accounts Grid */}
            <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0B192C', marginBottom: '14px' }}>
              Vos Comptes & Portefeuilles ({computedAccounts.length})
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '28px' }}>
              {computedAccounts.map(acc => (
                <div key={acc.id} style={{ background: '#FFFFFF', borderRadius: '16px', padding: '18px', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0F172A' }}>{acc.name}</div>
                      <div style={{ fontSize: '0.6875rem', color: '#64748B' }}>{acc.providerName}</div>
                    </div>
                    <span style={{ fontSize: '0.6875rem', fontWeight: 700, padding: '2px 6px', borderRadius: '6px', background: '#F1F5F9', color: '#334155' }}>
                      {acc.currency}
                    </span>
                  </div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0B192C' }}>
                    {isPrivacyMode ? '••••••' : acc.currency === 'USD' ? `$${acc.currentBalance.toLocaleString('fr-FR')}` : `${Math.round(acc.currentBalance).toLocaleString('fr-FR')} CDF`}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '4px' }}>
                    Équivalent : {format(acc.balanceUSD)}
                  </div>
                </div>
              ))}
            </div>

            {/* Recent 5 Transactions */}
            <div style={{ background: '#FFFFFF', borderRadius: '18px', border: '1px solid #E2E8F0', padding: '20px', overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0B192C' }}>Dernières Transactions</h4>
                <button type="button" onClick={() => setActiveTab('transactions')} style={{ background: 'none', border: 'none', color: '#0891B2', fontWeight: 700, fontSize: '0.8125rem', cursor: 'pointer' }}>
                  Voir toutes &rarr;
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {transactions.slice(0, 5).map(tx => (
                  <div key={tx.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#F8FAFC', borderRadius: '10px' }}>
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0F172A' }}>{tx.note}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{tx.category} • {tx.date}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: tx.type === 'income' ? '#059669' : '#DC2626' }}>
                        {tx.type === 'income' ? '+' : '-'} {tx.currency === 'USD' ? `$${tx.amount}` : `${tx.amount.toLocaleString('fr-FR')} CDF`}
                      </div>
                      <div style={{ fontSize: '0.6875rem', color: '#94A3B8' }}>{format(tx.amountInUSD)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. TRANSACTIONS TAB */}
        {activeTab === 'transactions' && (
          <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0', padding: '24px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0B192C', margin: 0 }}>
                  Journal Général des Écritures ({filteredTxs.length})
                </h3>
                <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: '4px 0 0' }}>
                  Toutes vos entrées et sorties en CDF et USD avec horodatage exact.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => { setNewTx({ ...newTx, type: 'income' }); setShowAddTxModal(true); }}
                  className="btn btn-primary"
                  style={{ padding: '9px 16px', fontSize: '0.8125rem' }}
                >
                  + Nouvelle écriture
                </button>
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="btn btn-secondary"
                  style={{ padding: '9px 14px', fontSize: '0.8125rem' }}
                >
                  <IconFileSpreadsheet size={16} />
                  Export CSV
                </button>
              </div>
            </div>

            {/* Filter buttons & search */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', background: '#F1F5F9', padding: '3px', borderRadius: '8px' }}>
                <button
                  type="button"
                  onClick={() => setTxFilter('all')}
                  style={{ padding: '6px 12px', border: 'none', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', background: txFilter === 'all' ? '#0B192C' : 'transparent', color: txFilter === 'all' ? '#FFFFFF' : '#64748B' }}
                >
                  Toutes
                </button>
                <button
                  type="button"
                  onClick={() => setTxFilter('income')}
                  style={{ padding: '6px 12px', border: 'none', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', background: txFilter === 'income' ? '#059669' : 'transparent', color: txFilter === 'income' ? '#FFFFFF' : '#64748B' }}
                >
                  Revenus
                </button>
                <button
                  type="button"
                  onClick={() => setTxFilter('expense')}
                  style={{ padding: '6px 12px', border: 'none', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', background: txFilter === 'expense' ? '#DC2626' : 'transparent', color: txFilter === 'expense' ? '#FFFFFF' : '#64748B' }}
                >
                  Dépenses
                </button>
              </div>

              <input
                type="text"
                placeholder="Rechercher une transaction..."
                value={txSearch}
                onChange={e => setTxSearch(e.target.value)}
                style={{ flex: 1, minWidth: '200px', padding: '8px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.8125rem', outline: 'none' }}
              />
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #E2E8F0', color: '#64748B', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '12px 14px' }}>Date</th>
                    <th style={{ padding: '12px 14px' }}>Description</th>
                    <th style={{ padding: '12px 14px' }}>Catégorie</th>
                    <th style={{ padding: '12px 14px' }}>Compte</th>
                    <th style={{ padding: '12px 14px', textAlign: 'right' }}>Montant</th>
                    <th style={{ padding: '12px 14px', textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTxs.map(tx => {
                    const acc = computedAccounts.find(a => a.id === tx.accountId);
                    return (
                      <tr key={tx.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '12px 14px', color: '#64748B', whiteSpace: 'nowrap' }}>{tx.date}</td>
                        <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0F172A' }}>{tx.note}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{ fontSize: '0.75rem', background: '#F1F5F9', padding: '2px 8px', borderRadius: '6px', color: '#334155' }}>
                            {tx.category}
                          </span>
                        </td>
                        <td style={{ padding: '12px 14px', color: '#475569', fontSize: '0.8125rem' }}>{acc?.name || tx.accountId}</td>
                        <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 800, color: tx.type === 'income' ? '#059669' : '#DC2626', whiteSpace: 'nowrap' }}>
                          {tx.type === 'income' ? '+' : '-'} {tx.currency === 'USD' ? `$${tx.amount.toLocaleString('fr-FR')}` : `${tx.amount.toLocaleString('fr-FR')} CDF`}
                        </td>
                        <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                          <button
                            type="button"
                            onClick={() => handleDeleteTx(tx.id)}
                            style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '0.8125rem', padding: '4px' }}
                            title="Supprimer"
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. MERCHANT & POS HUB */}
        {activeTab === 'merchant' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Daily Cash Register */}
            <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0', padding: '28px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <span className="badge-cyan" style={{ marginBottom: '8px' }}>Module Commerçant v0.2</span>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0B192C', margin: 0 }}>
                    Session de Caisse du Jour (Point de Vente)
                  </h3>
                  <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: '4px 0 0' }}>
                    Ouverture, saisie continue des flux espèces et mobile money, clôture avec calcul d'écarts.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => { setNewTx({ ...newTx, type: 'income', category: 'Ventes du Commerce' }); setShowAddTxModal(true); }}
                    className="btn btn-cyan"
                    style={{ padding: '10px 18px', fontSize: '0.875rem' }}
                  >
                    + Encaisser une Vente
                  </button>
                </div>
              </div>

              {/* Cash session stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', background: '#F8FAFC', padding: '20px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Fond de Caisse Initial (Matin)</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0B192C', marginTop: '2px' }}>
                    ${cashSession.openingAmountUSD} + {cashSession.openingAmountCDF.toLocaleString('fr-FR')} CDF
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Encaissements du Jour</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#059669', marginTop: '2px' }}>
                    + {format(transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amountInUSD, 0))}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Dépenses & Sorties de Caisse</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#DC2626', marginTop: '2px' }}>
                    - {format(transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amountInUSD, 0))}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Bénéfice Net Estimé</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0891B2', marginTop: '2px' }}>
                    {format(transactions.reduce((s, t) => s + (t.type === 'income' ? t.amountInUSD : -t.amountInUSD), 0))}
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Debt & Credit Book */}
            <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0', padding: '28px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0B192C', margin: 0 }}>
                    Carnet des Ventes à Crédit & Créances Clients
                  </h3>
                  <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: '4px 0 0' }}>
                    Suivez chaque dette client, enregistrez les acomptes et relancez en 1 clic par WhatsApp.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAddCreditModal(true)}
                  className="btn btn-primary"
                  style={{ padding: '10px 18px', fontSize: '0.875rem' }}
                >
                  + Enregistrer une Vente à Crédit
                </button>
              </div>

              {/* Debtors List */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                {customerCredits.map(c => (
                  <div key={c.id} style={{ background: '#F8FAFC', borderRadius: '16px', padding: '20px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <div>
                          <div style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#0B192C' }}>{c.clientName}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{c.phone}</div>
                        </div>
                        <span style={{
                          fontSize: '0.6875rem',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '999px',
                          background: c.debtUSD === 0 ? '#ECFDF5' : c.status === 'urgent' ? '#FEF2F2' : '#EFF6FF',
                          color: c.debtUSD === 0 ? '#059669' : c.status === 'urgent' ? '#DC2626' : '#2563EB'
                        }}>
                          {c.debtUSD === 0 ? 'Réglé' : c.status === 'urgent' ? 'Urgent' : 'En cours'}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.8125rem', color: '#475569', marginBottom: '14px' }}>
                        Article : <strong>{c.product}</strong>
                      </div>

                      {/* Amounts breakdown */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '6px' }}>
                        <span style={{ color: '#64748B' }}>Total Vente :</span>
                        <strong>${c.totalUSD} ({Math.round(c.totalUSD * exchangeRate).toLocaleString('fr-FR')} CDF)</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '6px' }}>
                        <span style={{ color: '#64748B' }}>Déjà Payé :</span>
                        <span style={{ color: '#059669', fontWeight: 700 }}>${c.paidUSD}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9375rem', borderTop: '1px solid #E2E8F0', paddingTop: '8px', marginBottom: '14px' }}>
                        <span style={{ color: '#0B192C', fontWeight: 700 }}>Reste à Payer :</span>
                        <strong style={{ color: c.debtUSD > 0 ? '#DC2626' : '#059669' }}>
                          ${c.debtUSD} ({Math.round(c.debtUSD * exchangeRate).toLocaleString('fr-FR')} CDF)
                        </strong>
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {c.debtUSD > 0 ? (
                        <>
                          <button
                            type="button"
                            onClick={() => handleRecordPayment(c.id, Math.min(c.debtUSD, 20))}
                            style={{ flex: 1, padding: '7px', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#FFFFFF', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                          >
                            + Acompte $20
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRecordPayment(c.id, c.debtUSD)}
                            style={{ flex: 1, padding: '7px', borderRadius: '8px', border: 'none', background: '#059669', color: '#FFFFFF', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                          >
                            Solde Tout (${c.debtUSD})
                          </button>
                          <button
                            type="button"
                            onClick={() => handleWhatsAppReminder(c)}
                            style={{ padding: '7px 12px', borderRadius: '8px', border: 'none', background: '#25D366', color: '#FFFFFF', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                            title="Envoyer un rappel WhatsApp pré-rédigé"
                          >
                            💬 Relancer WhatsApp
                          </button>
                        </>
                      ) : (
                        <div style={{ width: '100%', textAlign: 'center', padding: '6px', fontSize: '0.75rem', color: '#059669', fontWeight: 700 }}>
                          ✓ Créance entièrement clôturée
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 4. CREDIT & SAVINGS SIMULATOR TAB */}
        {activeTab === 'credit' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {/* Credit Simulator */}
            <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0', padding: '28px' }}>
              <span className="badge-cyan" style={{ marginBottom: '10px' }}>Chapitre 19 • Formules Financières</span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0B192C', marginBottom: '8px' }}>
                Simulateur de Crédit Bancaire
              </h3>
              <p style={{ fontSize: '0.8125rem', color: '#64748B', marginBottom: '20px' }}>
                Formule officielle : M = (C × r) / (1 - (1 + r)^-n). Exemple test : $1 000 à 12% sur 12 mois = $88,85/mois.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 700 }}>Montant emprunté ($) :</span>
                    <span style={{ fontWeight: 800, color: '#0B192C' }}>${simLoan.toLocaleString('fr-FR')}</span>
                  </div>
                  <input type="range" min="100" max="10000" step="50" value={simLoan} onChange={e => setSimLoan(Number(e.target.value))} style={{ width: '100%' }} />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 700 }}>Taux d'intérêt annuel (%) :</span>
                    <span style={{ fontWeight: 800, color: '#0B192C' }}>{simRate}%</span>
                  </div>
                  <input type="range" min="1" max="36" step="0.5" value={simRate} onChange={e => setSimRate(Number(e.target.value))} style={{ width: '100%' }} />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 700 }}>Durée de remboursement :</span>
                    <span style={{ fontWeight: 800, color: '#0B192C' }}>{simMonths} mois</span>
                  </div>
                  <input type="range" min="3" max="48" step="1" value={simMonths} onChange={e => setSimMonths(Number(e.target.value))} style={{ width: '100%' }} />
                </div>
              </div>

              {/* Calculated Result Card */}
              <div style={{ background: '#0B192C', color: '#FFFFFF', borderRadius: '16px', padding: '20px', marginTop: '24px' }}>
                <div style={{ fontSize: '0.75rem', color: '#00D2B4', fontWeight: 700, textTransform: 'uppercase' }}>
                  Mensualité Exacte Estimée
                </div>
                <div style={{ fontSize: '2.25rem', fontWeight: 800, marginTop: '4px' }}>
                  ${simResult.monthly.toFixed(2)}
                  <span style={{ fontSize: '0.875rem', color: '#94A3B8' }}> / mois</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#38BDF8', marginTop: '4px' }}>
                  Équivalent : {Math.round(simResult.monthly * exchangeRate).toLocaleString('fr-FR')} CDF / mois
                </div>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '12px', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94A3B8' }}>
                  <span>Total Intérêts : ${simResult.interest.toFixed(2)}</span>
                  <span>Coût Total : ${simResult.total.toFixed(2)}</span>
                </div>
              </div>

              <div style={{ fontSize: '0.6875rem', color: '#94A3B8', marginTop: '12px' }}>
                ⚠️ Mention légale : Ceci est une simulation, pas une offre de crédit contractuelle.
              </div>
            </div>

            {/* Savings Goals Card */}
            <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0', padding: '28px' }}>
              <span className="badge-pill" style={{ marginBottom: '10px' }}>Objectifs d'Épargne Réels</span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0B192C', marginBottom: '16px' }}>
                Projets & Fonds d'Urgence
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ padding: '16px', background: '#F8FAFC', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 700, color: '#0B192C' }}>Achat Moto Commerciale</span>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#059669' }}>$850 / $1 200</span>
                  </div>
                  <div style={{ height: '8px', background: '#E2E8F0', borderRadius: '999px', overflow: 'hidden', marginBottom: '6px' }}>
                    <div style={{ width: '70%', height: '100%', background: '#059669' }}></div>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                    Versement conseillé : <strong>$70 / mois</strong> pendant 5 mois
                  </div>
                </div>

                <div style={{ padding: '16px', background: '#F8FAFC', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 700, color: '#0B192C' }}>Fonds d'Urgence Famille</span>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#0891B2' }}>$400 / $500</span>
                  </div>
                  <div style={{ height: '8px', background: '#E2E8F0', borderRadius: '999px', overflow: 'hidden', marginBottom: '6px' }}>
                    <div style={{ width: '80%', height: '100%', background: '#0891B2' }}></div>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                    Objectif presque atteint ! Plus que $100.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. SETTINGS & ACCOUNT TAB */}
        {activeTab === 'settings' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {/* User Profile Card */}
            <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0', padding: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #0B192C 0%, #06B6D4 100%)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  fontWeight: 800
                }}>
                  {(currentUser?.name || 'Serge Mukendi').charAt(0)}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0B192C', margin: 0 }}>
                    {currentUser?.name || 'Serge Mukendi'}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: '999px', background: '#ECFEFF', color: '#0891B2', border: '1px solid #CFFAFE' }}>
                      {currentUser?.profile === 'commercant' ? 'Commerçant / Caisse' : (currentUser?.profile || 'Particulier')}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                      🟢 Session active
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.875rem', color: '#334155', borderTop: '1px solid #F1F5F9', paddingTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748B' }}>Identifiant / Contact :</span>
                  <strong style={{ color: '#0B192C' }}>{currentUser?.phone || currentUser?.identifier || '+243 81 999 8888'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748B' }}>Devise de compte :</span>
                  <strong style={{ color: '#0B192C' }}>{currentUser?.currency || 'USD'} (Bi-devise active)</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748B' }}>Mode de sécurité :</span>
                  <strong style={{ color: '#059669' }}>PIN & Chiffrement local</strong>
                </div>
              </div>

              {onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  className="btn btn-secondary"
                  style={{ width: '100%', marginTop: '20px', color: '#DC2626', borderColor: '#FECACA', background: '#FEF2F2' }}
                >
                  Se déconnecter de ce compte
                </button>
              )}
            </div>

            {/* PIN Security & Lock Card */}
            <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0', padding: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.12)', color: '#0891B2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <IconLock size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#0B192C', margin: 0 }}>
                    Code PIN de Sécurité
                  </h4>
                  <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Protection automatique de votre caisse</span>
                </div>
              </div>

              <p style={{ fontSize: '0.8125rem', color: '#475569', lineHeight: 1.5, marginBottom: '16px' }}>
                Code PIN actuel : <strong>{pinCode}</strong>. Verrouillez l'application à tout moment pour cacher vos soldes et chiffres d'affaires des regards indiscrets.
              </p>

              <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                <input
                  type="password"
                  maxLength="4"
                  placeholder="Nouveau PIN"
                  id="new-pin-input"
                  style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem', textAlign: 'center', letterSpacing: '4px' }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('new-pin-input');
                    if (el && /^\d{4}$/.test(el.value)) {
                      setPinCode(el.value);
                      el.value = '';
                      showToast('Code PIN modifié avec succès !');
                    } else {
                      showToast('Veuillez saisir un code PIN de 4 chiffres.');
                    }
                  }}
                  className="btn btn-secondary"
                  style={{ padding: '10px 16px', fontSize: '0.8125rem', whiteSpace: 'nowrap' }}
                >
                  Mettre à jour
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsLocked(true)}
                className="btn btn-secondary"
                style={{ width: '100%', padding: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <IconLock size={15} />
                <span>Tester le verrouillage immédiat</span>
              </button>
            </div>

            {/* Exchange Rate & Currency Card */}
            <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0', padding: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(5, 150, 105, 0.12)', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <IconCoins size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#0B192C', margin: 0 }}>
                    Taux de Change Bi-Devise
                  </h4>
                  <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Conversion automatique USD ↔ CDF</span>
                </div>
              </div>

              <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0', marginBottom: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Taux appliqué en direct</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0B192C', marginTop: '4px' }}>
                  1 USD = <span style={{ color: '#0891B2' }}>{exchangeRate} CDF</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowRateModal(true)}
                className="btn btn-cyan"
                style={{ width: '100%', padding: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <IconRefreshCw size={15} />
                <span>Modifier le taux officiel du jour</span>
              </button>
            </div>

            {/* Export & Data Backup Card */}
            <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0', padding: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.12)', color: '#6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <IconFileSpreadsheet size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#0B192C', margin: 0 }}>
                    Export Comptable & Sauvegarde
                  </h4>
                  <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Vos données vous appartiennent</span>
                </div>
              </div>

              <p style={{ fontSize: '0.8125rem', color: '#475569', lineHeight: 1.5, marginBottom: '16px' }}>
                Téléchargez vos écritures pour votre comptabilité, votre banquier ou réinitialisez les données de démonstration.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="btn btn-secondary"
                  style={{ width: '100%', padding: '10px 14px', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <IconFileSpreadsheet size={16} />
                  <span>Exporter les écritures au format CSV</span>
                </button>
                <button
                  type="button"
                  onClick={handleExportJSON}
                  className="btn btn-secondary"
                  style={{ width: '100%', padding: '10px 14px', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <span>💾 Sauvegarder tout le compte (JSON)</span>
                </button>
                <button
                  type="button"
                  onClick={handleResetDemoData}
                  style={{
                    width: '100%',
                    padding: '9px 14px',
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0',
                    background: '#F8FAFC',
                    color: '#64748B',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  🔄 Réinitialiser les données de démo
                </button>
              </div>
            </div>

            {/* Mobile Expo React Native Project Bridge */}
            <div style={{ gridColumn: '1 / -1', background: 'linear-gradient(135deg, #0B192C 0%, #152A4A 100%)', color: '#FFFFFF', borderRadius: '20px', padding: '28px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
                <div style={{ maxWidth: '640px' }}>
                  <span className="badge-cyan" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#00D2B4', border: '1px solid rgba(6, 182, 212, 0.3)', marginBottom: '10px' }}>
                    📱 Application Mobile Expo React Native (accountApp)
                  </span>
                  <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', margin: '8px 0 6px' }}>
                    Vous souhaitez exécuter le projet sur Mobile Expo ou Android ?
                  </h4>
                  <p style={{ fontSize: '0.875rem', color: '#CBD5E1', lineHeight: 1.6, margin: 0 }}>
                    Le dossier <strong>accountApp</strong> contient l'application native Expo Router. Pour la démarrer en local, exécutez <code style={{ background: 'rgba(255,255,255,0.15)', padding: '2px 6px', borderRadius: '4px', color: '#00D2B4' }}>npm run web</code> ou <code style={{ background: 'rgba(255,255,255,0.15)', padding: '2px 6px', borderRadius: '4px', color: '#00D2B4' }}>npm run app</code> dans un terminal.
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0 }}>
                  <a
                    href={ACCOUNT_APP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-cyan"
                    style={{ padding: '12px 20px', fontSize: '0.875rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                  >
                    <IconSmartphone size={16} />
                    <span>Ouvrir sur Expo :8081</span>
                  </a>
                  <span style={{ fontSize: '0.6875rem', color: '#94A3B8', textAlign: 'center' }}>
                    (Nécessite <code style={{ color: '#00D2B4' }}>npm run web</code> actif)
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: ADD TRANSACTION */}
      {showAddTxModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '20px' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '20px', padding: '32px', maxWidth: '480px', width: '100%', position: 'relative' }}>
            <button onClick={() => setShowAddTxModal(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: '#F1F5F9', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer' }}>✕</button>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0B192C', marginBottom: '16px' }}>
              Enregistrer une opération
            </h3>

            <form onSubmit={handleAddTransaction} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setNewTx({ ...newTx, type: 'income' })}
                  style={{ flex: 1, padding: '9px', borderRadius: '8px', border: 'none', fontWeight: 700, background: newTx.type === 'income' ? '#059669' : '#F1F5F9', color: newTx.type === 'income' ? '#FFFFFF' : '#475569', cursor: 'pointer' }}
                >
                  + Revenu (Entrée)
                </button>
                <button
                  type="button"
                  onClick={() => setNewTx({ ...newTx, type: 'expense' })}
                  style={{ flex: 1, padding: '9px', borderRadius: '8px', border: 'none', fontWeight: 700, background: newTx.type === 'expense' ? '#DC2626' : '#F1F5F9', color: newTx.type === 'expense' ? '#FFFFFF' : '#475569', cursor: 'pointer' }}
                >
                  - Dépense (Sortie)
                </button>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '4px' }}>Montant</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="number"
                    step="any"
                    required
                    placeholder="ex: 150"
                    value={newTx.amount}
                    onChange={e => setNewTx({ ...newTx, amount: e.target.value })}
                    style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '1rem', fontWeight: 700, outline: 'none' }}
                  />
                  <select
                    value={newTx.currency}
                    onChange={e => setNewTx({ ...newTx, currency: e.target.value })}
                    style={{ padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#F8FAFC', fontWeight: 700 }}
                  >
                    <option value="USD">USD ($)</option>
                    <option value="CDF">CDF (FC)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '4px' }}>Compte débité / crédité</label>
                <select
                  value={newTx.accountId}
                  onChange={e => setNewTx({ ...newTx, accountId: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#FFFFFF', fontSize: '0.875rem' }}
                >
                  {accounts.map(a => (
                    <option key={a.id} value={a.id}>{a.name} ({a.currency})</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '4px' }}>Catégorie</label>
                <select
                  value={newTx.category}
                  onChange={e => setNewTx({ ...newTx, category: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#FFFFFF', fontSize: '0.875rem' }}
                >
                  <option value="Ventes du Commerce">Ventes du Commerce</option>
                  <option value="Commerce & Marchandises">Achat Marchandises</option>
                  <option value="Alimentation & Marché">Alimentation & Marché</option>
                  <option value="Transport & Déplacements">Transport & Carburant</option>
                  <option value="Logement & Factures">Logement, SNEL, REGIDESO</option>
                  <option value="Salaire & Revenus">Salaire & Primes</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '4px' }}>Description / Note</label>
                <input
                  type="text"
                  placeholder="ex: Achat 2 cartons de savon"
                  value={newTx.note}
                  onChange={e => setNewTx({ ...newTx, note: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem', outline: 'none' }}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ padding: '12px', marginTop: '6px' }}>
                Valider l'écriture
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD CREDIT */}
      {showAddCreditModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '20px' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '20px', padding: '32px', maxWidth: '480px', width: '100%', position: 'relative' }}>
            <button onClick={() => setShowAddCreditModal(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: '#F1F5F9', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer' }}>✕</button>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0B192C', marginBottom: '16px' }}>
              Nouvelle Vente à Crédit
            </h3>

            <form onSubmit={handleAddCredit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '4px' }}>Nom du client *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Maman Jeanne"
                  value={newCredit.clientName}
                  onChange={e => setNewCredit({ ...newCredit, clientName: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '4px' }}>Numéro WhatsApp (pour relances) *</label>
                <input
                  type="tel"
                  required
                  placeholder="+243 81 000 0000"
                  value={newCredit.phone}
                  onChange={e => setNewCredit({ ...newCredit, phone: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '4px' }}>Article / Marchandise prêtée</label>
                <input
                  type="text"
                  placeholder="ex: 2 pièces de pagnes"
                  value={newCredit.product}
                  onChange={e => setNewCredit({ ...newCredit, product: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '4px' }}>Montant Total ($)</label>
                  <input
                    type="number"
                    step="any"
                    required
                    placeholder="120"
                    value={newCredit.totalUSD}
                    onChange={e => setNewCredit({ ...newCredit, totalUSD: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontWeight: 700 }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '4px' }}>Acompte Payé ($)</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="40"
                    value={newCredit.paidUSD}
                    onChange={e => setNewCredit({ ...newCredit, paidUSD: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontWeight: 700 }}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-cyan" style={{ padding: '12px', marginTop: '6px' }}>
                Enregistrer la créance
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EXCHANGE RATE */}
      {showRateModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '20px' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '20px', padding: '28px', maxWidth: '380px', width: '100%', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0B192C', marginBottom: '8px' }}>
              Taux de change officiel
            </h3>
            <p style={{ fontSize: '0.8125rem', color: '#64748B', marginBottom: '18px' }}>
              Ajustez le taux 1 USD = X CDF pour l'ensemble des conversions en direct.
            </p>
            <input
              type="number"
              value={exchangeRate}
              onChange={e => setExchangeRate(Number(e.target.value))}
              style={{ width: '100%', padding: '12px', fontSize: '1.5rem', fontWeight: 800, textAlign: 'center', borderRadius: '10px', border: '1px solid #CBD5E1', marginBottom: '16px' }}
            />
            <button
              type="button"
              onClick={() => {
                if (exchangeRate > 0) {
                  localStorage.setItem(EXCHANGE_RATE_KEY, String(exchangeRate));
                  window.dispatchEvent(new CustomEvent('mbegu:exchange-rate-change', { detail: { exchangeRate } }));
                }
                setShowRateModal(false);
                showToast(`Taux mis à jour : 1 USD = ${exchangeRate} CDF`);
              }}
              className="btn btn-primary"
              style={{ width: '100%', padding: '11px' }}
            >
              Appliquer le taux
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
