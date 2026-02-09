'use client';

import type { FC } from 'react';
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
                        <p className="text-sm text-text-muted font-mono">{service.problem}</p>
                      </div>

                      {/* Solution */}
                      <div className="mb-4">
                        <p className="text-text-secondary font-mono text-sm">{service.solution}</p>
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
