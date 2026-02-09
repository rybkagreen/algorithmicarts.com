import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ScrollProgress } from '@/components/layout/ScrollProgress';
import { BackToTop } from '@/components/layout/BackToTop';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
});

export const metadata: Metadata = {
  title: 'Ваше Имя | Fullstack Developer',
  description: 'Разрабатываю digital-инструменты, которые решают задачи бизнеса',
  keywords: ['telegram bot', 'web development', 'react', 'next.js', 'fullstack'],
  authors: [{ name: 'Ваше Имя' }],
  openGraph: {
    title: 'Ваше Имя | Fullstack Developer',
    description: 'Разрабатываю digital-инструменты, которые решают задачи бизнеса',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans">
        <ScrollProgress />
        <Header />
        <main className="pt-20">{children}</main>
        <Footer />
        <BackToTop />
      </body>
    </html>
  );
}
