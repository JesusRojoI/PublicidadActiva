'use client';

import { useTranslation } from 'react-i18next';

const IMAGES = [
  'https://images.unsplash.com/photo-1558655146-d09347e92766?w=900&q=80',
  'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=900&q=80',
  'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=900&q=80',
  'https://images.unsplash.com/photo-1626785774625-0b1c2c4eab67?w=900&q=80',
  'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=900&q=80',
];

export default function LatestDesigns() {
  const { t } = useTranslation();

  return (
    <section className="pa-section">
      <div className="pa-container">
        <div className="pa-center pa-fadeup">
          <h2 className="pa-h2">{t('home.latestDesigns.title')}</h2>
          <p className="pa-lead" style={{ margin: '10px auto 0' }}>
            {t('home.latestDesigns.description')}
          </p>
        </div>
        <div className="pa-collage">
          {IMAGES.map((src, i) => (
            <img key={i} src={src} alt={`Design ${i + 1}`} loading="lazy" />
          ))}
        </div>
      </div>
    </section>
  );
}