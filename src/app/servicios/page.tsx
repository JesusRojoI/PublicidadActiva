'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { PRODUCTS } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useNotifications } from '@/context/NotificationContext';

export default function ServicesPage() {
  const { t, i18n } = useTranslation();
  const { addItem } = useCart();
  const { notify } = useNotifications();

  const handleHire = (p: (typeof PRODUCTS)[number]) => {
    addItem({
      id: p.sku,
      sku: p.sku,
      nameKey: p.nameKey,
      nameFallback: p.nameFallback,
      price: p.price,
      image: p.image,
    });
    notify(`${t('notifications.addedToCart')}: ${t(p.nameKey, p.nameFallback)}`, 'success', {
      label: t('cart.viewCart'),
      onClick: () => (window.location.href = '/carrito'),
    });
    setTimeout(() => {
      window.location.href = '/carrito';
    }, 500);
  };

  const featuresFor = (p: (typeof PRODUCTS)[number]): string[] => {
    const bundle = i18n.getResourceBundle(i18n.language, 'translation');
    const translated = bundle?.services?.features?.[p.sku];
    if (Array.isArray(translated) && translated.length > 0) return translated as string[];
    return p.featuresFallback || [];
  };

  return (
    <>
      <section className="pa-section" style={{ paddingBottom: 40 }}>
        <div className="pa-dot-grid" />
        <div className="pa-container pa-center pa-fadeup">
          <span className="pa-eyebrow">
            <i className="bi bi-grid-3x3-gap-fill" /> PublicidadActiva
          </span>
          <h1 className="pa-h1">{t('services.title')}</h1>
        </div>
      </section>

      {PRODUCTS.map((p, idx) => {
        const reverse = idx % 2 === 1;
        const features = featuresFor(p);
        return (
          <section
            className="pa-section"
            key={p.sku}
            style={{ paddingTop: 30, paddingBottom: 30 }}
          >
            <div className="pa-container">
              <div className={`pa-product-block ${reverse ? 'reverse' : ''}`}>
                <div>
                  <img
                    className="pa-product-img"
                    src={p.image}
                    alt={p.nameFallback}
                    loading="lazy"
                  />
                </div>
                <div>
                  <h2 className="pa-h2">{t(p.nameKey, p.nameFallback)}</h2>
                  <div className="pa-price">
                    ${p.price.toLocaleString('en-US')}.00 MXN + IVA{' '}
                    {p.priceSuffix ? (
                      <span style={{ fontSize: 16, color: 'var(--pa-muted)' }}>
                        {p.priceSuffix}
                      </span>
                    ) : null}
                  </div>
                  <div className="pa-sku">SKU: {p.sku}</div>

                  {features.length > 0 && (
                    <>
                      <div style={{ fontWeight: 700, marginBottom: 8 }}>
                        {t('services.includes')}
                      </div>
                      <ul className="pa-feature-list">
                        {features.map((f, i) => (
                          <li key={i}>{f}</li>
                        ))}
                      </ul>
                    </>
                  )}

                  <button
                    className="pa-btn pa-btn-primary"
                    onClick={() => handleHire(p)}
                    type="button"
                  >
                    {t('services.hire')} <i className="bi bi-cart-plus-fill" />
                  </button>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/* Custom design section */}
      <section
        className="pa-section"
        style={{ background: 'linear-gradient(135deg, #f5f3ff, #e0f2fe)' }}
      >
        <div className="pa-container">
          <div className="pa-center pa-fadeup">
            <h2 className="pa-h2">{t('services.customDesign.title')}</h2>
            <div className="pa-sku">SKU: CRE-C92OV9</div>
          </div>

          <div className="pa-product-block" style={{ paddingTop: 40 }}>
            <div>
              <img
                className="pa-product-img"
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=900&q=80"
                alt="Custom design"
              />
            </div>
            <div>
              <p className="pa-lead">{t('services.customDesign.description')}</p>

              <div
                className="pa-steps"
                style={{ gridTemplateColumns: 'repeat(2, 1fr)', marginTop: 30 }}
              >
                {[1, 2, 3, 4].map((n, i) => {
                  const icons = [
                    'bi-chat-dots-fill',
                    'bi-file-earmark-text-fill',
                    'bi-credit-card-2-front-fill',
                    'bi-telephone-inbound-fill',
                  ];
                  return (
                    <div className="pa-step" key={n}>
                      <div className="pa-step-icon">
                        <i className={`bi ${icons[i]}`} />
                      </div>
                      <div className="pa-step-num">{n}</div>
                      <p>{t(`services.customDesign.step${n}`)}</p>
                    </div>
                  );
                })}
              </div>

              <div
                className="pa-flex pa-gap-10"
                style={{ marginTop: 30, flexWrap: 'wrap' }}
              >
                <Link href="/contacto" className="pa-btn pa-btn-ghost">
                  {t('services.customDesign.quote')}
                </Link>
                <Link
                  href="/producto/diseno-personalizado"
                  className="pa-btn pa-btn-primary"
                >
                  {t('services.customDesign.pay')} <i className="bi bi-arrow-right" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}