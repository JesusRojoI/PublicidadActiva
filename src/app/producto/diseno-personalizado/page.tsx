'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useNotifications } from '@/context/NotificationContext';

export default function CustomDesignPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { addItem } = useCart();
  const { notify } = useNotifications();

  const [proposalNumber, setProposalNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [errors, setErrors] = useState<{ proposalNumber?: string; amount?: string }>({});

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: typeof errors = {};
    if (!proposalNumber.trim()) errs.proposalNumber = 'Required';
    const num = parseFloat(amount);
    if (!amount || isNaN(num) || num <= 0) errs.amount = 'Must be > 0.00';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    addItem({
      id: `custom-${proposalNumber}-${Date.now()}`,
      sku: `CUSTOM-${proposalNumber}`,
      nameKey: 'product.customDesign.title',
      nameFallback: `${t('product.customDesign.title')} #${proposalNumber}`,
      price: Math.round(num * 100) / 100,
      isCustom: true,
      customData: { proposalNumber },
      image:
        'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&q=80',
    });
    notify(t('notifications.addedToCart'), 'success');
    router.push('/carrito');
  };

  return (
    <section className="pa-section">
      <div className="pa-blob" style={{ width: 300, height: 300, background: 'var(--pa-purple)', top: -40, right: -80 }} />
      <div className="pa-container">
        <div className="pa-product-block reverse">
          <div>
            <img
              className="pa-product-img"
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=900&q=80"
              alt="Custom design"
            />
          </div>
          <div>
            <h1 className="pa-h2">{t('product.customDesign.title')}</h1>
            <p className="pa-lead" style={{ marginBottom: 26 }}>
              {t('product.customDesign.description')}
            </p>

            <form onSubmit={onSubmit}>
              <div className="pa-field">
                <label className="pa-label">{t('product.customDesign.proposalNumber')} *</label>
                <input
                  className="pa-input"
                  value={proposalNumber}
                  onChange={(e) => setProposalNumber(e.target.value)}
                />
                {errors.proposalNumber && <div className="pa-error">{errors.proposalNumber}</div>}
              </div>
              <div className="pa-field">
                <label className="pa-label">{t('product.customDesign.proposalAmount')} *</label>
                <input
                  className="pa-input"
                  inputMode="decimal"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ''))}
                  placeholder="0.00"
                />
                {errors.amount && <div className="pa-error">{errors.amount}</div>}
              </div>
              <button className="pa-btn pa-btn-primary" type="submit">
                {t('product.customDesign.addToCart')} <i className="bi bi-cart-plus-fill" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}