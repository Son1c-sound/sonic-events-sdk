Context for Claude Code (SDK Development)
Project Overview
Building an NPM package called chewmate-analytics - a function-based TypeScript SDK for tracking events and errors, sending them to webhooks (Discord/Slack/generic). Target users: Developers (not end users).
Tech Stack

Language: TypeScript (pure functions, no classes)
Runtime: Bun for development
Framework Integration: React Native (optional React wrapper)
Architecture: Function-based, not class-based

Current Folder Structure
chewmate-analytics/
├── src/
│   ├── index.ts (main exports - TODO)
│   ├── core/
│   │   └── analytics.ts (trackEvent, trackError functions - TODO implement)
│   ├── errors/
│   │   └── ErrorBoundary.tsx (DONE - silently catches errors, no UI)
│   ├── formatters/
│   │   ├── discord.ts (TODO - Discord embed format)
│   │   ├── slack.ts (TODO - Slack message format)
│   │   └── web.ts (TODO - Generic JSON format)
│   ├── providers/
│   │   ├── AnalyticsWrapper.tsx (DONE - main wrapper component)
│   │   └── useAnalytics.ts (TODO - hook for accessing analytics)
│   └── types/
│       └── index.ts (DONE - all TypeScript types)
├── package.json
└── tsconfig.json
What's Completed
types/index.ts (DONE)
typescriptexport type AnalyticsConfig = {
  webhook: string;
  appName?: string;
  userId?: string;
  enableInDev?: boolean;
};

export type AnalyticsEvent = {
  type: string;
  timestamp: string;
  userId?: string;
  appName?: string;
  metadata?: Record<string, any>;
};

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

export type DiscordWebhookPayload = {
  embeds: DiscordEmbed[];
};

export type ErrorBoundaryProps = {
  children: ReactNode;
  config: AnalyticsConfig;
};
providers/AnalyticsWrapper.tsx (DONE)

Wraps app with AnalyticsContext
Accepts: webhook, appName, captureErrors props
Internally wraps in ErrorBoundary if captureErrors={true}
Provides config to all children via Context

errors/ErrorBoundary.tsx (DONE)

Class component that catches React errors
Calls trackError() when error occurs
No UI shown to users - just reports silently
Renders children normally (even after error)

Core Functions (Signatures Defined, Need Implementation)
core/analytics.ts
typescript// Main tracking functions
export function trackEvent(
  eventName: string,
  metadata?: Record<string, any>,
  config?: AnalyticsConfig
): Promise<void>

export function trackError(
  error: Error,
  context?: Record<string, any>,
  config?: AnalyticsConfig
): Promise<void>

// Internal helpers (need implementation)
async function sendToWebhook(
  data: any,
  webhookUrl: string
): Promise<void>

function formatForDiscord(
  eventType: string,
  data: any
): object
What Needs Implementation

Formatters (src/formatters/)

discord.ts - Format events/errors as Discord embeds with colors, emojis
slack.ts - Format for Slack messages
web.ts - Generic JSON format for any webhook


Core Functions (src/core/analytics.ts)

Implement trackEvent() - send events to webhook
Implement trackError() - send errors to webhook
Implement sendToWebhook() - HTTP POST to webhook URL
Connect formatters based on platform


Hook (src/providers/useAnalytics.ts)

Hook to access analytics from context
Returns { trackEvent, trackError, config }


Main Export (src/index.ts)

Export all public APIs



Key Design Decisions

Function-based - No classes, pure functions
Silent error tracking - No error UI shown to end users
Multiple platforms - Discord/Slack/Generic webhook support
Developer-focused - SDK for developers to integrate into their apps
Flexible formatting - Developers can build custom UIs around webhook data

Usage Pattern (Target API)
typescript// Wrap app
<AnalyticsWrapper webhook="..." platform="discord" captureErrors={true}>
  <App />
</AnalyticsWrapper>

// Track events anywhere
const { trackEvent } = useAnalytics();
trackEvent('paywall_opened', { source: 'home' });
Next Task
Implement the three formatter functions in src/formatters/ directory.