// components/demos/analytics/microfrontends/MicroFrontendManager.ts

import React from 'react';

// Define the interface for a micro-frontend
export interface MicroFrontend {
  id: string;
  name: string;
  url: string; // URL to load the micro-frontend from
  props?: Record<string, any>; // Props to pass to the micro-frontend
  loadingComponent?: React.ComponentType;
  errorComponent?: React.ComponentType<{ error: Error }>;
}

// Define the interface for a micro-frontend container
export interface MicroFrontendContainer {
  id: string;
  microFrontendId: string;
  position: { row: number; col: number };
  size: { width: number; height: number };
  props?: Record<string, any>;
}

// Micro-frontend registry
class MicroFrontendRegistry {
  private microFrontends: Map<string, MicroFrontend> = new Map();

  register(microFrontend: MicroFrontend) {
    this.microFrontends.set(microFrontend.id, microFrontend);
  }

  get(id: string): MicroFrontend | undefined {
    return this.microFrontends.get(id);
  }

  getAll(): MicroFrontend[] {
    return Array.from(this.microFrontends.values());
  }
}

// Create a singleton instance
export const microFrontendRegistry = new MicroFrontendRegistry();

// Define the interface for the micro-frontend manager
export interface MicroFrontendManager {
  loadMicroFrontend: (id: string) => Promise<React.ComponentType<any>>;
  registerMicroFrontend: (microFrontend: MicroFrontend) => void;
  getMicroFrontend: (id: string) => MicroFrontend | undefined;
  getAllMicroFrontends: () => MicroFrontend[];
}

// Implementation of the micro-frontend manager
export class MicroFrontendManagerImpl implements MicroFrontendManager {
  private registry: MicroFrontendRegistry;

  constructor(registry: MicroFrontendRegistry) {
    this.registry = registry;
  }

  async loadMicroFrontend(id: string): Promise<React.ComponentType<any>> {
    const microFrontend = this.registry.get(id);

    if (!microFrontend) {
      throw new Error(`Micro-frontend with id "${id}" not found`);
    }

    // In a real implementation, this would dynamically load the micro-frontend
    // from the specified URL. For now, we'll return a placeholder.
    return (props: any) =>
      React.createElement(
        'div',
        { className: 'p-4 bg-gray-800 rounded' },
        React.createElement('h3', { className: 'font-bold text-white' }, microFrontend.name),
        React.createElement(
          'p',
          { className: 'text-gray-400' },
          `Loaded from: ${microFrontend.url}`
        ),
        React.createElement(
          'div',
          { className: 'mt-2 text-sm text-gray-500' },
          `Props: ${JSON.stringify(props)}`
        )
      );
  }

  registerMicroFrontend(microFrontend: MicroFrontend) {
    this.registry.register(microFrontend);
  }

  getMicroFrontend(id: string): MicroFrontend | undefined {
    return this.registry.get(id);
  }

  getAllMicroFrontends(): MicroFrontend[] {
    return this.registry.getAll();
  }
}

// Create the global instance
export const microFrontendManager = new MicroFrontendManagerImpl(microFrontendRegistry);

// Register some example micro-frontends
microFrontendManager.registerMicroFrontend({
  id: 'currency-mf',
  name: 'Currency Widget (Micro-Frontend)',
  url: '/microfrontends/currency-widget.js',
  props: { size: 'medium' },
});

microFrontendManager.registerMicroFrontend({
  id: 'weather-mf',
  name: 'Weather Widget (Micro-Frontend)',
  url: '/microfrontends/weather-widget.js',
  props: { location: 'New York' },
});

microFrontendManager.registerMicroFrontend({
  id: 'analytics-mf',
  name: 'Analytics Widget (Micro-Frontend)',
  url: '/microfrontends/analytics-widget.js',
  props: { metric: 'revenue' },
});
