'use client';

import { useTranslation } from 'react-i18next';
import CouponGame from './CouponGame';

const CARDS = [
  {
    key: 'uxResearch',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=900&q=80',
  },
  {
    key: 'brandIdentity',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=900&q=80',
  },
  {
    key: 'webDevelopment',
    image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=900&q=80',
  },
  {
    key: 'businessStrategy',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=900&q=80',
  },
  {
    key: 'webDesign',
    image: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=900&q=80',
  },
  {
    key: 'photography',
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=900&q=80',
  },
];

export default function WhatWeDo() {
  const { t } = useTranslation();

  return (
    <section className="pa-section" id="servicios">
      <div className="pa-dot-grid" />
      <div className="pa-container">
        <div className="pa-center pa-fadeup">
          <h2 className="pa-h2">{t('home.whatWeDo.title')}</h2>
        </div>

        <div className="pa-service-grid">
          {CARDS.map((c) => (
            <article
              key={c.key}
              className="pa-service-card"
              style={{ backgroundImage: `url(${c.image})` }}
            >
              <h3>{t(`home.whatWeDo.services.${c.key}.title`)}</h3>
              <p>{t(`home.whatWeDo.services.${c.key}.description`)}</p>
            </article>
          ))}
        </div>

        <CouponGame />
      </div>
    </section>
  );
}