'use client';

import { useTranslation } from 'react-i18next';

export default function Ideas() {
  const { t } = useTranslation();

  return (
    <section className="pa-ideas">
      {/* Vectorized curve pattern */}
      <svg
        aria-hidden
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.5 }}
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 1200 400"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="lineGrad1" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="lineGrad2" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#f9a8d4" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#fde68a" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        {Array.from({ length: 8 }).map((_, i) => (
          <path
            key={i}
            d={`M -50 ${60 + i * 40} Q 300 ${-40 + i * 30} 600 ${140 + i * 20} T 1250 ${60 + i * 30}`}
            stroke={i % 2 === 0 ? 'url(#lineGrad1)' : 'url(#lineGrad2)'}
            strokeWidth={1.6}
            fill="none"
          />
        ))}
        {Array.from({ length: 20 }).map((_, i) => (
          <circle
            key={`c-${i}`}
            cx={60 + i * 60}
            cy={40 + (i % 5) * 70}
            r={3}
            fill={i % 3 === 0 ? '#7c3aed' : i % 3 === 1 ? '#f9a8d4' : '#60a5fa'}
            opacity={0.6}
          />
        ))}
      </svg>

      <div className="pa-container">
        <h2 className="pa-h2 pa-fadeup">{t('home.ideas.title')}</h2>
        <p className="pa-lead" style={{ margin: '18px auto 0' }}>
          {t('home.ideas.description')}
        </p>
      </div>
    </section>
  );
}