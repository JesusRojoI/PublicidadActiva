'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCart, CartItem } from '@/context/CartContext';
import { useNotifications } from '@/context/NotificationContext';

export default function CartPage() {
  const { t } = useTranslation();
  const {
    items,
    removeItem,
    restoreItem,
    updateQuantity,
    coupon,
    applyCoupon,
    removeCoupon,
    subtotal,
    discount,
    tax,
    total,
    discountPercent,
  } = useCart();
  const { notify } = useNotifications();
  const [couponInput, setCouponInput] = useState('');

  const handleRemove = (item: CartItem) => {
    removeItem(item.id);
    notify(`${item.nameFallback} ${t('cart.removedMessage')}`, 'info', {
      label: t('cart.undo'),
      onClick: () => restoreItem(item),
    });
  };

  const handleApplyCoupon = () => {
    if (!couponInput.trim()) return;
    const ok = applyCoupon(couponInput.trim());
    if (ok) {
      notify(t('notifications.couponApplied'), 'success');
      setCouponInput('');
    } else {
      notify(t('notifications.couponInvalid'), 'error');
    }
  };

  return (
    <section className="pa-section">
      <div className="pa-dot-grid" />
      <div className="pa-container">
        <h1 className="pa-h2" style={{ marginBottom: 34 }}>
          {t('cart.title')}
        </h1>

        {items.length === 0 ? (
          <div className="pa-center" style={{ padding: '60px 20px' }}>
            <i className="bi bi-cart-x" style={{ fontSize: 72, color: 'var(--pa-muted)' }} />
            <h3 className="pa-h3" style={{ marginTop: 20 }}>
              {t('cart.title')} — 0
            </h3>
            <Link href="/servicios" className="pa-btn pa-btn-primary" style={{ marginTop: 20 }}>
              {t('services.title')} <i className="bi bi-arrow-right" />
            </Link>
          </div>
        ) : (
          <div className="pa-cart-layout">
            <div>
              <table className="pa-cart-table">
                <thead>
                  <tr>
                    <th style={{ width: 50 }}>{t('cart.remove')}</th>
                    <th style={{ width: 80 }}>{t('cart.thumbnail')}</th>
                    <th>{t('cart.product')}</th>
                    <th>{t('cart.price')}</th>
                    <th>{t('cart.quantity')}</th>
                    <th style={{ textAlign: 'right' }}>{t('cart.subtotal')}</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it) => (
                    <tr key={it.id}>
                      <td>
                        <button
                          className="pa-cart-remove"
                          onClick={() => handleRemove(it)}
                          aria-label="remove"
                          type="button"
                        >
                          <i className="bi bi-x-circle" />
                        </button>
                      </td>
                      <td>
                        <img className="pa-cart-thumb" src={it.image} alt={it.nameFallback} />
                      </td>
                      <td>{String(t(it.nameKey, it.nameFallback))}</td>
                      <td>${it.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      <td>
                        <div className="pa-qty">
                          <button
                            onClick={() => updateQuantity(it.id, it.quantity - 1)}
                            type="button"
                            aria-label="decrease"
                          >
                            −
                          </button>
                          <span>{it.quantity}</span>
                          <button
                            onClick={() => updateQuantity(it.id, it.quantity + 1)}
                            type="button"
                            aria-label="increase"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--pa-purple-deep)' }}>
                        $
                        {(it.price * it.quantity).toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <aside className="pa-summary">
              <h3>{t('cart.cartTotal')}</h3>

              <div style={{ marginBottom: 16 }}>
                <label className="pa-label">{t('cart.coupon')}</label>
                <div className="pa-coupon-box">
                  <input
                    className="pa-input"
                    placeholder={t('cart.couponCode')}
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                  />
                  <button className="pa-btn pa-btn-ghost" onClick={handleApplyCoupon} type="button">
                    {t('cart.applyCoupon')}
                  </button>
                </div>
              </div>

              {coupon && (
                <div className="pa-coupon-applied">
                  <span>
                    <i className="bi bi-tag-fill" /> {coupon} −{discountPercent}%
                  </span>
                  <button onClick={removeCoupon} type="button">
                    {t('cart.removeLink')}
                  </button>
                </div>
              )}

              <div className="pa-summary-row">
                <span>{t('cart.subtotalLabel')}</span>
                <span>${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              {discount > 0 && (
                <div className="pa-summary-row discount">
                  <span>
                    {t('cart.coupon')} {coupon}
                  </span>
                  <span>
                    −$
                    {discount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              )}
              <div className="pa-summary-row">
                <span>{t('cart.iva')}</span>
                <span>${tax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="pa-summary-row total">
                <span>{t('cart.total')}</span>
                <span>${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN</span>
              </div>

              <Link
                href="/finalizar-compra"
                className="pa-btn pa-btn-primary"
                style={{ width: '100%', justifyContent: 'center', marginTop: 20 }}
              >
                {t('cart.checkout')} <i className="bi bi-arrow-right" />
              </Link>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}