# ЗАДАНИЕ 4: Hero секция и основные секции главной страницы

## Цель
Создать Hero секцию в стиле терминала и секции: Services, Portfolio Preview, Contact Preview.

## Контекст
Hero должна иметь терминал-стайл заголовок с префиксом `>`, печатающийся эффект, стек технологий в квадратных скобках.

## Требования к выполнению

### 1. Hero Section

Создайте файл `components/sections/Hero.tsx`:

```typescript
'use client';

import { FC, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Github, Linkedin, Send } from 'lucide-react';
import { Button, Badge } from '@/components/ui';
import { SITE_CONFIG, TECH_STACK } from '@/lib/constants';

const ALL_TECH = [
  ...TECH_STACK.frontend,
  ...TECH_STACK.backend.slice(0, 2),
];

export const Hero: FC = () => {
  const [text, setText] = useState('');
  const fullText = 'Создаю digital-инструменты,\nкоторые решают задачи бизнеса';
  
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 50);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background-primary/50 to-background-primary" />

      <div className="container mx-auto px-4 z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Terminal-style heading */}
          <motion.h1 
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 font-mono"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="text-accent-primary">&gt; </span>
            <span className="gradient-text whitespace-pre-line">
              {text}
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="inline-block w-1 h-12 md:h-16 bg-accent-primary ml-1 align-middle"
              />
            </span>
          </motion.h1>
          
          {/* Subtitle */}
          <motion.p
            className="text-lg md:text-xl text-text-secondary mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            Fullstack-разработчик, специализирующийся на Telegram-ботах,
            web-приложениях и автоматизации бизнес-процессов
          </motion.p>

          {/* Tech stack badges */}
          <motion.div
            className="flex flex-wrap justify-center items-center gap-2 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <span className="text-text-muted font-mono text-sm">[</span>
            {ALL_TECH.map((tech, i) => (
              <motion.div
                key={tech}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.1 + i * 0.05 }}
              >
                <Badge variant="accent">{tech}</Badge>
              </motion.div>
            ))}
            <span className="text-text-muted font-mono text-sm">]</span>
          </motion.div>

          {/* CTA buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
          >
            <Button size="lg" variant="primary">
              Обсудить проект
              <ArrowRight size={20} />
            </Button>
            <Button size="lg" variant="secondary">
              Посмотреть портфолио
            </Button>
          </motion.div>

          {/* Social links */}
          <motion.div
            className="flex gap-6 justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <a 
              href={SITE_CONFIG.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted hover:text-accent-primary transition-colors"
              aria-label="GitHub"
            >
              <Github size={24} />
            </a>
            <a 
              href={SITE_CONFIG.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted hover:text-accent-primary transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={24} />
            </a>
            <a 
              href={SITE_CONFIG.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted hover:text-accent-primary transition-colors"
              aria-label="Telegram"
            >
              <Send size={24} />
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.5 }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 border-2 border-border-primary rounded-full flex justify-center p-2"
        >
          <motion.div className="w-1.5 h-1.5 bg-accent-primary rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
};
```

### 2. Services Section

Создайте файл `components/sections/Services.tsx`:

```typescript
'use client';

import { FC } from 'react';
import { motion } from 'framer-motion';
import { Bot, Globe, Smartphone, Zap } from 'lucide-react';
import { Card, Badge } from '@/components/ui';

const SERVICES = [
  {
    icon: Bot,
    title: 'Telegram-боты',
    problem: '// Клиент: Ресторан с большим потоком заказов',
    solution: '> Разработан бот для автоматизации приема заказов с интеграцией платежей',
    technologies: ['Node.js', 'Telegraf.js', 'PostgreSQL', 'Stripe API'],
    benefits: ['Экономия 15 часов/неделю', 'Автоматизация на 80%', '500+ заказов'],
  },
  {
    icon: Globe,
    title: 'Web-приложения',
    problem: '// Клиент: Стартап без онлайн-присутствия',
    solution: '> Создан современный SPA с акцентом на конверсию и производительность',
    technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
    benefits: ['Lighthouse 95+', 'SEO оптимизация', 'Адаптивный дизайн'],
  },
  {
    icon: Smartphone,
    title: 'PWA приложения',
    problem: '// Клиент: Нужно мобильное приложение без затрат',
    solution: '> Разработано PWA, работающее как нативное приложение',
    technologies: ['React', 'Service Workers', 'IndexedDB'],
    benefits: ['Работает офлайн', 'Push-уведомления', 'Установка на устройство'],
  },
  {
    icon: Zap,
    title: 'Автоматизация',
    problem: '// Клиент: Часы на рутинные задачи ежедневно',
    solution: '> Созданы скрипты и интеграции, автоматизирующие процессы',
    technologies: ['Python', 'Node.js', 'REST APIs', 'Webhooks'],
    benefits: ['Экономия времени', 'Минимизация ошибок', 'Интеграция сервисов'],
  },
];

export const Services: FC = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 font-mono">
            <span className="text-accent-primary">//</span> Услуги
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Помогаю бизнесу автоматизировать процессы и масштабироваться с помощью технологий
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {SERVICES.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hoverable>
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-accent-primary/10 rounded-lg border border-accent-primary/30 flex-shrink-0">
                      <Icon className="text-accent-primary" size={24} />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-4 text-text-primary">
                        {service.title}
                      </h3>
                      
                      {/* Problem */}
                      <div className="mb-3">
                        <p className="text-sm text-text-muted font-mono">
                          {service.problem}
                        </p>
                      </div>
                      
                      {/* Solution */}
                      <div className="mb-4">
                        <p className="text-text-secondary font-mono text-sm">
                          {service.solution}
                        </p>
                      </div>
                      
                      {/* Technologies */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {service.technologies.map((tech) => (
                          <Badge key={tech} variant="default">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                      
                      {/* Benefits */}
                      <div className="flex flex-wrap gap-2 text-xs text-accent-success">
                        {service.benefits.map((benefit) => (
                          <span key={benefit} className="opacity-80">
                            ✓ {benefit}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
```

