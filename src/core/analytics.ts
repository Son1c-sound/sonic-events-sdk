import type { AnalyticsConfig, AnalyticsEvent, ErrorEvent } from '../types';
import { formatForDiscord } from '../formatters/discord';
import { formatForSlack } from '../formatters/slack';
import { formatForWeb } from '../formatters/web';


export async function trackEvent(
  eventName: string,
  metadata?: Record<string, any>,
  config?: AnalyticsConfig
): Promise<void> {
  if (!config?.webhook) {
    console.warn('Analytics: No webhook URL provided');
    return;
  }

  // Skip in development unless explicitly enabled
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


export async function trackError(
  error: Error,
  context?: Record<string, any>,
  config?: AnalyticsConfig
): Promise<void> {
  if (!config?.webhook) {
    console.warn('Analytics: No webhook URL provided');
    return;
  }

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

async function sendToWebhook(
  data: AnalyticsEvent | ErrorEvent,
  webhookUrl: string
): Promise<void> {

  const isDiscord = webhookUrl.includes('discord.com');
  const isSlack = webhookUrl.includes('slack.com');

  let payload: any;
  if (isDiscord) {
    payload = formatForDiscord(data);
  } else if (isSlack) {
    payload = formatForSlack(data);
  } else {
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