'use client';

import { useTranslation } from 'react-i18next';

export default function Awarded() {
  const { t } = useTranslation();

  return (
    <section className="pa-section">
      <div className="pa-container">
        <div className="pa-awarded-grid">
          <div className="pa-fadeup">
            <span className="pa-eyebrow">
              <i className="bi bi-trophy-fill" /> Award
            </span>
            <h2 className="pa-h2">{t('home.awarded.title')}</h2>
            <p className="pa-lead">{t('home.awarded.description')}</p>

            <div style={{ marginTop: 26 }}>
              <p style={{ color: '#334155', lineHeight: 1.7, marginBottom: 12 }}>
                <strong style={{ color: 'var(--pa-purple-deep)' }}>●</strong> {t('home.awarded.product')}
              </p>
              <p style={{ color: '#334155', lineHeight: 1.7 }}>
                <strong style={{ color: 'var(--pa-purple-deep)' }}>●</strong> {t('home.awarded.branding')}
              </p>
            </div>

            <div style={{ marginTop: 26 }}>
              <span className="pa-tag"><i className="bi bi-box-seam" /> {t('home.awarded.tags.product')}</span>
              <span className="pa-tag"><i className="bi bi-brush" /> {t('home.awarded.tags.branding')}</span>
            </div>
          </div>

          <div className="pa-diamond pa-fadein">
            <img src="https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&q=80" alt="Awarded design" />
            <img src="https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800&q=80" alt="Awarded design 2" />
          </div>
        </div>
      </div>
    </section>
  );
}