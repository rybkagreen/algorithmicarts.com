// components/demos/analytics/drag-drop/DragDropProvider.tsx

import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';
import type { WidgetLayout } from '../types';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useDashboard } from '../hooks/DashboardContext';

interface DragDropProviderProps {
  children: React.ReactNode;
}

export function DragDropProvider({ children }: DragDropProviderProps) {
  const { widgets, setWidgets } = useDashboard();
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setWidgets((widgets) => {
        const oldIndex = widgets.findIndex((w) => w.id === active.id);
        const newIndex = widgets.findIndex((w) => w.id === over.id);

        // Swap the widgets
        const newWidgets = [...widgets];
        const [removed] = newWidgets.splice(oldIndex, 1);
        newWidgets.splice(newIndex, 0, removed);

        // Update the order property
        return newWidgets.map((widget, index) => ({
          ...widget,
          order: index,
        }));
      });
    }

    setActiveId(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      {children}
      <DragOverlay>
        {activeId ? (
          <div className="bg-background-tertiary border border-accent-primary/50 rounded-lg p-4 shadow-lg shadow-accent-primary/20">
            <div className="text-text-primary font-medium">Moving widget</div>
            <div className="text-sm text-text-secondary">{activeId}</div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
