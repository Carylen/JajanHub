import type { Metadata, Viewport } from 'next';
import { Bricolage_Grotesque, Plus_Jakarta_Sans } from 'next/font/google';
import type { ReactNode } from 'react';
import { Providers } from './providers';
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
  title: 'JajanHub Pedagang',
  description: 'Kelola pesanan, antrean, dan pencairan gerobakmu.',
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
          {/* Vendor app is app-like: a centered column that reads well on phone & tablet. */}
          <div className="mx-auto max-w-[480px] min-h-screen bg-cream relative overflow-x-hidden shadow-[0_0_70px_rgba(0,0,0,.1)]">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
