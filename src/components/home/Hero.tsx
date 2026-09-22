'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';

export default function Hero() {
  const { t } = useTranslation();

  return (
    <section className="pa-hero" id="inicio">
      <div className="pa-blob" style={{ width: 380, height: 380, background: 'var(--pa-purple)', top: -60, left: -80 }} />
      <div className="pa-blob" style={{ width: 320, height: 320, background: 'var(--pa-pink)', bottom: -100, right: '30%', animationDelay: '3s' }} />
      <div className="pa-blob" style={{ width: 260, height: 260, background: 'var(--pa-cyan)', top: '40%', right: -60, animationDelay: '6s' }} />

      <div className="pa-hero-grid">
        <div className="pa-fadeup">
          <span className="pa-eyebrow">
            <i className="bi bi-stars" /> {t('home.hero.subtitle')}
          </span>
          <h1 className="pa-h1">{t('home.hero.title')}</h1>
          <p className="pa-lead">{t('home.hero.description')}</p>
          <div style={{ marginTop: 32 }}>
            <Link href="/servicios" className="pa-btn pa-btn-primary">
              {t('home.hero.cta')} <i className="bi bi-arrow-right" />
            </Link>
          </div>
        </div>

        <div className="pa-hero-visual pa-fadein">
          <div className="ring r1" />
          <div className="ring r2" />
          <img
            className="main"
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&q=80"
            alt="Creative team"
          />
          <div className="badge b1"><i className="bi bi-palette-fill" /> Design</div>
          <div className="badge b2"><i className="bi bi-lightbulb-fill" /> Ideas</div>
          <div className="badge b3"><i className="bi bi-graph-up-arrow" /> Growth</div>
        </div>
      </div>
    </section>
  );
}