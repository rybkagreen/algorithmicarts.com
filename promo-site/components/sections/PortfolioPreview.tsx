'use client';

import type { FC } from 'react';
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
    technologies: ['Node.js', 'Telegraf.js', 'PostgreSQL', 'Stripe API'],
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
                  <h3 className="text-xl font-bold mb-2 text-text-primary">{project.title}</h3>

                  {/* Description */}
                  <p className="text-text-secondary mb-4 flex-grow">{project.description}</p>

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
                    {project.id === 'demo-bot-builder' ? (
                      <Link href="/portfolio/bot-builder" className="flex-1">
                        <Button variant="secondary" size="sm" className="w-full">
                          <ExternalLink size={16} />
                          Live Demo
                        </Button>
                      </Link>
                    ) : project.id === 'demo-dashboard' ? (
                      <Link href="/portfolio/analytics-dashboard" className="flex-1">
                        <Button variant="secondary" size="sm" className="w-full">
                          <ExternalLink size={16} />
                          Live Demo
                        </Button>
                      </Link>
                    ) : (
                      <Button variant="secondary" size="sm" className="flex-1">
                        <ExternalLink size={16} />
                        Live Demo
                      </Button>
                    )}
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
