# ЗАДАНИЕ 3: Создание Layout компонентов

## Цель
Создать Header, Footer и Navigation компоненты с мобильным меню и sticky header.

## Контекст
Layout должен быть темным, с логотипом в моноширинном шрифте, плавными анимациями при скролле.

## Требования к выполнению

### 1. Header Component

Создайте файл `components/layout/Header.tsx`:

```typescript
'use client';

import { FC, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui';
import { NAVIGATION, SITE_CONFIG } from '@/lib/constants';

export const Header: FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when window is resized to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-background-primary/95 backdrop-blur-md border-b border-border-primary shadow-lg'
            : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-accent-primary font-mono text-xl">&gt;</span>
              <span className="text-xl font-bold font-mono group-hover:text-accent-primary transition-colors">
                {SITE_CONFIG.name}
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {NAVIGATION.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-text-secondary hover:text-accent-primary transition-colors text-sm font-medium"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* CTA Button Desktop */}
            <div className="hidden md:block">
              <Button variant="primary" size="sm">
                Обсудить проект
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-text-secondary hover:text-accent-primary transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
            />

            {/* Menu */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[300px] bg-background-secondary border-l border-border-primary z-50 md:hidden"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border-primary">
                  <span className="text-lg font-bold font-mono">Меню</span>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 hover:bg-background-tertiary rounded-lg transition-colors"
                  >
                    <X size={20} className="text-text-secondary" />
                  </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-6">
                  <ul className="space-y-4">
                    {NAVIGATION.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block text-text-primary hover:text-accent-primary transition-colors text-lg font-medium"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>

                {/* CTA */}
                <div className="p-6 border-t border-border-primary">
                  <Button variant="primary" className="w-full">
                    Обсудить проект
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
```

### 2. Footer Component

Создайте файл `components/layout/Footer.tsx`:

```typescript
import { FC } from 'react';
import Link from 'next/link';
import { Github, Linkedin, Send } from 'lucide-react';
import { SITE_CONFIG, NAVIGATION, TECH_STACK } from '@/lib/constants';
import { Badge } from '@/components/ui';

export const Footer: FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background-secondary border-t border-border-primary mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="text-accent-primary font-mono text-xl">&gt;</span>
              <span className="text-xl font-bold font-mono">{SITE_CONFIG.name}</span>
            </Link>
            <p className="text-text-secondary mb-4 max-w-md">
              {SITE_CONFIG.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {TECH_STACK.frontend.slice(0, 4).map((tech) => (
                <Badge key={tech} variant="default">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-text-primary font-semibold mb-4">Навигация</h3>
            <ul className="space-y-2">
              {NAVIGATION.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-text-secondary hover:text-accent-primary transition-colors text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-text-primary font-semibold mb-4">Контакты</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="text-text-secondary hover:text-accent-primary transition-colors text-sm flex items-center gap-2"
                >
                  <Send size={16} />
                  Email
                </a>
              </li>
              <li>
                <a
                  href={SITE_CONFIG.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-secondary hover:text-accent-primary transition-colors text-sm flex items-center gap-2"
                >
                  <Send size={16} />
                  Telegram
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border-primary flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-text-muted text-sm">
            © {currentYear} {SITE_CONFIG.name}. Все права защищены.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a
              href={SITE_CONFIG.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted hover:text-accent-primary transition-colors"
              aria-label="GitHub"
            >
              <Github size={20} />
            </a>
            <a
              href={SITE_CONFIG.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted hover:text-accent-primary transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={20} />
            </a>
            <a
              href={SITE_CONFIG.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted hover:text-accent-primary transition-colors"
              aria-label="Telegram"
            >
              <Send size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
```

### 3. ScrollProgress Component

Создайте файл `components/layout/ScrollProgress.tsx`:

