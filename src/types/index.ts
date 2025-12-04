// src/types/index.ts

import type { ReactNode } from "react";

/**
 * Configuration for analytics
 */
export type AnalyticsConfig = {
    webhook: string;
    appName?: string;
    userId?: string;
    enableInDev?: boolean;
  };
  
  /**
   * Analytics event data structure
   */
  export type AnalyticsEvent = {
    type: string;
    timestamp: string;
    userId?: string;
    appName?: string;
    metadata?: Record<string, any>;
  };
  
  /**
   * Error event data structure
   */
  export type ErrorEvent = {
    type: 'error';
    timestamp: string;
    userId?: string;
    appName?: string;
    error: {
      message: string;
      stack?: string;
      name?: string;
    };
    context?: Record<string, any>;
  };
  
  /**
   * Discord embed structure
   */
  export type DiscordEmbed = {
    title: string;
    color: number;
    fields: Array<{
      name: string;
      value: string;
      inline?: boolean;
    }>;
    timestamp: string;
    footer?: {
      text: string;
    };
  };

  export type ErrorBoundaryProps = {
    children: ReactNode;
    config: AnalyticsConfig;
  };
 
  export type DiscordWebhookPayload = {
    embeds: DiscordEmbed[];
  };