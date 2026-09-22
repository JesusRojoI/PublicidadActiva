'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { useCart, VALID_COUPONS } from '@/context/CartContext';
import { useNotifications } from '@/context/NotificationContext';

const CODES = Object.keys(VALID_COUPONS);

interface CardData {
  code: string;
  percent: number;
  revealed: boolean;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function CouponGame() {
  const { t } = useTranslation();
  const { applyCoupon, coupon, itemCount } = useCart();
  const { notify } = useNotifications();
  const [cards, setCards] = useState<CardData[]>([]);
  const [alreadyUsed, setAlreadyUsed] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const used = typeof window !== 'undefined' ? localStorage.getItem('pa_coupon_used') : null;
    if (used === '1') setAlreadyUsed(true);
  }, []);

  useEffect(() => {
    if (coupon) setAlreadyUsed(true);
  }, [coupon]);

  const start = () => {
    if (alreadyUsed) {
      notify(t('notifications.couponAlreadyUsed'), 'error');
      return;
    }
    const shuffled = shuffle(CODES).map((code) => ({
      code,
      percent: VALID_COUPONS[code],
      revealed: false,
    }));
    setCards(shuffled);
    setStarted(true);
  };

  const flip = (index: number) => {
    if (alreadyUsed) return;
    setCards((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], revealed: true };
      return next;
    });

    const picked = cards[index];
    const ok = applyCoupon(picked.code);
    if (ok) {
      localStorage.setItem('pa_coupon_used', '1');
      setAlreadyUsed(true);
      const message = `${t('cart.appliedCoupon')} -${picked.percent}%`;
      notify(
        message,
        'success',
        itemCount > 0
          ? {
              label: t('cart.viewCart'),
              onClick: () => {
                window.location.href = '/carrito';
              },
            }
          : undefined,
        8000
      );
    } else {
      notify(t('notifications.couponInvalid'), 'error');
    }
  };

  return (
    <div className="pa-center" style={{ marginTop: 70 }}>
      <h3 className="pa-h3">{t('home.whatWeDo.couponButton')}</h3>
      <p className="pa-lead" style={{ margin: '10px auto 0' }}>
        {alreadyUsed ? t('notifications.couponAlreadyUsed') : ''}
      </p>

      {!started && (
        <button className="pa-btn pa-btn-primary" style={{ marginTop: 24 }} onClick={start} type="button">
          {t('home.whatWeDo.couponButton')} <i className="bi bi-gift-fill" />
        </button>
      )}

      {started && (
        <div className="pa-coupon-stage">
          {cards.map((c, i) => (
            <div
              key={i}
              className={`pa-flip-card ${c.revealed ? 'flipped' : ''} ${alreadyUsed && !c.revealed ? 'disabled' : ''}`}
              onClick={() => !c.revealed && !alreadyUsed && flip(i)}
            >
              <div className="pa-flip-inner">
                <div className="pa-flip-face pa-flip-front">
                  <Image src="/logo.svg" alt="PublicidadActiva" width={80} height={58} />
                  <span>PublicidadActiva</span>
                </div>
                <div className="pa-flip-face pa-flip-back">
                  <div className="pct">-{c.percent}%</div>
                  <div className="lbl">{t('cart.couponCode')}</div>
                  <div className="code">{c.code}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}