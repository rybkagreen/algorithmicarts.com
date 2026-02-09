'use client';

import { Metadata } from 'next';
import { BarChart3, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { DashboardProvider } from '@/components/demos/analytics/hooks/DashboardContext';
import { DashboardGrid } from '@/components/demos/analytics/components/DashboardGrid';
import { DragDropProvider } from '@/components/demos/analytics/drag-drop/DragDropProvider';
import type { WidgetLayout } from '@/components/demos/analytics/types';

// Define metadata separately in a layout or route file
// export const metadata: Metadata = {
//   title: 'Analytics Dashboard | Portfolio Demo',
//   description: 'Real-time analytics dashboard with live weather, currency rates, and GitHub statistics',
// };

// Define initial widgets configuration
const initialWidgets: WidgetLayout[] = [
  {
    id: 'weather-1',
    type: 'weather',
    size: 'medium',
    flexibleSize: '2x2',
    order: 0,
  },
  {
    id: 'currency-1',
    type: 'currency',
    size: 'medium',
    flexibleSize: '2x1',
    order: 1,
  },
  {
    id: 'github-1',
    type: 'github',
    size: 'medium',
    flexibleSize: '3x2',
    order: 2,
  },
];

export default function AnalyticsDashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background-primary to-background-secondary py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-accent-primary/10 border border-accent-primary/20 rounded-full px-4 py-2 mb-6"
          >
            <BarChart3 className="w-4 h-4 text-accent-primary" />
            <span className="text-sm font-medium text-accent-primary">Live Demo</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold mb-4 font-mono"
          >
            Интерактивная Аналитическая Панель
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-text-secondary mb-6"
          >
            Перетаскивайте, изменяйте размер и настраивайте виджеты по своему вкусу
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-2 text-sm text-text-muted"
          >
            <span className="px-3 py-1 bg-background-tertiary rounded-full">React</span>
            <span className="px-3 py-1 bg-background-tertiary rounded-full">TypeScript</span>
            <span className="px-3 py-1 bg-background-tertiary rounded-full">Next.js</span>
            <span className="px-3 py-1 bg-background-tertiary rounded-full">@dnd-kit</span>
            <span className="px-3 py-1 bg-background-tertiary rounded-full">Tailwind CSS</span>
          </motion.div>
        </div>

        {/* Features list */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-4xl mx-auto mb-12"
        >
          {/* Interactive Dashboard Grid */}
          <DashboardProvider initialWidgets={initialWidgets}>
            <DragDropProvider>
              <DashboardGrid />
            </DragDropProvider>
          </DashboardProvider>
        </motion.div>

        {/* WOW Features Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="max-w-4xl mx-auto mt-16"
        >
          <div className="bg-gradient-to-r from-accent-primary/10 to-accent-secondary/10 border border-border-primary rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4 text-center">✨ WOW-функции дашборда</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-background-secondary/50 p-4 rounded-lg">
                <h4 className="font-medium text-accent-primary mb-2">AI-оптимизация</h4>
                <p className="text-sm text-text-secondary">
                  Интеллектуальный помощник анализирует ваш дашборд и предлагает оптимизации
                </p>
              </div>
              <div className="bg-background-secondary/50 p-4 rounded-lg">
                <h4 className="font-medium text-accent-primary mb-2">Анализ использования</h4>
                <p className="text-sm text-text-secondary">
                  Отслеживайте, какие виджеты вы используете чаще всего
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tech Stack Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="max-w-4xl mx-auto mt-12"
        >
          <div className="bg-background-secondary/30 border border-border-primary rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Техническая реализация</h3>
            <div className="grid md:grid-cols-2 gap-6 text-sm text-text-secondary">
              <div>
                <h4 className="font-medium text-text-primary mb-2">Фронтенд</h4>
                <ul className="space-y-1">
                  <li>• Next.js 14 с App Router</li>
                  <li>• TypeScript для безопасности типов</li>
                  <li>• @dnd-kit для перетаскивания</li>
                  <li>• Tailwind CSS для стилизации</li>
                  <li>• Lucide React для иконок</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-text-primary mb-2">Функции дашборда</h4>
                <ul className="space-y-1">
                  <li>• Drag-and-drop интерфейс</li>
                  <li>• Изменение размера виджетов</li>
                  <li>• Сохранение конфигурации в localStorage</li>
                  <li>• Контекстное управление состоянием</li>
                  <li>• Адаптивная сетка</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="max-w-4xl mx-auto mt-12 text-center"
        >
          <a
            href="/"
            className="inline-flex items-center gap-2 bg-accent-primary hover:bg-accent-primary/80 px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Назад к портфолио
          </a>
        </motion.div>
      </div>
    </div>
  );
}
