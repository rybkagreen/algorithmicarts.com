// components/demos/analytics/microfrontends/MicroFrontendDashboard.tsx

import { useState } from 'react';
import type { DashboardConfig } from '../types';
import { ContainerAwareGrid } from '../grid/AdvancedGridSystem';
import { MicroFrontendLoader } from './MicroFrontendLoader';

interface MicroFrontendDashboardProps {
  config: DashboardConfig;
}

export function MicroFrontendDashboard({ config }: MicroFrontendDashboardProps) {
  const [activeSlots, setActiveSlots] = useState<Record<string, boolean>>({});

  // Toggle slot activation
  const toggleSlot = (slotId: string) => {
    setActiveSlots((prev) => ({
      ...prev,
      [slotId]: !prev[slotId],
    }));
  };

  return (
    <div className="p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">{config.title}</h1>
        <p className="text-gray-400">{config.description}</p>
      </div>

      <ContainerAwareGrid minWidth="300px" gap="md">
        {config.widgets.map((widget) => (
          <div key={widget.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-medium text-cyan-400">{widget.type} Widget</h3>
              <button
                onClick={() => toggleSlot(widget.id)}
                className={`text-xs px-2 py-1 rounded ${
                  activeSlots[widget.id]
                    ? 'bg-green-600/20 text-green-400'
                    : 'bg-gray-700 text-gray-400'
                }`}
              >
                {activeSlots[widget.id] ? 'Active' : 'Inactive'}
              </button>
            </div>

            <MicroFrontendLoader
              id={`${widget.type}-mf`}
              props={{ size: widget.size, ...widget }}
            />

            <div className="mt-4 pt-4 border-t border-gray-700 text-xs text-gray-500">
              Widget ID: {widget.id}
            </div>
          </div>
        ))}
      </ContainerAwareGrid>
    </div>
  );
}
