'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from '@/components/Modal';

interface Errors {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

export default function ContactSection() {
  const { t, i18n } = useTranslation();
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<{ open: boolean; type: 'success' | 'error' }>({
    open: false,
    type: 'success',
  });

  const validate = (): boolean => {
    const e: Errors = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Invalid email';
    if (!/^\d{10}$/.test(form.phone)) e.phone = '10 digits';
    if (!form.message.trim()) e.message = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'contact',
          to: form.email,
          name: form.name,
          company: '',
          email: form.email,
          phone: form.phone,
          message: form.message,
          language: i18n.language,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setModal({ open: true, type: 'success' });
        setForm({ name: '', email: '', phone: '', message: '' });
      } else {
        setModal({ open: true, type: 'error' });
      }
    } catch {
      setModal({ open: true, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="pa-section" id="contacto">
      <div className="pa-blob" style={{ width: 280, height: 280, background: 'var(--pa-cyan)', top: 40, right: -80 }} />
      <div className="pa-container" style={{ maxWidth: 780 }}>
        <div className="pa-center pa-fadeup">
          <h2 className="pa-h2">{t('home.contact.title')}</h2>
          <p className="pa-lead" style={{ margin: '12px auto 40px' }}>
            {t('home.contact.description')}
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          style={{ background: '#fff', padding: 36, borderRadius: 22, boxShadow: 'var(--pa-shadow)' }}
        >
          <div className="pa-grid-2">
            <div className="pa-field">
              <label className="pa-label">{t('home.contact.form.name')} *</label>
              <input
                className="pa-input"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              {errors.name && <div className="pa-error">{errors.name}</div>}
            </div>
            <div className="pa-field">
              <label className="pa-label">{t('home.contact.form.email')} *</label>
              <input
                className="pa-input"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              {errors.email && <div className="pa-error">{errors.email}</div>}
            </div>
          </div>
          <div className="pa-field">
            <label className="pa-label">{t('home.contact.form.phone')} *</label>
            <input
              className="pa-input"
              inputMode="numeric"
              maxLength={10}
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, '') })}
            />
            {errors.phone && <div className="pa-error">{errors.phone}</div>}
          </div>
          <div className="pa-field">
            <label className="pa-label">{t('home.contact.form.message')} *</label>
            <textarea
              className="pa-textarea"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
            {errors.message && <div className="pa-error">{errors.message}</div>}
          </div>

          <button className="pa-btn pa-btn-primary" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
            {loading ? <i className="bi bi-arrow-repeat" /> : <i className="bi bi-send-fill" />}
            {t('home.contact.form.submit')}
          </button>
        </form>
      </div>

      <Modal
        open={modal.open}
        onClose={() => setModal({ ...modal, open: false })}
        title={modal.type === 'success' ? '✓' : '✕'}
        message={
          modal.type === 'success'
            ? t('notifications.formSuccess')
            : t('notifications.formError')
        }
        type={modal.type}
      />
    </section>
  );
}