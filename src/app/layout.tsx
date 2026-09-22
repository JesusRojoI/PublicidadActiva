import Providers from './providers';
import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NotificationStack from '@/components/NotificationStack';

export const metadata: Metadata = {
  title: 'PublicidadActiva — Agencia Creativa y de Diseño',
  description:
    'Agencia integral de diseño gráfico y estrategias de contenido dedicada a conectar emocionalmente a las marcas con su audiencia.',
  icons: { icon: '/logo.svg' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&family=Momo+Trust+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>
          <div className="pa-shell">
            <Header />
            <main className="pa-main">{children}</main>
            <Footer />
          </div>
          <NotificationStack />
        </Providers>
      </body>
    </html>
  );
}