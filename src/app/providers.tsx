'use client';

import { CartProvider } from '@/context/CartContext';
import { NotificationProvider } from '@/context/NotificationContext';
import I18nProvider from '@/i18n/I18nProvider';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <NotificationProvider>
        <CartProvider>{children}</CartProvider>
      </NotificationProvider>
    </I18nProvider>
  );
}