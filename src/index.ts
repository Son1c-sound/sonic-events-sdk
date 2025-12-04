// Main exports for chewmate-analytics SDK

// Core tracking functions
export { trackEvent, trackError } from './core/analytics';

// React components and hooks
export { AnalyticsWrapper } from './providers/analyiticsWrapper';
export { useAnalytics } from './providers/useAnalyitcs';
export { ErrorBoundary } from './errors/ErrorBoundary';

// TypeScript types
export type {
  AnalyticsConfig,
  AnalyticsEvent,
  ErrorEvent,
  DiscordEmbed,
  DiscordWebhookPayload,
  ErrorBoundaryProps,
} from './types';
