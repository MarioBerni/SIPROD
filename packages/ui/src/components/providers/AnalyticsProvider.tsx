'use client';

import React, { createContext, useContext, useEffect } from 'react';

// Tipos para Google Analytics
declare global {
  interface Window {
    dataLayer: unknown[];
  }
}

type GTagEvent = {
  event_category?: string;
  event_label?: string;
  value?: number;
  [key: string]: unknown;
};

interface AnalyticsContextType {
  trackEvent: (eventName: string, properties?: GTagEvent) => void;
  trackPageView: (path: string) => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export interface AnalyticsProviderProps {
  children: React.ReactNode;
  analyticsKey?: string;
}

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({
  children,
  analyticsKey,
}) => {
  useEffect(() => {
    if (analyticsKey && typeof window !== 'undefined') {
      // Inicializar analytics (ejemplo con Google Analytics)
      window.dataLayer = window.dataLayer || [];
      function gtag(...args: unknown[]) {
        window.dataLayer.push(args);
      }
      gtag('js', new Date());
      gtag('config', analyticsKey);
    }
  }, [analyticsKey]);

  const trackEvent = (eventName: string, properties?: GTagEvent) => {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: eventName,
        ...properties,
      });
    }
  };

  const trackPageView = (path: string) => {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'page_view',
        page_path: path,
      });
    }
  };

  return (
    <AnalyticsContext.Provider value={{ trackEvent, trackPageView }}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};

export default AnalyticsProvider;
