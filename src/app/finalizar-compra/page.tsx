'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useCart } from '@/context/CartContext';
import Modal from '@/components/Modal';

const COUNTRIES = [
  'México', 'Estados Unidos', 'Canadá', 'Argentina', 'Brasil', 'Chile', 'Colombia', 'Perú',
  'España', 'Francia', 'Alemania', 'Italia', 'Portugal', 'Reino Unido', 'Irlanda', 'Países Bajos',
  'Bélgica', 'Suiza', 'Austria', 'Suecia', 'Noruega', 'Dinamarca', 'Finlandia', 'Polonia',
  'Grecia', 'Turquía', 'Rusia', 'China', 'Japón', 'Corea del Sur', 'India', 'Australia',
  'Nueva Zelanda', 'Sudáfrica', 'Egipto', 'Marruecos', 'Nigeria', 'Kenia', 'Israel', 'Arabia Saudita',
  'Emiratos Árabes Unidos', 'Catar', 'Costa Rica', 'Panamá', 'Guatemala', 'Honduras', 'El Salvador',
  'Nicaragua', 'Cuba', 'República Dominicana',
];

const MX_STATES = [
  'Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche', 'Chiapas', 'Chihuahua',
  'Ciudad de México', 'Coahuila', 'Colima', 'Durango', 'Estado de México', 'Guanajuato', 'Guerrero',
  'Hidalgo', 'Jalisco', 'Michoacán', 'Morelos', 'Nayarit', 'Nuevo León', 'Oaxaca', 'Puebla',
  'Querétaro', 'Quintana Roo', 'San Luis Potosí', 'Sinaloa', 'Sonora', 'Tabasco', 'Tamaulipas',
  'Tlaxcala', 'Veracruz', 'Yucatán', 'Zacatecas',
];

