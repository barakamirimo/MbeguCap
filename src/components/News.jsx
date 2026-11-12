import { useState, useEffect } from 'react';
import { IconSparkles, IconArrowRight, IconX } from './Icons';
import { getNewsArticles } from '../config/newsContent';

export default function News({ lang = 'fr', t }) {
  const [articles, setArticles] = useState(getNewsArticles);
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    const handleNewsChange = () => setArticles(getNewsArticles());
    window.addEventListener('mbegu:news-change', handleNewsChange);
    window.addEventListener('storage', handleNewsChange);
    return () => {
      window.removeEventListener('mbegu:news-change', handleNewsChange);
      window.removeEventListener('storage', handleNewsChange);
    };
  }, []);

  const localizedArticles = articles.map((article) => {
    const translation = lang === 'fr'
      ? null
      : article.translations?.[lang] || (
        article.updatedAt || article.createdAt
          ? null
          : t?.newsSection?.articles?.[article.id]
      );
    return translation ? { ...article, ...translation } : article;
  });
  const localizedSelectedArticle = selectedArticle
    ? localizedArticles.find((article) => article.id === selectedArticle.id) || selectedArticle
    : null;

  return (
    <section id="actualites" style={{ padding: '96px 0', background: '#FAFCFF', borderBottom: '1px solid #E2E8F0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 56px' }}>
          <span className="badge-cyan" style={{ marginBottom: '14px' }}>
            <IconSparkles size={14} />
            {t?.newsSection?.badge || 'Actualités & Communiqués'}
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 3.8vw, 2.85rem)', fontWeight: 800, color: '#0B192C', letterSpacing: '-0.03em', marginBottom: '16px' }}>
            {t?.newsSection?.title || 'Suivez les avancées de MBEGU Capital'}
          </h2>
          <p style={{ fontSize: '1.125rem', color: '#64748B', lineHeight: 1.6 }}>
            {t?.newsSection?.desc || 'Découvrez nos dernières annonces, les retours des pilotes sur le terrain en RDC et les mises à jour technologiques de la plateforme.'}
          </p>
        </div>

        {/* Articles Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '28px'
        }}>
          {localizedArticles.map((article) => (
            <div
              key={article.id}
              className="card-finary"
              style={{
                padding: '30px',
                borderRadius: '16px',
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 4px 20px -2px rgba(11,25,44,0.04)',
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }}
              onClick={() => setSelectedArticle(article)}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <span style={{
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    padding: '4px 9px',
                    borderRadius: '999px',
                    background: article.badgeBg,
                    color: article.badgeColor,
                    border: `1px solid ${article.badgeColor}33`
                  }}>
                    {article.badge}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600 }}>
                    {article.date}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0B192C', lineHeight: 1.4, marginBottom: '12px' }}>
                  {article.title}
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#64748B', lineHeight: 1.6, marginBottom: '24px' }}>
                  {article.excerpt}
                </p>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '16px',
                borderTop: '1px solid #F1F5F9'
              }}>
                <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 500 }}>
                  {article.readTime}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedArticle(article);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#0891B2',
                    fontWeight: 700,
                    fontSize: '0.8125rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  {t?.newsSection?.readMore || "Lire l'article"}
                  <IconArrowRight size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for full article reading */}
      {localizedSelectedArticle && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(11, 25, 44, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          zIndex: 1000
        }}
        onClick={() => setSelectedArticle(null)}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              maxWidth: '620px',
              width: '100%',
              padding: '36px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 50px -12px rgba(11,25,44,0.25)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedArticle(null)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: '#F1F5F9',
                border: 'none',
                color: '#64748B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              aria-label={lang === 'en' ? 'Close' : lang === 'sw' ? 'Funga' : 'Fermer'}
            >
              <IconX size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <span style={{
                fontSize: '0.6875rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                padding: '4px 9px',
                borderRadius: '999px',
                background: localizedSelectedArticle.badgeBg,
                color: localizedSelectedArticle.badgeColor
              }}>
                {localizedSelectedArticle.badge}
              </span>
              <span style={{ fontSize: '0.8125rem', color: '#94A3B8', fontWeight: 600 }}>
                {localizedSelectedArticle.date}
              </span>
            </div>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0B192C', lineHeight: 1.35, marginBottom: '20px' }}>
              {localizedSelectedArticle.title}
            </h2>

            <div style={{
              fontSize: '0.9375rem',
              color: '#334155',
              lineHeight: 1.7,
              whiteSpace: 'pre-line',
              borderTop: '1px solid #E2E8F0',
              paddingTop: '20px',
              marginBottom: '28px'
            }}>
              {localizedSelectedArticle.content}
            </div>

            <button
              type="button"
              onClick={() => setSelectedArticle(null)}
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', fontWeight: 700 }}
            >
              {t?.newsSection?.close || 'Fermer la lecture'}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
