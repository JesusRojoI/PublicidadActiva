'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="pa-footer">
      <div className="pa-footer-inner">
        <div className="pa-footer-col">
          <Image src="/logo.svg" alt="PublicidadActiva" width={150} height={54} className="pa-footer-logo" />
          <p>
            <a href="mailto:atencion@publicidadactiva.com.mx">atencion@publicidadactiva.com.mx</a>
          </p>
          <p>{t('footer.address')}</p>
          <p style={{ marginTop: 14 }}>
            <a href="tel:+525553102465">{t('footer.phone')}</a>
          </p>
        </div>

        <div className="pa-footer-col">
          <h4>Legal</h4>
          <div className="pa-footer-links">
            <Link href="/politica-privacidad">{t('footer.privacy')}</Link>
            <Link href="/terminos-y-condiciones">{t('footer.terms')}</Link>
            <Link href="/politica-de-devoluciones-y-reembolsos">{t('footer.refund')}</Link>
          </div>
        </div>

        <div className="pa-footer-col">
          <h4>{t('footer.tagline')}</h4>
          <div className="pa-footer-cards">
            <Image src="/mastercard.svg" alt="Mastercard" width={60} height={34} />
            <Image src="/visa.svg" alt="Visa" width={60} height={34} />
          </div>
        </div>
      </div>
      <div className="pa-footer-bottom">
        © {year} {t('footer.rights')}
      </div>
    </footer>
  );
}