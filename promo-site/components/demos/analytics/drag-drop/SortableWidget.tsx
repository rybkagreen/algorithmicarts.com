// components/demos/analytics/drag-drop/SortableWidget.tsx

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import CurrencyWidget from '../widgets/currency/CurrencyWidget';
import WeatherWidget from '../widgets/weather/WeatherWidget';
import GitHubWidget from '../widgets/github/GitHubWidget';
import { WidgetSize } from '@/types/demos';

interface SortableWidgetProps {
  widget: {
    id: string;
    type: string;
    size: WidgetSize;
    flexibleSize: string;
    order: number;
  };
}

export function SortableWidget({ widget }: SortableWidgetProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: widget.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // Render the appropriate widget based on type
  const renderWidget = () => {
    switch (widget.type) {
      case 'currency':
        return <CurrencyWidget size={widget.size} />;
      case 'weather':
        return <WeatherWidget size={widget.size} />;
      case 'github':
        return <GitHubWidget size={widget.size} />;
      default:
        return <div>Unknown widget type: {widget.type}</div>;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        ${isDragging ? 'cursor-grabbing shadow-xl z-10' : 'cursor-grab'}
        border-2 rounded-lg p-4 transition-all duration-150
        ${isDragging ? 'border-accent-primary/50' : 'border-transparent'}
        hover:border-border-primary
      `}
      {...attributes}
      {...listeners}
      role="article"
      aria-label={`Draggable ${widget.type} widget`}
    >
      {renderWidget()}
    </div>
  );
}
