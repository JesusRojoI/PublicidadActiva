'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const SKILLS = [
  { key: 'branding', value: 100 },
  { key: 'interfaces', value: 100 },
  { key: 'webDev', value: 100 },
];

export default function Skills() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setVisible(true)),
      { threshold: 0.25 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="pa-ideas" ref={ref} style={{ background: 'linear-gradient(135deg, #fef3c7, #fce7f3 50%, #e0f2fe)' }}>
      <svg
        aria-hidden
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.35 }}
        viewBox="0 0 1200 500"
        preserveAspectRatio="xMidYMid slice"
      >
        {Array.from({ length: 30 }).map((_, i) => (
          <circle
            key={i}
            cx={(i * 137) % 1200}
            cy={(i * 91) % 500}
            r={2 + (i % 4)}
            fill={['#a78bfa', '#60a5fa', '#f9a8d4', '#86efac', '#fdba74'][i % 5]}
          />
        ))}
      </svg>

      <div className="pa-container" style={{ maxWidth: 900 }}>
        <h2 className="pa-h2">{t('home.skills.title')}</h2>
        <p className="pa-lead" style={{ margin: '10px auto 40px' }}>
          {t('home.skills.description')}
        </p>

        <div style={{ textAlign: 'left', maxWidth: 720, margin: '0 auto' }}>
          {SKILLS.map((s, i) => (
            <div className="pa-skill" key={s.key}>
              <div className="pa-skill-head">
                <span>{t(`home.skills.${s.key}`).split(':')[0]}</span>
                <span style={{ color: 'var(--pa-purple-deep)' }}>{s.value}%</span>
              </div>
              <div className="pa-skill-track">
                <div
                  className="pa-skill-fill"
                  style={{
                    width: visible ? `${s.value}%` : '0%',
                    transitionDelay: `${i * 0.2}s`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}