export default function CheckoutPage() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { items, coupon, discountPercent, subtotal, discount, tax, total, removeCoupon, clearCart } = useCart();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    company: '',
    country: 'México',
    address: '',
    address2: '',
    address3: '',
    city: '',
    state: 'Ciudad de México',
    postalCode: '',
    phone: '',
    email: '',
    notes: '',
    cardName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<{ open: boolean; type: 'success' | 'error'; message: string }>({
    open: false,
    type: 'success',
    message: '',
  });
  const [couponOpen, setCouponOpen] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const { applyCoupon } = useCart();

  const set = (k: keyof typeof form, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = 'Required';
    if (!form.lastName.trim()) e.lastName = 'Required';
    if (!form.address.trim()) e.address = 'Required';
    if (!form.city.trim()) e.city = 'Required';
    if (!/^\d{5}$/.test(form.postalCode)) e.postalCode = '5 digits';
    if (!/^\d{10}$/.test(form.phone)) e.phone = '10 digits';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Invalid email';
    if (!form.cardName.trim()) e.cardName = 'Required';
    if (form.cardNumber.replace(/\s/g, '').length < 13) e.cardNumber = 'Invalid';
    if (!/^\d{2}\/\d{2}$/.test(form.cardExpiry)) e.cardExpiry = 'MM/AA';
    if (!/^\d{3,4}$/.test(form.cardCvc)) e.cardCvc = 'CVC';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (items.length === 0) {
      setModal({ open: true, type: 'error', message: t('notifications.paymentError') });
      return;
    }
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/process-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardName: form.cardName,
          cardNumber: form.cardNumber,
          cardExpiry: form.cardExpiry,
          cvv: form.cardCvc,
          amount: Number(total.toFixed(2)),
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          address: form.address,
          address2: form.address2,
          city: form.city,
          state: form.state,
          postalCode: form.postalCode,
          phone: form.phone,
          company: form.company,
        }),
      });
      const data = await res.json();

      if (data.success) {
        // Enviar email
        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'purchase',
            to: form.email,
            language: i18n.language,
            orderData: {
              nombre: `${form.firstName} ${form.lastName}`,
              productos: items.map((i) => ({
                nombre: t(i.nameKey, i.nameFallback),
                cantidad: i.quantity,
                precio: i.price,
              })),
              subtotal,
              descuento: discount,
              impuesto: tax,
              total,
              cupon: coupon,
              transactionId: data.transactionId,
            },
          }),
        });

        // Guardar resumen para la página de éxito
        if (typeof window !== 'undefined') {
          localStorage.setItem(
            'pa_last_order',
            JSON.stringify({
              name: `${form.firstName} ${form.lastName}`,
              email: form.email,
              items: items.map((i) => ({
                name: t(i.nameKey, i.nameFallback),
                price: i.price,
                quantity: i.quantity,
              })),
              subtotal,
              discount,
              tax,
              total,
              coupon,
              transactionId: data.transactionId,
            })
          );
        }

        clearCart();
        router.push('/compra-exitosa');
      } else {
        setModal({
          open: true,
          type: 'error',
          message: data.message || t('notifications.paymentError'),
        });
      }
    } catch {
      setModal({ open: true, type: 'error', message: t('notifications.paymentError') });
    } finally {
      setLoading(false);
    }
  };

  const applyCouponClick = () => {
    if (applyCoupon(couponInput)) {
      setCouponInput('');
      setCouponOpen(false);
    }
  };

  return (
    <section className="pa-section">
      <div className="pa-dot-grid" />
      <div className="pa-container">
        <h1 className="pa-h2" style={{ marginBottom: 26 }}>
          {t('checkout.title')}
        </h1>

        <div
          style={{
            background: '#fff',
            borderRadius: 14,
            padding: '16px 20px',
            boxShadow: 'var(--pa-shadow)',
            marginBottom: 26,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <span
            style={{ color: 'var(--pa-purple-deep)', cursor: 'pointer', fontWeight: 600 }}
            onClick={() => setCouponOpen((v) => !v)}
          >
            {t('checkout.couponPrompt')}
          </span>
          {couponOpen && (
            <div className="pa-flex pa-gap-10" style={{ flex: 1, maxWidth: 380 }}>
              <input
                className="pa-input"
                placeholder={t('cart.couponCode')}
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
              />
              <button className="pa-btn pa-btn-ghost" onClick={applyCouponClick} type="button">
                {t('cart.applyCoupon')}
              </button>
            </div>
          )}
        </div>

        <form onSubmit={onSubmit}>
          <div className="pa-checkout-grid">
            <div>
              <h3 className="pa-h3">{t('checkout.billing')}</h3>

              <div className="pa-grid-2">
                <div className="pa-field">
                  <label className="pa-label">{t('checkout.firstName')} *</label>
                  <input className="pa-input" value={form.firstName} onChange={(e) => set('firstName', e.target.value)} />
                  {errors.firstName && <div className="pa-error">{errors.firstName}</div>}
                </div>
                <div className="pa-field">
                  <label className="pa-label">{t('checkout.lastName')} *</label>
                  <input className="pa-input" value={form.lastName} onChange={(e) => set('lastName', e.target.value)} />
                  {errors.lastName && <div className="pa-error">{errors.lastName}</div>}
                </div>
              </div>

              <div className="pa-field">
                <label className="pa-label">{t('checkout.company')}</label>
                <input className="pa-input" value={form.company} onChange={(e) => set('company', e.target.value)} />
              </div>

              <div className="pa-field">
                <label className="pa-label">{t('checkout.country')} *</label>
                <select className="pa-select" value={form.country} onChange={(e) => set('country', e.target.value)}>
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pa-field">
                <label className="pa-label">{t('checkout.address')} *</label>
                <input className="pa-input" value={form.address} onChange={(e) => set('address', e.target.value)} />
                {errors.address && <div className="pa-error">{errors.address}</div>}
              </div>

              <div className="pa-field">
                <label className="pa-label">{t('checkout.address2')}</label>
                <input className="pa-input" value={form.address2} onChange={(e) => set('address2', e.target.value)} />
              </div>

              <div className="pa-field">
                <label className="pa-label">{t('checkout.address3')}</label>
                <input className="pa-input" value={form.address3} onChange={(e) => set('address3', e.target.value)} />
              </div>

              <div className="pa-grid-2">
                <div className="pa-field">
                  <label className="pa-label">{t('checkout.city')} *</label>
                  <input className="pa-input" value={form.city} onChange={(e) => set('city', e.target.value)} />
                  {errors.city && <div className="pa-error">{errors.city}</div>}
                </div>
                <div className="pa-field">
                  <label className="pa-label">{t('checkout.state')} *</label>
                  <select className="pa-select" value={form.state} onChange={(e) => set('state', e.target.value)}>
                    {MX_STATES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pa-grid-2">
                <div className="pa-field">
                  <label className="pa-label">{t('checkout.postalCode')} *</label>
                  <input
                    className="pa-input"
                    inputMode="numeric"
                    maxLength={5}
                    value={form.postalCode}
                    onChange={(e) => set('postalCode', e.target.value.replace(/\D/g, ''))}
                  />
                  {errors.postalCode && <div className="pa-error">{errors.postalCode}</div>}
                </div>
                <div className="pa-field">
                  <label className="pa-label">{t('checkout.phone')} *</label>
                  <input
                    className="pa-input"
                    inputMode="numeric"
                    maxLength={10}
                    value={form.phone}
                    onChange={(e) => set('phone', e.target.value.replace(/\D/g, ''))}
                  />
                  {errors.phone && <div className="pa-error">{errors.phone}</div>}
                </div>
              </div>

              <div className="pa-field">
                <label className="pa-label">{t('checkout.email')} *</label>
                <input
                  className="pa-input"
                  type="email"
                  value={form.email}
                  onChange={(e) => set('email', e.target.value)}
                />
                {errors.email && <div className="pa-error">{errors.email}</div>}
              </div>

              <div className="pa-field">
                <label className="pa-label">{t('checkout.additionalInfo')}</label>
                <label className="pa-label" style={{ fontWeight: 400, fontSize: 12 }}>
                  {t('checkout.orderNotes')}
                </label>
                <textarea
                  className="pa-textarea"
                  placeholder={t('checkout.orderNotesPlaceholder')}
                  value={form.notes}
                  onChange={(e) => set('notes', e.target.value)}
                />
              </div>

              <div className="pa-card-panel">
                <h3 className="pa-h3">{t('checkout.creditCard')}</h3>
                <div className="pa-card-logos">
                  <img src="/visa.svg" alt="Visa" />
                  <img src="/mastercard.svg" alt="Mastercard" />
                  <img src="/etomin.svg" alt="Etomin" />
                </div>

                <h4 style={{ margin: '14px 0 12px', fontWeight: 600 }}>{t('checkout.enterCardData')}</h4>

                <div className="pa-field">
                  <label className="pa-label">{t('checkout.cardName')} *</label>
                  <input className="pa-input" value={form.cardName} onChange={(e) => set('cardName', e.target.value)} />
                  {errors.cardName && <div className="pa-error">{errors.cardName}</div>}
                </div>

                <div className="pa-field">
                  <label className="pa-label">{t('checkout.cardNumber')} *</label>
                  <input
                    className="pa-input"
                    inputMode="numeric"
                    maxLength={19}
                    placeholder="0000 0000 0000 0000"
                    value={form.cardNumber}
                    onChange={(e) =>
                      set(
                        'cardNumber',
                        e.target.value
                          .replace(/\D/g, '')
                          .replace(/(\d{4})(?=\d)/g, '$1 ')
                          .slice(0, 19)
                      )
                    }
                  />
                  {errors.cardNumber && <div className="pa-error">{errors.cardNumber}</div>}
                </div>

                <div className="pa-grid-2">
                  <div className="pa-field">
                    <label className="pa-label">{t('checkout.expiry')} *</label>
                    <input
                      className="pa-input"
                      placeholder="MM/AA"
                      maxLength={5}
                      value={form.cardExpiry}
                      onChange={(e) => {
                        let v = e.target.value.replace(/\D/g, '').slice(0, 4);
                        if (v.length > 2) v = `${v.slice(0, 2)}/${v.slice(2)}`;
                        set('cardExpiry', v);
                      }}
                    />
                    {errors.cardExpiry && <div className="pa-error">{errors.cardExpiry}</div>}
                  </div>
                  <div className="pa-field">
                    <label className="pa-label">{t('checkout.cvc')} *</label>
                    <input
                      className="pa-input"
                      type="password"
                      maxLength={4}
                      value={form.cardCvc}
                      onChange={(e) => set('cardCvc', e.target.value.replace(/\D/g, ''))}
                    />
                    {errors.cardCvc && <div className="pa-error">{errors.cardCvc}</div>}
                  </div>
                </div>

                <div className="pa-flex pa-gap-10" style={{ alignItems: 'center' }}>
                  <img src="/secure.svg" alt="Secure" style={{ height: 30 }} />
                </div>

                <div className="pa-privacy">
                  <i className="bi bi-shield-lock-fill" style={{ color: 'var(--pa-purple-deep)', fontSize: 18 }} />
                  <span>
                    {t('checkout.privacyText')}{' '}
                    <a href="/politica-privacidad">{t('checkout.privacyLink')}</a>.
                  </span>
                </div>

                <button
                  className="pa-btn pa-btn-primary"
                  type="submit"
                  disabled={loading}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  {loading ? <i className="bi bi-arrow-repeat" /> : <i className="bi bi-lock-fill" />}
                  {t('checkout.placeOrder')}
                </button>
              </div>
            </div>

            <aside className="pa-summary">
              <h3>{t('checkout.yourOrder')}</h3>
              {items.map((it) => (
                <div className="pa-summary-row" key={it.id}>
                  <span>
                    {t(it.nameKey, it.nameFallback)} × {it.quantity}
                  </span>
                  <span>
                    $
                    {(it.price * it.quantity).toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              ))}
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
                <span>${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
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
            </aside>
          </div>
        </form>
      </div>

      <Modal
        open={modal.open}
        onClose={() => setModal({ ...modal, open: false })}
        title={modal.type === 'success' ? '✓' : '✕'}
        message={modal.message}
        type={modal.type}
      />
    </section>
  );
}