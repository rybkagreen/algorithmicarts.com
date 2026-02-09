'use client';

import { useState } from 'react';
import { useDashboard } from '../hooks/DashboardContext';
import type { WidgetLayout } from '../types';
import { ContainerAwareGrid, GridItem } from '../grid/AdvancedGridSystem';
import { SortableWidget } from '../drag-drop/SortableWidget';

interface DashboardGridProps {}

const DashboardGrid: React.FC<DashboardGridProps> = () => {
  const { widgets } = useDashboard();
  // intentionally unused - kept for future implementation
  const [layout, setLayout] = useState<any[]>([]); // Using any for simplicity, but in real app should be typed

  // Determine grid size based on widget flexibleSize
  const getGridSpan = (flexibleSize: string): number => {
    const [width, height] = flexibleSize.split('x').map(Number);
    // Return a span value based on the width (for a simplified grid)
    return width || 1;
  };

  return (
    <div className="mb-12">
      <ContainerAwareGrid minWidth="300px" gap="md">
        {widgets.map((widget) => (
          <GridItem key={widget.id} span={getGridSpan(widget.flexibleSize)}>
            <SortableWidget widget={widget} />
          </GridItem>
        ))}
      </ContainerAwareGrid>
    </div>
  );
};

export { DashboardGrid };