### 3. Portfolio Preview Section

Создайте файл `components/sections/PortfolioPreview.tsx`:

```typescript
'use client';

import { FC } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ExternalLink, Github, ArrowRight } from 'lucide-react';
import { Card, Badge, Button } from '@/components/ui';

const FEATURED_PROJECTS = [
  {
    id: 'real-project-1',
    type: 'commercial',
    title: 'Telegram-бот для ресторана',
    description: 'Автоматизация приема заказов с интеграцией платежей и админ-панелью',
    technologies: ['Node.js', 'Telegraf', 'PostgreSQL', 'Stripe'],
    featured: true,
  },
  {
    id: 'demo-bot-builder',
    type: 'demo',
    title: '[ДЕМО] Конструктор Telegram-ботов',
    description: 'Интерактивный инструмент для оценки стоимости и сложности бота',
    technologies: ['React', 'Next.js', 'TypeScript'],
  },
  {
    id: 'demo-dashboard',
    type: 'demo',
    title: '[ДЕМО] Analytics Dashboard',
    description: 'Дашборд с реальными live данными: погода, курсы валют, GitHub статистика',
    technologies: ['React', 'Recharts', 'APIs'],
  },
];

export const PortfolioPreview: FC = () => {
  return (
    <section className="py-20 px-4 bg-background-secondary/50">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 font-mono">
            <span className="text-accent-primary">//</span> Портфолио
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Реальные проекты и демо-приложения, демонстрирующие навыки разработки
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-8">
          {FEATURED_PROJECTS.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={project.featured ? 'md:col-span-2' : ''}
            >
              <Card hoverable className="h-full">
                <div className="flex flex-col h-full">
                  {/* Type badge */}
                  <div className="mb-3">
                    <Badge variant={project.type === 'commercial' ? 'accent' : 'default'}>
                      {project.type === 'commercial' ? 'КЕЙС' : 'ДЕМО'}
                    </Badge>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold mb-2 text-text-primary">
                    {project.title}
                  </h3>

                  {/* Description */}
                  <p className="text-text-secondary mb-4 flex-grow">
                    {project.description}
                  </p>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech) => (
                      <Badge key={tech} variant="muted">
                        {tech}
                      </Badge>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" className="flex-1">
                      <ExternalLink size={16} />
                      Live Demo
                    </Button>
                    {project.type === 'demo' && (
                      <Button variant="ghost" size="sm">
                        <Github size={16} />
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* View All Projects Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link href="/portfolio">
            <Button variant="primary" size="lg">
              Все проекты
              <ArrowRight size={20} />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
```

### 4. Contact Preview Section

Создайте файл `components/sections/ContactPreview.tsx`:

```typescript
'use client';

import { FC } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail } from 'lucide-react';
import { Button } from '@/components/ui';
import { SITE_CONFIG } from '@/lib/constants';

export const ContactPreview: FC = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 font-mono">
            <span className="text-accent-primary">&gt; </span>
            Готовы начать проект?
          </h2>
          
          <p className="text-text-secondary text-lg mb-8">
            Обсудим вашу задачу и найдем оптимальное решение. 
            Отвечаю в течение 24 часов.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" size="lg">
              <Send size={20} />
              Telegram
            </Button>
            <Button 
              variant="secondary" 
              size="lg"
              onClick={() => window.location.href = `mailto:${SITE_CONFIG.email}`}
            >
              <Mail size={20} />
              Email
            </Button>
          </div>

          {/* Quick contact info */}
          <div className="mt-8 pt-8 border-t border-border-primary">
            <p className="text-text-muted text-sm mb-2">Или напишите напрямую:</p>
            <a 
              href={`mailto:${SITE_CONFIG.email}`}
              className="text-accent-primary hover:underline font-mono"
            >
              {SITE_CONFIG.email}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
```

### 5. Index file для экспорта

Создайте файл `components/sections/index.ts`:

```typescript
export { Hero } from './Hero';
export { Services } from './Services';
export { PortfolioPreview } from './PortfolioPreview';
export { ContactPreview } from './ContactPreview';
```

### 6. Обновление главной страницы

Обновите `app/page.tsx`:

```typescript
import { Hero, Services, PortfolioPreview, ContactPreview } from '@/components/sections';

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <PortfolioPreview />
      <ContactPreview />
    </>
  );
}
```

## Критерии приемки

✅ Hero секция с печатающимся эффектом  
✅ Стек технологий в квадратных скобках `[...]`  
✅ Терминал-стайл префикс `>`  
✅ Services в формате: Проблема → Решение → Технологии  
✅ Portfolio preview с 3 проектами  
✅ Contact preview с быстрыми ссылками  
✅ Все анимации работают (Framer Motion)  
✅ Responsive дизайн на всех устройствах  
✅ Accessibility: keyboard navigation, proper headings  
✅ Performance: плавные анимации без лагов  

## Тестирование

1. Откройте http://localhost:3000
2. Hero должна отображаться на весь экран
3. Текст должен "печататься"
4. Проскрольте вниз - все секции должны появляться с анимацией
5. Проверьте на мобильном (resize окно)
6. Все ссылки и кнопки должны работать

## Примечания

- Typing effect использует `useEffect` с интервалом
- Cursor blinking реализован через Framer Motion
- Grid background добавляет глубину Hero секции
- Все секции используют `whileInView` для появления при скролле
- Services карточки показывают формат: Problem → Solution → Tech

## Git Commit

```bash
git add .
git commit -m "feat: add hero and main page sections"
```
