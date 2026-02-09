'use client';

import { useState } from 'react';
import { Bot, ExternalLink, Info } from 'lucide-react';
import FeatureSelector from '@/components/demos/bot-builder/FeatureSelector';
import PriceCalculator from '@/components/demos/bot-builder/PriceCalculator';
import ConfigurationSummary from '@/components/demos/bot-builder/ConfigurationSummary';
import { BotConfiguration } from '@/types/demos';
import { BOT_FEATURES } from '@/lib/data/bot-features';
import { motion } from 'framer-motion';

export default function BotBuilderPage() {
  const [config, setConfig] = useState<BotConfiguration>({
    features: [],
    hosting: 'free',
    support: 'none',
    customDesign: false,
    analytics: false,
  });

  const handleToggleFeature = (featureId: string) => {
    setConfig((prev) => ({
      ...prev,
      features: prev.features.includes(featureId)
        ? prev.features.filter((id) => id !== featureId)
        : [...prev.features, featureId],
    }));
  };

  const handleConfigChange = (updates: Partial<BotConfiguration>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background-primary to-background-secondary py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-accent-secondary/10 border border-accent-secondary/20 rounded-full px-4 py-2 mb-6"
          >
            <Bot className="w-4 h-4 text-accent-secondary" />
            <span className="text-sm font-medium text-accent-secondary">Interactive Tool</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold mb-4 font-mono"
          >
            Конструктор Telegram Бота
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-text-secondary mb-6"
          >
            Настройте идеального Telegram бота и получите мгновенную оценку цены
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-2 text-sm text-text-muted"
          >
            <span className="px-3 py-1 bg-background-tertiary rounded-full">React</span>
            <span className="px-3 py-1 bg-background-tertiary rounded-full">TypeScript</span>
            <span className="px-3 py-1 bg-background-tertiary rounded-full">Расчет в реальном времени</span>
            <span className="px-3 py-1 bg-background-tertiary rounded-full">Telegram Bot API</span>
          </motion.div>
        </div>

        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-6xl mx-auto mb-8"
        >
          <div className="bg-accent-primary/10 border border-accent-primary/30 rounded-lg p-4 flex items-start gap-3">
            <Info className="w-5 h-5 text-accent-primary flex-shrink-0 mt-0.5" />
            <div className="text-sm text-text-secondary">
              <strong>Как это работает:</strong> Выберите нужные функции, выберите варианты хостинга и поддержки,
              и получите мгновенную оценку. Все цены указаны в российских рублях (₽). Время разработки оценивается
              на основе сложности функций.
            </div>
          </div>
        </motion.div>

        {/* Main Grid */}
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
          {/* Left Column - Features & Options */}
          <div className="lg:col-span-2 space-y-8">
            {/* Feature Selection */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="text-2xl font-bold mb-6">1. Выберите функции</h2>
              <FeatureSelector
                features={BOT_FEATURES}
                selectedFeatures={config.features}
                onToggleFeature={handleToggleFeature}
              />
            </motion.section>

            {/* Configuration */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h2 className="text-2xl font-bold mb-6">2. Настройте параметры</h2>
              <PriceCalculator config={config} onConfigChange={handleConfigChange} />
            </motion.section>
          </div>

          {/* Right Column - Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="lg:col-span-1"
          >
            <h2 className="text-2xl font-bold mb-6">Оценка</h2>
            <ConfigurationSummary config={config} features={BOT_FEATURES} />
          </motion.div>
        </div>

        {/* Features Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="max-w-6xl mx-auto mt-16"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Что вы получите</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-background-secondary/50 border border-border-primary rounded-xl p-6">
              <div className="text-3xl mb-3">🚀</div>
              <h3 className="font-semibold mb-2">Готово к производству</h3>
              <p className="text-sm text-text-secondary">
                Полностью протестированный код с обработкой ошибок, логированием и лучшими практиками
              </p>
            </div>
            <div className="bg-background-secondary/50 border border-border-primary rounded-xl p-6">
              <div className="text-3xl mb-3">📚</div>
              <h3 className="font-semibold mb-2">Документация</h3>
              <p className="text-sm text-text-secondary">
                Полное руководство по настройке, документация по API и инструкции по развертыванию
              </p>
            </div>
            <div className="bg-background-secondary/50 border border-border-primary rounded-xl p-6">
              <div className="text-3xl mb-3">🔧</div>
              <h3 className="font-semibold mb-2">Исходный код</h3>
              <p className="text-sm text-text-secondary">
                Чистый, хорошо структурированный код TypeScript/Python с комментариями
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="max-w-4xl mx-auto mt-16 text-center"
        >
          <a
            href="/"
            className="inline-flex items-center gap-2 bg-accent-primary hover:bg-accent-primary/80 px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Back to Portfolio
          </a>
        </motion.div>
      </div>
    </div>
  );
}