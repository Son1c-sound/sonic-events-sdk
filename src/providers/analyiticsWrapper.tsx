// src/providers/AnalyticsWrapper.tsx

import React, { createContext, useMemo, type ReactNode } from 'react';
import { ErrorBoundary } from '../errors/ErrorBoundary';
import { trackEvent, trackError } from '../core/analytics';
import type { AnalyticsConfig } from '../types';

// Create the context
type AnalyticsContextType = {
  trackEvent: (eventName: string, metadata?: Record<string, any>) => Promise<void>;
  trackError: (error: Error, context?: Record<string, any>) => Promise<void>;
  config: AnalyticsConfig;
};


const AnalyticsContext = createContext<AnalyticsContextType | null>(null);

// Export context for the hook
export { AnalyticsContext };

type AnalyticsWrapperProps = {
  webhook: string;
  appName?: string;
  captureErrors?: boolean;
  children: React.ReactNode;
};

export function AnalyticsWrapper({ 
  webhook, 
  appName,
  captureErrors = true,
  children 
}: AnalyticsWrapperProps) {
  
  // Create config object
  const config: AnalyticsConfig = useMemo(() => ({
    webhook,
    appName,
  }), [webhook, appName]);
  
  // Create analytics functions that already have config baked in
  const analytics = useMemo(() => ({
    trackEvent: (eventName: string, metadata?: Record<string, any>) => {
      return trackEvent(eventName, metadata, config);
    },
    trackError: (error: Error, context?: Record<string, any>) => {
      return trackError(error, context, config);
    },
    config,
  }), [config]);
  
  // If captureErrors is true, wrap in ErrorBoundary
  if (captureErrors) {
    return (
      <AnalyticsContext.Provider value={analytics}>
        <ErrorBoundary config={config}>
          {children}
        </ErrorBoundary>
      </AnalyticsContext.Provider>
    );
  }
  
  // If captureErrors is false, just context
  return (
    <AnalyticsContext.Provider value={analytics}>
      {children}
    </AnalyticsContext.Provider>
  );
}