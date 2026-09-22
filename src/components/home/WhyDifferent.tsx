'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';

export default function WhyDifferent() {
  const { t } = useTranslation();

  const points = [
    { key: 'stories', icon: 'bi-book-half', color: 'var(--pa-purple)' },
    { key: 'strategies', icon: 'bi-bullseye', color: 'var(--pa-blue)' },
    { key: 'results', icon: 'bi-graph-up-arrow', color: 'var(--pa-pink)' },
  ];

  return (
    <section className="pa-section">
      <div className="pa-blob" style={{ width: 300, height: 300, background: 'var(--pa-yellow)', top: -40, right: -60 }} />
      <div className="pa-container">
        <div className="pa-awarded-grid" style={{ gridTemplateColumns: '0.9fr 1.1fr' }}>
          <div className="pa-fadein" style={{ order: 2 }}>
            <img
              src="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=900&q=80"
              alt="Team work"
              style={{ borderRadius: 26, height: 460, width: '100%', objectFit: 'cover', boxShadow: 'var(--pa-shadow-lg)' }}
            />
          </div>
          <div className="pa-fadeup" style={{ order: 1 }}>
            <h2 className="pa-h2">{t('home.whyDifferent.title')}</h2>
            <p className="pa-lead" style={{ marginBottom: 30 }}>
              {t('home.whyDifferent.description')}
            </p>
            {points.map((p) => (
              <div key={p.key} style={{ display: 'flex', gap: 16, marginBottom: 22 }}>
                <div
                  style={{
                    minWidth: 48,
                    height: 48,
                    borderRadius: 14,
                    background: p.color,
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 22,
                  }}
                >
                  <i className={`bi ${p.icon}`} />
                </div>
                <p style={{ margin: 0, color: '#334155', lineHeight: 1.65 }}>
                  {t(`home.whyDifferent.points.${p.key}`)}
                </p>
              </div>
            ))}
            <Link href="/servicios" className="pa-btn pa-btn-primary" style={{ marginTop: 14 }}>
              {t('home.whyDifferent.cta')} <i className="bi bi-arrow-right" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}