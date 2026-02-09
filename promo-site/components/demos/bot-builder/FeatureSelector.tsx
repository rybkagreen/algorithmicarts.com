'use client';
import { Card } from '@/components/ui';

import type { BotFeature } from '@/types/demos';
import { Check, AlertCircle } from 'lucide-react';
import { useState } from 'react';

interface FeatureSelectorProps {
  features: BotFeature[];
  selectedFeatures: string[];
  onToggleFeature: (featureId: string) => void;
}

export default function FeatureSelector({
  features,
  selectedFeatures,
  onToggleFeature,
}: FeatureSelectorProps) {
  const [activeCategory, setActiveCategory] = useState<'basic' | 'advanced' | 'premium'>('basic');

  const categories = [
    { id: 'basic', name: 'Basic', color: 'blue' },
    { id: 'advanced', name: 'Advanced', color: 'purple' },
    { id: 'premium', name: 'Premium', color: 'amber' },
  ] as const;

  const filteredFeatures = features.filter((f) => f.category === activeCategory);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'basic':
        return 'border-accent-primary bg-accent-primary/10 text-accent-primary';
      case 'advanced':
        return 'border-accent-secondary bg-accent-secondary/10 text-accent-secondary';
      case 'premium':
        return 'border-accent-success bg-accent-success/10 text-accent-success';
      default:
        return 'border-border-primary bg-background-tertiary/10 text-text-secondary';
    }
  };

  const isFeatureDisabled = (feature: BotFeature) => {
    if (!feature.dependencies) return false;
    return !feature.dependencies.every((dep) => selectedFeatures.includes(dep));
  };

  return (
    <div className="space-y-6">
      {/* Category Tabs */}
      <div className="flex gap-2 p-1 bg-background-tertiary/50 rounded-lg">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex-1 px-4 py-2 rounded-md font-medium transition-all ${
              activeCategory === cat.id
                ? `bg-${cat.color}-500 text-white`
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredFeatures.map((feature) => {
          const isSelected = selectedFeatures.includes(feature.id);
          const isDisabled = isFeatureDisabled(feature);
          const missingDeps = feature.dependencies?.filter(
            (dep) => !selectedFeatures.includes(dep)
          );

          return (
            <button
              key={feature.id}
              onClick={() => !isDisabled && onToggleFeature(feature.id)}
              disabled={isDisabled}
              className={`text-left p-4 rounded-lg border-2 transition-all ${
                isSelected
                  ? `${getCategoryColor(feature.category)} border-opacity-100`
                  : 'border-border-primary bg-background-tertiary/30 hover:border-border-secondary'
              } ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">{feature.name}</h4>
                    {isSelected && <Check className="w-4 h-4 text-accent-success" />}
                  </div>
                  <p className="text-sm text-text-secondary">{feature.description}</p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border-primary">
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-text-secondary">
                    <span className="font-semibold text-text-primary">
                      {(feature.price / 1000).toFixed(0)}k ₽
                    </span>
                  </span>
                  <span className="text-text-secondary">{feature.developmentDays}д</span>
                  <span
                    className={`px-2 py-0.5 rounded text-xs ${
                      feature.complexity === 'low'
                        ? 'bg-accent-success/20 text-accent-success'
                        : feature.complexity === 'medium'
                          ? 'bg-accent-warning/20 text-accent-warning'
                          : 'bg-accent-error/20 text-accent-error'
                    }`}
                  >
                    {feature.complexity === 'low'
                      ? 'низкая'
                      : feature.complexity === 'medium'
                        ? 'средняя'
                        : 'высокая'}
                  </span>
                </div>
              </div>

              {isDisabled && missingDeps && missingDeps.length > 0 && (
                <div className="mt-2 flex items-start gap-2 text-xs text-accent-warning">
                  <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  <span>
                    Требуется:{' '}
                    {missingDeps.map((dep) => features.find((f) => f.id === dep)?.name).join(', ')}
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
