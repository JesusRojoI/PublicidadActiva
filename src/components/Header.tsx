'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/hooks/useLanguage';

export default function Header() {
  const { t } = useTranslation();
  const { language, toggleLanguage, mounted } = useLanguage();
  const { itemCount } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handler = () => setMobileOpen(false);
    window.addEventListener('languageChange', handler);
    return () => window.removeEventListener('languageChange', handler);
  }, []);

  const isEs = !mounted || language === 'es';

  return (
    <header className={`pa-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="pa-header-inner">
        <Link href="/" className="pa-logo-wrap" aria-label="PublicidadActiva home">
          <Image src="/logo.svg" alt="PublicidadActiva" width={130} height={44} priority />
        </Link>

        <nav className="pa-nav" aria-label="Main">
          <Link href="/" className="pa-nav-link">
            {t('header.home')}
          </Link>
          <Link href="/servicios" className="pa-nav-link">
            {t('header.services')}
          </Link>
          <Link href="/contacto" className="pa-nav-link">
            {t('header.contact')}
          </Link>
        </nav>

        <div className="pa-flex pa-gap-10" style={{ alignItems: 'center' }}>
          <button
            className="pa-lang-btn"
            onClick={toggleLanguage}
            aria-label="Change language"
            type="button"
          >
            {isEs ? (
              <svg className="w-12 h-12" enableBackground="new 0 0 512 512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                <circle cx="256" cy="256" fill="#f0f0f0" r="256" />
                <path d="m512 256c0-101.494-59.065-189.19-144.696-230.598v461.195c85.631-41.407 144.696-129.103 144.696-230.597z" fill="#d80027" />
                <g fill="#6da544">
                  <path d="m0 256c0 101.494 59.065 189.19 144.696 230.598v-461.196c-85.631 41.408-144.696 129.104-144.696 230.598z" />
                  <path d="m189.217 256c0 36.883 29.9 66.783 66.783 66.783s66.783-29.9 66.783-66.783v-22.261h-133.566z" />
                </g>
                <path d="m345.043 211.478h-66.783c0-12.294-9.967-22.261-22.261-22.261s-22.261 9.967-22.261 22.261h-66.783c0 12.295 10.709 22.261 23.002 22.261h-.741c0 12.295 9.966 22.261 22.261 22.261 0 12.295 9.966 22.261 22.261 22.261h44.522c12.295 0 22.261-9.966 22.261-22.261 12.295 0 22.261-9.966 22.261-22.261h-.742c12.295 0 23.003-9.966 23.003-22.261z" fill="#ff9811" />
              </svg>
            ) : (
              <svg className="w-12 h-12" enableBackground="new 0 0 512 512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                <circle cx="256" cy="256" fill="#f0f0f0" r="256" />
                <g fill="#d80027">
                  <path d="m244.87 256h267.13c0-23.106-3.08-45.49-8.819-66.783h-258.311z" />
                  <path d="m244.87 122.435h229.556c-15.671-25.572-35.708-48.175-59.07-66.783h-170.486z" />
                  <path d="m256 512c60.249 0 115.626-20.824 159.356-55.652h-318.712c43.73 34.828 99.107 55.652 159.356 55.652z" />
                  <path d="m37.574 389.565h436.852c12.581-20.529 22.338-42.969 28.755-66.783h-494.362c6.417 23.814 16.174 46.254 28.755 66.783z" />
                </g>
                <path d="m118.584 39.978h23.329l-21.7 15.765 8.289 25.509-21.699-15.765-21.699 15.765 7.16-22.037c-19.106 15.915-35.852 34.561-49.652 55.337h7.475l-13.813 10.035c-2.152 3.59-4.216 7.237-6.194 10.938l6.596 20.301-12.306-8.941c-3.059 6.481-5.857 13.108-8.372 19.873l7.267 22.368h26.822l-21.7 15.765 8.289 25.509-21.699-15.765-12.998 9.444c-1.301 10.458-1.979 21.11-1.979 31.921h256c0-141.384 0-158.052 0-256-50.572 0-97.715 14.67-137.416 39.978zm9.918 190.422-21.699-15.765-21.699 15.765 8.289-25.509-21.7-15.765h26.822l8.288-25.509 8.288 25.509h26.822l-21.7 15.765zm-8.289-100.083 8.289 25.509-21.699-15.765-21.699 15.765 8.289-25.509-21.7-15.765h26.822l8.288-25.509 8.288 25.509h26.822zm100.115 100.083-21.699-15.765-21.699 15.765 8.289-25.509-21.7-15.765h26.822l8.288-25.509 8.288 25.509h26.822l-21.7 15.765zm-8.289-100.083 8.289 25.509-21.699-15.765-21.699 15.765 8.289-25.509-21.7-15.765h26.822l8.288-25.509 8.288 25.509h26.822zm0-74.574 8.289 25.509-21.699-15.765-21.699 15.765 8.289-25.509-21.7-15.765h26.822l8.288-25.509 8.288 25.509h26.822z" fill="#0052b4" />
              </svg>
            )}
            <span>{isEs ? 'Español' : 'English'}</span>
          </button>

          <Link href="/carrito" className="pa-cart-btn" aria-label={t('header.cart')}>
            <i className="bi bi-cart3" aria-hidden />
            {itemCount > 0 && <span className="pa-cart-count">{itemCount}</span>}
          </Link>

          <button
            className="pa-burger"
            type="button"
            aria-label="Menu"
            onClick={() => setMobileOpen((v) => !v)}
          >
            <i className={`bi ${mobileOpen ? 'bi-x-lg' : 'bi-list'}`} />
          </button>
        </div>
      </div>

      <div className={`pa-mobile-nav ${mobileOpen ? 'open' : ''}`}>
        <Link href="/" className="pa-nav-link" onClick={() => setMobileOpen(false)}>
          {t('header.home')}
        </Link>
        <Link href="/servicios" className="pa-nav-link" onClick={() => setMobileOpen(false)}>
          {t('header.services')}
        </Link>
        <Link href="/contacto" className="pa-nav-link" onClick={() => setMobileOpen(false)}>
          {t('header.contact')}
        </Link>
      </div>
    </header>
  );
}