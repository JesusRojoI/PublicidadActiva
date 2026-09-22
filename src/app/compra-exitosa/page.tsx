'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface LastOrder {
  name: string;
  email: string;
  items: { name: string; price: number; quantity: number }[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  coupon: string | null;
  transactionId: string;
}

export default function SuccessPage() {
  const { t } = useTranslation();
  const [order, setOrder] = useState<LastOrder | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('pa_last_order');
      if (raw) setOrder(JSON.parse(raw));
    } catch {}
  }, []);

  const fmt = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <section className="pa-section">
      <div className="pa-blob" style={{ width: 340, height: 340, background: 'var(--pa-green)', top: -60, left: -80 }} />
      <div className="pa-blob" style={{ width: 260, height: 260, background: 'var(--pa-cyan)', bottom: -60, right: -60 }} />

      <div className="pa-container">
        <div className="pa-success-hero pa-fadeup">
          <div className="pa-success-icon">
            <i className="bi bi-check2" />
          </div>
          <h1 className="pa-h1">{t('success.title')}</h1>
          <p className="pa-lead" style={{ margin: '12px auto 0' }}>
            {t('success.subtitle')}
          </p>
        </div>

        {order && (
          <div className="pa-summary-card pa-fadeup">
            <h3 className="pa-h3" style={{ marginBottom: 20 }}>
              {t('success.orderSummary')}
            </h3>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontWeight: 700 }}>{order.name}</div>
              <div style={{ color: 'var(--pa-muted)', fontSize: 14 }}>{order.email}</div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 20 }}>
              <tbody>
                {order.items.map((it, i) => (
                  <tr key={i} style={{ borderBottom: '1px dashed rgba(148,163,184,0.25)' }}>
                    <td style={{ padding: '10px 0' }}>
                      {it.name} × {it.quantity}
                    </td>
                    <td style={{ padding: '10px 0', textAlign: 'right', fontWeight: 600 }}>
                      ${fmt(it.price * it.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pa-summary-row">
              <span>{t('cart.subtotalLabel')}</span>
              <span>${fmt(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="pa-summary-row discount">
                <span>
                  {t('cart.coupon')} {order.coupon}
                </span>
                <span>−${fmt(order.discount)}</span>
              </div>
            )}
            <div className="pa-summary-row">
              <span>{t('cart.iva')}</span>
              <span>${fmt(order.tax)}</span>
            </div>
            <div className="pa-summary-row total">
              <span>{t('cart.total')}</span>
              <span>${fmt(order.total)} MXN</span>
            </div>

            {order.transactionId && (
              <p style={{ marginTop: 18, color: 'var(--pa-muted)', fontSize: 13 }}>
                <strong>{t('success.transaction')}</strong> {order.transactionId}
              </p>
            )}
          </div>
        )}

        <div className="pa-center">
          <Link href="/servicios" className="pa-btn pa-btn-primary">
            {t('success.continueShopping')} <i className="bi bi-arrow-right" />
          </Link>
        </div>
      </div>
    </section>
  );
}