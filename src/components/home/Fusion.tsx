'use client';

import { useTranslation } from 'react-i18next';

export default function Fusion() {
  const { t } = useTranslation();

  return (
    <section className="pa-fusion">
      <div
        className="pa-fusion-bg"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1559028012-481c04fa702d?w=1600&q=80)',
        }}
      />
      <div className="pa-fusion-inner pa-fadeup">
        <i className="bi bi-quote" style={{ fontSize: 48, opacity: 0.6 }} />
        <h2>{t('home.fusion')}</h2>
      </div>
    </section>
  );
}