'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import type { WidgetLayout } from '../types';

interface DashboardContextType {
  widgets: WidgetLayout[];
  setWidgets: React.Dispatch<React.SetStateAction<WidgetLayout[]>>;
  addWidget: (widget: WidgetLayout) => void;
  removeWidget: (id: string) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

interface DashboardProviderProps {
  children: ReactNode;
  initialWidgets?: WidgetLayout[];
}

export function DashboardProvider({
  children,
  initialWidgets = []
}: DashboardProviderProps) {
  const [widgets, setWidgets] = useState<WidgetLayout[]>(initialWidgets);

  const addWidget = (widget: WidgetLayout) => {
    setWidgets(prev => [...prev, widget]);
  };

  const removeWidget = (id: string) => {
    setWidgets(prev => prev.filter(widget => widget.id !== id));
  };

  return (
    <DashboardContext.Provider value={{ widgets, setWidgets, addWidget, removeWidget }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard(): DashboardContextType {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}
