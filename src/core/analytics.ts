import type { AnalyticsConfig, AnalyticsEvent, ErrorEvent } from '../types';
import { formatForDiscord } from '../formatters/discord';
import { formatForSlack } from '../formatters/slack';
import { formatForWeb } from '../formatters/web';

/**
 * Track any custom event in your app
 *
 * @param eventName - Name of the event (e.g., 'paywall_opened', 'onboarding_completed')
 * @param metadata - Optional data about the event (e.g., { source: 'home', calories: 500 })
 * @param config - Analytics configuration
 *   - config.webhook (required): Webhook URL - automatically detects Discord/Slack/Generic
 *   - config.appName (optional): Your app name - included in all events for filtering
 *   - config.userId (optional): User identifier - track events per user
 *   - config.enableInDev (optional): Set true to send events in development mode (default: false, logs to console instead)
 *
 * @example
 * trackEvent('paywall_opened', { source: 'home' }, config);
 */
export async function trackEvent(
  eventName: string,
  metadata?: Record<string, any>,
  config?: AnalyticsConfig
): Promise<void> {
  if (!config?.webhook) {
    console.warn('Analytics: No webhook URL provided');
    return;
  }

  // enableInDev: false (default) = logs to console in dev, doesn't send to webhook
  // enableInDev: true = sends to webhook even in development
  if (process.env.NODE_ENV === 'development' && !config.enableInDev) {
    console.log(`[Analytics] Event: ${eventName}`, metadata);
    return;
  }

  const event: AnalyticsEvent = {
    type: eventName,
    timestamp: new Date().toISOString(),
    userId: config.userId,
    appName: config.appName,
    metadata,
  };

  try {
    await sendToWebhook(event, config.webhook);
  } catch (error) {
    console.error('Failed to send analytics event:', error);
  }
}


/**
 * Track errors in your app (can also be called automatically by ErrorBoundary)
 *
 * @param error - Error object to track
 * @param context - Optional context about where/why the error occurred (e.g., { component: 'PaywallScreen', action: 'checkout' })
 * @param config - Analytics configuration
 *   - config.webhook (required): Webhook URL - automatically detects Discord/Slack/Generic
 *   - config.appName (optional): Your app name - included in all error reports
 *   - config.userId (optional): User identifier - know which user hit the error
 *   - config.enableInDev (optional): Set true to send errors in development mode (default: false, logs to console instead)
 *
 * @example
 * try {
 *   processPayment();
 * } catch (error) {
 *   trackError(error, { component: 'PaywallScreen' }, config);
 * }
 */
export async function trackError(
  error: Error,
  context?: Record<string, any>,
  config?: AnalyticsConfig
): Promise<void> {
  if (!config?.webhook) {
    console.warn('Analytics: No webhook URL provided');
    return;
  }

  // enableInDev: false (default) = logs to console in dev, doesn't send to webhook
  // enableInDev: true = sends to webhook even in development
  if (process.env.NODE_ENV === 'development' && !config.enableInDev) {
    console.log('[Analytics] Error:', error.message, context);
    return;
  }

  const errorEvent: ErrorEvent = {
    type: 'error',
    timestamp: new Date().toISOString(),
    userId: config.userId,
    appName: config.appName,
    error: {
      message: error.message,
      stack: error.stack,
      name: error.name,
    },
    context,
  };

  try {
    await sendToWebhook(errorEvent, config.webhook);
  } catch (err) {
    console.error('Failed to send error event:', err);
  }
}

/**
 * Internal helper: sends data to webhook with automatic platform detection
 *
 * Platform detection (based on webhook URL):
 *   - discord.com → formats as Discord embed
 *   - slack.com → formats as Slack message
 *   - anything else → generic JSON format
 */
async function sendToWebhook(
  data: AnalyticsEvent | ErrorEvent,
  webhookUrl: string
): Promise<void> {
  // Auto-detect platform from webhook URL
  const isDiscord = webhookUrl.includes('discord.com');
  const isSlack = webhookUrl.includes('slack.com');

  // Route to appropriate formatter
  let payload: any;
  if (isDiscord) {
    payload = formatForDiscord(data);
  } else if (isSlack) {
    payload = formatForSlack(data);
  } else {
    // Generic webhook - works with Zapier, Make, custom backends, etc.
    payload = formatForWeb(data);
  }

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Webhook request failed: ${response.status} ${response.statusText}`);
  }
}