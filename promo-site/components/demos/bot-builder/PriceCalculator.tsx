'use client';

import type { BotConfiguration, PriceEstimate } from '@/types/demos';
import { HOSTING_OPTIONS, SUPPORT_OPTIONS } from '@/lib/data/bot-features';
import { Server, Headphones, Palette, BarChart3 } from 'lucide-react';
import { Card } from '@/components/ui';

interface PriceCalculatorProps {
  config: BotConfiguration;
  onConfigChange: (config: Partial<BotConfiguration>) => void;
}

export default function PriceCalculator({ config, onConfigChange }: PriceCalculatorProps) {
  return (
    <div className="space-y-6">
      {/* Hosting */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Server className="w-5 h-5 text-accent-primary" />
          <h3 className="font-semibold">Hosting</h3>
        </div>
        <div className="space-y-2">
          {HOSTING_OPTIONS.map((option) => (
            <button
              key={option.id}
              onClick={() => onConfigChange({ hosting: option.id })}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                config.hosting === option.id
                  ? 'border-accent-primary bg-accent-primary/10'
                  : 'border-border-primary bg-background-tertiary/30 hover:border-border-secondary'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold mb-1">{option.name}</div>
                  <div className="text-sm text-text-secondary">{option.description}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">
                    {option.price > 0 ? `${(option.price / 1000).toFixed(0)}k ₽` : 'Бесплатно'}
                  </div>
                  {option.monthlyPrice > 0 && (
                    <div className="text-xs text-text-secondary">+{option.monthlyPrice} ₽/мес</div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Support */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Headphones className="w-5 h-5 text-accent-success" />
          <h3 className="font-semibold">Поддержка</h3>
        </div>
        <div className="space-y-2">
          {SUPPORT_OPTIONS.map((option) => (
            <button
              key={option.id}
              onClick={() => onConfigChange({ support: option.id })}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                config.support === option.id
                  ? 'border-accent-success bg-accent-success/10'
                  : 'border-border-primary bg-background-tertiary/30 hover:border-border-secondary'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold mb-1">{option.name}</div>
                  <div className="text-sm text-text-secondary">{option.description}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">
                    {option.price > 0 ? `${(option.price / 1000).toFixed(0)}k ₽` : 'Бесплатно'}
                  </div>
                  {option.monthlyPrice > 0 && (
                    <div className="text-xs text-text-secondary">+{option.monthlyPrice} ₽/мес</div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Additional Options */}
      <div>
        <h3 className="font-semibold mb-3">Дополнительные опции</h3>
        <div className="space-y-3">
          <label className="flex items-center justify-between p-4 rounded-lg border-2 border-border-primary bg-background-tertiary/30 hover:border-border-secondary cursor-pointer transition-all">
            <div className="flex items-center gap-3">
              <Palette className="w-5 h-5 text-accent-secondary" />
              <div>
                <div className="font-semibold">Индивидуальный дизайн</div>
                <div className="text-sm text-text-secondary">Уникальный UI/UX для вашего бота</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-semibold">10k ₽</span>
              <input
                type="checkbox"
                checked={config.customDesign}
                onChange={(e) => onConfigChange({ customDesign: e.target.checked })}
                className="w-5 h-5 rounded border-border-primary bg-background-tertiary text-accent-secondary focus:ring-2 focus:ring-accent-secondary"
              />
            </div>
          </label>

          <label className="flex items-center justify-between p-4 rounded-lg border-2 border-border-primary bg-background-tertiary/30 hover:border-border-secondary cursor-pointer transition-all">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-5 h-5 text-accent-warning" />
              <div>
                <div className="font-semibold">Интеграция аналитики</div>
                <div className="text-sm text-text-secondary">
                  Отслеживание поведения пользователей и метрик
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-semibold">8k ₽</span>
              <input
                type="checkbox"
                checked={config.analytics}
                onChange={(e) => onConfigChange({ analytics: e.target.checked })}
                className="w-5 h-5 rounded border-border-primary bg-background-tertiary text-accent-warning focus:ring-2 focus:ring-accent-warning"
              />
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
