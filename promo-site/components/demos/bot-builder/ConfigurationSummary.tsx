'use client';

import type { BotFeature, BotConfiguration, PriceEstimate } from '@/types/demos';
import { HOSTING_OPTIONS, SUPPORT_OPTIONS } from '@/lib/data/bot-features';
import { Calendar, TrendingUp } from 'lucide-react';
import { useMemo } from 'react';
import { Card } from '@/components/ui';

interface ConfigurationSummaryProps {
  config: BotConfiguration;
  features: BotFeature[];
}

export default function ConfigurationSummary({ config, features }: ConfigurationSummaryProps) {
  const estimate = useMemo(() => calculateEstimate(config, features), [config, features]);

  return (
    <div className="sticky top-24 space-y-6">
      {/* Price Card */}
      <Card className="bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 border border-accent-primary/30 p-6">
        <div className="text-center mb-6">
          <div className="text-sm text-text-secondary mb-2">Общая оценка</div>
          <div className="text-5xl font-bold mb-2">
            {(estimate.totalPrice / 1000).toFixed(0)}k
            <span className="text-2xl text-text-secondary"> ₽</span>
          </div>
          <div className="text-sm text-text-secondary">
            Время разработки: {estimate.developmentTime} дней
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="space-y-3 pt-6 border-t border-border-secondary">
          <PriceRow label="Функции" value={estimate.featuresPrice} />
          <PriceRow label="Хостинг" value={estimate.hostingPrice} />
          <PriceRow label="Поддержка" value={estimate.supportPrice} />
          {config.customDesign && <PriceRow label="Индивидуальный дизайн" value={10000} />}
          {config.analytics && <PriceRow label="Аналитика" value={8000} />}
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          icon={<Calendar className="w-5 h-5" />}
          label="Сроки"
          value={`${estimate.developmentTime}д`}
          color="text-accent-primary"
        />
        <StatCard
          icon={<TrendingUp className="w-5 h-5" />}
          label="Сложность"
          value={getComplexityLabel(estimate.complexityScore)}
          color="text-accent-secondary"
        />
      </div>

      {/* Selected Features List */}
      {config.features.length > 0 && (
        <Card className="rounded-lg border border-border-primary p-4">
          <div className="text-sm font-medium mb-3">Выбранные функции</div>
          <div className="space-y-2">
            {config.features.map((featureId) => {
              const feature = features.find((f) => f.id === featureId);
              if (!feature) return null;
              return (
                <div key={featureId} className="flex items-center justify-between text-sm">
                  <span className="text-text-secondary">{feature.name}</span>
                  <span className="text-text-secondary">
                    {(feature.price / 1000).toFixed(0)}k ₽
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* CTA Button */}
      <button className="w-full bg-gradient-to-r from-accent-primary to-accent-secondary hover:from-accent-primary/80 hover:to-accent-secondary/80 py-3 rounded-lg font-semibold transition-all transform hover:scale-105">
        Запросить расчет
      </button>
    </div>
  );
}

function PriceRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-text-secondary">{label}</span>
      <span className="font-semibold">{(value / 1000).toFixed(0)}k ₽</span>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <Card className="border border-border-primary p-4">
      <div className={`flex items-center gap-2 ${color} text-sm mb-2`}>
        {icon}
        <span>{label}</span>
      </div>
      <div className="text-xl font-bold">{value}</div>
    </Card>
  );
}

function calculateEstimate(config: BotConfiguration, allFeatures: BotFeature[]): PriceEstimate {
  const selectedFeatures = allFeatures.filter((f) => config.features.includes(f.id));

  const featuresPrice = selectedFeatures.reduce((sum, f) => sum + f.price, 0);
  const developmentTime = selectedFeatures.reduce((sum, f) => sum + f.developmentDays, 0);

  const hosting = HOSTING_OPTIONS.find((h) => h.id === config.hosting);
  const support = SUPPORT_OPTIONS.find((s) => s.id === config.support);

  const hostingPrice = hosting?.price || 0;
  const supportPrice = support?.price || 0;

  let totalPrice = featuresPrice + hostingPrice + supportPrice;

  if (config.customDesign) totalPrice += 10000;
  if (config.analytics) totalPrice += 8000;

  const complexityScore = selectedFeatures.reduce((sum, f) => {
    const complexityValue = f.complexity === 'low' ? 1 : f.complexity === 'medium' ? 2 : 3;
    return sum + complexityValue;
  }, 0);

  return {
    basePrice: 0,
    featuresPrice,
    hostingPrice,
    supportPrice,
    totalPrice,
    developmentTime,
    complexityScore,
  };
}

function getComplexityLabel(score: number): string {
  if (score <= 5) return 'Низкая';
  if (score <= 15) return 'Средняя';
  return 'Высокая';
}
