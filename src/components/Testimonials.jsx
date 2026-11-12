import { IconSparkles } from './Icons';

export default function Testimonials({ lang = 'fr', t, siteContent }) {
  const getTxt = (siteVal, tVal) => (lang === 'fr' && siteVal ? siteVal : tVal);

  const reviews = (lang === 'fr' && Array.isArray(siteContent?.testimonials) && siteContent.testimonials.length > 0)
    ? siteContent.testimonials
    : (t?.testimonials?.items || []);

  return (
    <section style={{ padding: '96px 0', background: '#FFFFFF', borderBottom: '1px solid #E2E8F0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '760px', margin: '0 auto 54px' }}>
          <span className="badge-cyan" style={{ marginBottom: '14px' }}>
            <IconSparkles size={14} />
            {getTxt(siteContent?.testimonialsBadge, t?.testimonials?.badge || 'Retours du Programme Pilote')}
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 3.8vw, 2.85rem)', fontWeight: 800, color: '#0B192C', letterSpacing: '-0.03em', marginBottom: '16px' }}>
            {getTxt(siteContent?.testimonialsTitle, t?.testimonials?.title || "Adopté par les entrepreneurs qui bâtissent l'avenir")}
          </h2>
          <p style={{ fontSize: '1.0625rem', color: '#475569', lineHeight: 1.6 }}>
            {getTxt(siteContent?.testimonialsDescription, t?.testimonials?.description || 'Découvrez comment les premiers testeurs utilisent MBEGU Capital au quotidien pour protéger et faire croître leur argent.')}
          </p>
        </div>

        {/* Reviews Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px'
        }}>
          {reviews.map((rev, idx) => (
            <div key={idx} className="card-finary" style={{ padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '4px 10px', borderRadius: '6px', background: 'rgba(6, 182, 212, 0.1)', color: '#0891B2' }}>
                    {rev.tag}
                  </span>
                  <div style={{ color: '#F59E0B', fontSize: '0.875rem' }}>★★★★★</div>
                </div>
                <p style={{ fontSize: '0.9375rem', color: '#334155', lineHeight: 1.65, fontStyle: 'italic', marginBottom: '24px' }}>
                  "{rev.comment}"
                </p>
              </div>

              <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '16px' }}>
                <div style={{ fontWeight: 800, color: '#0B192C', fontSize: '0.9375rem' }}>{rev.name}</div>
                <div style={{ fontSize: '0.8125rem', color: '#64748B' }}>{rev.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
