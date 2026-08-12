import type { Metadata, Viewport } from 'next';
import { Bricolage_Grotesque, Plus_Jakarta_Sans } from 'next/font/google';
import type { ReactNode } from 'react';
import { Providers } from './providers';
import { ServiceWorkerRegister } from '../components/ServiceWorkerRegister';
import { AppShell } from '../components/AppShell';
import { AuthProvider } from '../components/customer/auth/AuthProvider';
import './globals.css';

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-bricolage',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'JajanHub',
  description: 'Pesan makanan kaki lima, pantau antrean live, ambil pas siap.',
  manifest: '/manifest.webmanifest',
  applicationName: 'JajanHub',
  appleWebApp: { capable: true, title: 'JajanHub', statusBarStyle: 'default' },
};

export const viewport: Viewport = {
  themeColor: '#FF7A1A',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" className={`${bricolage.variable} ${jakarta.variable}`}>
      <body className="bg-sand text-ink font-sans">
        <Providers>
          <AuthProvider>
            <ServiceWorkerRegister />
            <AppShell>{children}</AppShell>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
