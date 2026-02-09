// components/demos/analytics/microfrontends/MicroFrontendLoader.tsx

import React, { useState, useEffect, Suspense } from 'react';
import { microFrontendManager } from './MicroFrontendManager';

interface MicroFrontendLoaderProps {
  id: string;
  props?: Record<string, any>;
  fallback?: React.ReactNode;
}

// Create a lazy-loaded component for micro-frontend
function createLazyMicroFrontend(id: string, props: Record<string, any> = {}) {
  return new Promise<any>((resolve) => {
    microFrontendManager
      .loadMicroFrontend(id)
      .then((Component) => {
        resolve({
          default: () => <Component {...props} />,
        });
      })
      .catch((error) => {
        resolve({
          default: () => (
            <div className="p-4 bg-red-900/30 text-red-400 rounded">
              <p>Error loading micro-frontend: {error.message}</p>
            </div>
          ),
        });
      });
  });
}

export function MicroFrontendLoader({ id, props = {}, fallback }: MicroFrontendLoaderProps) {
  const [Component, setComponent] = useState<React.ComponentType<any> | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    microFrontendManager
      .loadMicroFrontend(id)
      .then((LoadedComponent) => {
        if (isMounted) {
          setComponent(() => LoadedComponent);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (error) {
    return (
      <div className="p-4 bg-red-900/30 text-red-400 rounded">
        <p>Error loading micro-frontend: {error.message}</p>
        <p className="text-sm mt-2">ID: {id}</p>
      </div>
    );
  }

  if (!Component) {
    return fallback || <div>Loading micro-frontend...</div>;
  }

  return <Component {...props} />;
}

// Alternative implementation using React.lazy for better performance
export function LazyMicroFrontendLoader({ id, props = {}, fallback }: MicroFrontendLoaderProps) {
  const LazyComponent = React.lazy(() => createLazyMicroFrontend(id, props));

  return (
    <Suspense fallback={fallback || <div>Loading micro-frontend...</div>}>
      <LazyComponent />
    </Suspense>
  );
}
