'use client';

import { useTranslation } from 'react-i18next';

export default function RefundPage() {
  const { t } = useTranslation();
  return (
    <section className="pa-section">
      <div className="pa-container">
        <div className="pa-legal">
          <i className="bi bi-arrow-repeat" />
          <h1 className="pa-h2">{t('legal.refund')}</h1>
          <p className="pa-lead" style={{ margin: '20px auto 0' }}>
            {t('legal.comingSoon')}
          </p>
        </div>
      </div>
    </section>
  );
}