import type { AnalyticsEvent, ErrorEvent } from '../types';

/**
 * Generic webhook payload for any webhook service
 */
type GenericWebhookPayload = {
  event_type: 'analytics_event' | 'error_event';
  timestamp: string;
  app_name?: string;
  user_id?: string;
  data: any;
};

export function formatForWeb(data: AnalyticsEvent | ErrorEvent): GenericWebhookPayload {
  const isError = data.type === 'error';

  if (isError) {
    const errorData = data as ErrorEvent;
    return {
      event_type: 'error_event',
      timestamp: errorData.timestamp,
      app_name: errorData.appName,
      user_id: errorData.userId,
      data: {
        error_name: errorData.error.name,
        error_message: errorData.error.message,
        error_stack: errorData.error.stack,
        context: errorData.context,
      },
    };
  } else {
    const eventData = data as AnalyticsEvent;
    return {
      event_type: 'analytics_event',
      timestamp: eventData.timestamp,
      app_name: eventData.appName,
      user_id: eventData.userId,
      data: {
        event_name: eventData.type,
        metadata: eventData.metadata,
      },
    };
  }
}