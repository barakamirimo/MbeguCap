import { 
  IconWifiOff, 
  IconRefreshCw, 
  IconLock, 
  IconSmartphone 
} from './Icons';

export default function OfflineArchitecture({ lang = 'fr', t }) {
  return (
    <section id="hors-ligne" style={{ padding: '96px 0', background: '#FAFCFF', borderBottom: '1px solid #E2E8F0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 56px' }}>
          <span className="badge-cyan" style={{ marginBottom: '14px' }}>
            <IconWifiOff size={14} />
            {t.offline.tag}
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 3.8vw, 2.85rem)', fontWeight: 800, color: '#0B192C', letterSpacing: '-0.03em', marginBottom: '16px' }}>
            {t.offline.title}
          </h2>
          <p style={{ fontSize: '1.0625rem', color: '#475569', lineHeight: 1.6 }}>
            {t.offline.subtitle}
          </p>
        </div>

        {/* 3 Pillars of Offline Architecture */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '28px',
          marginBottom: '56px'
        }}>
          {/* Card 1 */}
          <div className="card-finary" style={{ padding: '32px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(6, 182, 212, 0.1)', color: '#0891B2', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <IconLock size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0B192C', marginBottom: '12px' }}>
              {t.offline.point1Title}
            </h3>
            <p style={{ fontSize: '0.9375rem', color: '#475569', lineHeight: 1.6 }}>
              {t.offline.point1Desc}
            </p>
          </div>

          {/* Card 2 */}
          <div className="card-finary" style={{ padding: '32px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(16, 185, 129, 0.1)', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <IconRefreshCw size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0B192C', marginBottom: '12px' }}>
              {t.offline.point2Title}
            </h3>
            <p style={{ fontSize: '0.9375rem', color: '#475569', lineHeight: 1.6 }}>
              {t.offline.point2Desc}
            </p>
          </div>

          {/* Card 3 */}
          <div className="card-finary" style={{ padding: '32px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(2, 132, 199, 0.1)', color: '#0284C7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <IconSmartphone size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0B192C', marginBottom: '12px' }}>
              {t.offline.point3Title}
            </h3>
            <p style={{ fontSize: '0.9375rem', color: '#475569', lineHeight: 1.6 }}>
              {t.offline.point3Desc}
            </p>
          </div>
        </div>

        {/* Visual Comparison: Traditional Web App vs MBEGU Offline Engine */}
        <div style={{
          background: 'linear-gradient(135deg, #0B192C 0%, #152A4A 100%)',
          borderRadius: '24px',
          padding: '40px',
          color: '#FFFFFF'
        }}>
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 36px' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '10px' }}>
              {lang === 'en'
                ? 'Why is an "Offline-First" architecture essential?'
                : lang === 'sw'
                ? 'Kwa nini mfumo wa "Bila Mtandao Kwanza" ni wa lazima?'
                : 'Pourquoi une architecture « Offline-First » est indispensable ?'}
            </h3>
            <p style={{ fontSize: '0.9375rem', color: '#94A3B8' }}>
              {lang === 'en'
                ? 'Across DR Congo, fiber optic cuts and unstable mobile data should never disrupt your financial control.'
                : lang === 'sw'
                ? 'Nchini DR Congo, kukatika kwa mtandao au changamoto za 4G hazipaswi kuzuia usimamizi wa pesa zako.'
                : "En République Démocratique du Congo, les coupures de fibre et les instabilités 4G ne doivent jamais paralyser votre gestion d'argent."}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {/* Standard Apps */}
            <div style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: '16px', padding: '24px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ color: '#EF4444', fontWeight: 700, fontSize: '0.875rem', textTransform: 'uppercase', marginBottom: '14px' }}>
                {lang === 'en' ? '✕ Traditional Cloud Apps' : lang === 'sw' ? '✕ Programu za Kawaida za Mtandao' : '✕ Applications Classiques Cloud'}
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.875rem', color: '#CBD5E1' }}>
                <li>{lang === 'en' ? '• Blank screen or "No connection" error' : lang === 'sw' ? '• Skrini nyeupe au kosa la "Hakuna Mtandao"' : '• Écran blanc ou erreur "Connexion introuvable"'}</li>
                <li>{lang === 'en' ? '• Impossible to record sales at the market without 4G' : lang === 'sw' ? '• Huwezi kuandika mauzo sokoni bila mtandao' : '• Ventes impossibles à noter au marché sans 4G'}</li>
                <li>{lang === 'en' ? '• Data stored exclusively on remote servers' : lang === 'sw' ? '• Taarifa zinahifadhiwa kwenye seva za mbali pekee' : '• Données stockées uniquement sur serveurs distants'}</li>
                <li>{lang === 'en' ? '• Time lost waiting for data bundles or wifi' : lang === 'sw' ? '• Kupoteza muda kusubiri bando la Internet' : '• Perte de temps lors des recharges de data'}</li>
              </ul>
            </div>

            {/* MBEGU Capital */}
            <div style={{ background: 'rgba(6, 182, 212, 0.1)', borderRadius: '16px', padding: '24px', border: '1.5px solid #06B6D4' }}>
              <div style={{ color: '#00D2B4', fontWeight: 700, fontSize: '0.875rem', textTransform: 'uppercase', marginBottom: '14px' }}>
                {lang === 'en' ? '✓ MBEGU Capital Offline Engine' : lang === 'sw' ? '✓ Injini ya MBEGU Capital Bila Mtandao' : '✓ Moteur MBEGU Capital Offline'}
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.875rem', color: '#FFFFFF' }}>
                <li>{lang === 'en' ? '• Works 24/7 with or without an Internet plan' : lang === 'sw' ? '• Inafanya kazi saa 24/7, ukiwa na au bila bando' : '• Fonctionne 24h/24, avec ou sans forfait Internet'}</li>
                <li>{lang === 'en' ? '• Local AES-encrypted SQLite database' : lang === 'sw' ? '• Hifadhi salama ya ndani ya SQLite iliyosimbwa' : '• Base de données SQLite locale chiffrée AES'}</li>
                <li>{lang === 'en' ? '• Seamless background auto-synchronization' : lang === 'sw' ? '• Usawazishaji wa haraka na salama bila usumbufu' : '• Synchronisation d\'arrière-plan sans friction'}</li>
                <li>{lang === 'en' ? '• Immediate local export to PDF or CSV' : lang === 'sw' ? '• Toa ripoti mara moja kwa PDF au CSV kwenye simu' : '• Export local immédiat en PDF ou CSV'}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