```typescript
'use client';

import { FC, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const ScrollProgress: FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateScrollProgress = () => {
      const currentScroll = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (currentScroll / scrollHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', updateScrollProgress);
    return () => window.removeEventListener('scroll', updateScrollProgress);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-accent-primary origin-left z-50"
      style={{ scaleX: scrollProgress / 100 }}
      initial={{ scaleX: 0 }}
    />
  );
};
```

### 4. BackToTop Component

Создайте файл `components/layout/BackToTop.tsx`:

```typescript
'use client';

import { FC, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

export const BackToTop: FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 500);
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-3 bg-accent-primary text-background-primary 
                     rounded-full shadow-lg hover:shadow-accent-primary/50 
                     transition-shadow z-40"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Back to top"
        >
          <ArrowUp size={20} />
        </motion.button>
      )}
    </AnimatePresence>
  );
};
```

### 5. Обновление Root Layout

Обновите файл `app/layout.tsx`:

```typescript
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { BackToTop } from "@/components/layout/BackToTop";

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
});

const jetbrainsMono = localFont({
  src: [
    {
      path: '../public/fonts/JetBrainsMono-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/JetBrainsMono-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-jetbrains',
});

export const metadata: Metadata = {
  title: "Ваше Имя | Fullstack Developer",
  description: "Разрабатываю digital-инструменты, которые решают задачи бизнеса",
  keywords: ["telegram bot", "web development", "react", "next.js", "fullstack"],
  authors: [{ name: "Ваше Имя" }],
  openGraph: {
    title: "Ваше Имя | Fullstack Developer",
    description: "Разрабатываю digital-инструменты, которые решают задачи бизнеса",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans">
        <ScrollProgress />
        <Header />
        <main className="pt-20">
          {children}
        </main>
        <Footer />
        <BackToTop />
      </body>
    </html>
  );
}
```

### 6. Index file для экспорта

Создайте файл `components/layout/index.ts`:

```typescript
export { Header } from './Header';
export { Footer } from './Footer';
export { ScrollProgress } from './ScrollProgress';
export { BackToTop } from './BackToTop';
```

### 7. Тестовая страница

Обновите `app/page.tsx` для тестирования:

```typescript
export default function Home() {
  return (
    <div className="min-h-screen">
      <section className="container mx-auto px-4 py-20">
        <h1 className="text-5xl font-bold font-mono mb-4">
          <span className="text-accent-primary">&gt; </span>
          Layout Test Page
        </h1>
        <p className="text-text-secondary mb-8">
          Scroll down to test sticky header and back-to-top button.
        </p>
        
        {/* Dummy content for scrolling */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="mb-8 p-6 bg-background-secondary rounded-lg border border-border-primary">
            <h2 className="text-2xl font-semibold mb-2">Section {i + 1}</h2>
            <p className="text-text-secondary">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
              Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}
```

## Критерии приемки

✅ Header создан с sticky поведением  
✅ Header меняет стиль при скролле (прозрачный → solid)  
✅ Мобильное меню работает (slide-in анимация)  
✅ Footer создан со всеми ссылками  
✅ ScrollProgress показывает прогресс скролла  
✅ BackToTop появляется после 500px скролла  
✅ Все анимации плавные (Framer Motion)  
✅ Layout responsive на всех устройствах  
✅ Accessibility: keyboard navigation, ARIA labels  
✅ No layout shift при загрузке  

## Тестирование

1. Откройте http://localhost:3000
2. Проскрольте вниз - header должен стать solid
3. Проскрольте еще - должна появиться кнопка "Back to Top"
4. На мобильном (resize окно) - проверьте меню
5. Проверьте все ссылки в footer

## Примечания

- Header имеет pt-20 offset для контента (высота header)
- Мобильное меню блокирует body scroll когда открыто
- Все анимации учитывают performance (transform/opacity)
- Social icons используют aria-label для accessibility

## Git Commit

```bash
git add .
git commit -m "feat: add layout components (header, footer, navigation)"
```
