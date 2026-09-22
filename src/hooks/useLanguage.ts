'use client';

import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

export function useLanguage() {
  const { i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const changeLanguage = (lang: 'es' | 'en') => {
    i18n.changeLanguage(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('lang', lang);
      window.dispatchEvent(new Event('languageChange'));
    }
  };

  const toggleLanguage = () => {
    const next = i18n.language === 'es' ? 'en' : 'es';
    changeLanguage(next);
  };

  return {
    language: mounted ? i18n.language : 'es',
    changeLanguage,
    toggleLanguage,
    mounted,
  };
}