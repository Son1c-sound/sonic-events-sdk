import type { AnalyticsEvent, ErrorEvent } from '../types';

/**
 * Slack message block structure
 */
type SlackBlock = {
  type: string;
  text?: {
    type: string;
    text: string;
    emoji?: boolean;
  };
  fields?: Array<{
    type: string;
    text: string;
  }>;
};

type SlackWebhookPayload = {
  blocks: SlackBlock[];
};

/**
 * Format analytics events and errors as Slack Block Kit messages
 *
 * Uses Block Kit for rich formatting with sections and fields
 */
export function formatForSlack(data: AnalyticsEvent | ErrorEvent): SlackWebhookPayload {
  const isError = data.type === 'error';

  if (isError) {
    const errorData = data as ErrorEvent;
    const blocks: SlackBlock[] = [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: `🚨 Error: ${errorData.error.name || 'Error'}`,
          emoji: true,
        },
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*📝 Message:*\n${errorData.error.message || 'No message'}`,
          },
          {
            type: 'mrkdwn',
            text: `*📱 App:*\n${errorData.appName || 'Unknown'}`,
          },
          {
            type: 'mrkdwn',
            text: `*👤 User:*\n${errorData.userId || 'Anonymous'}`,
          },
          {
            type: 'mrkdwn',
            text: `*🕐 Time:*\n${new Date(errorData.timestamp).toLocaleString()}`,
          },
        ],
      },
    ];

    // Add stack trace if available
    if (errorData.error.stack) {
      blocks.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*🔍 Stack Trace:*\n\`\`\`${errorData.error.stack.slice(0, 2000)}\`\`\``,
        },
      });
    }

    // Add context if available
    if (errorData.context && Object.keys(errorData.context).length > 0) {
      blocks.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*📎 Context:*\n\`\`\`${JSON.stringify(errorData.context, null, 2).slice(0, 2000)}\`\`\``,
        },
      });
    }

    return { blocks };
  } else {
    const eventData = data as AnalyticsEvent;
    const blocks: SlackBlock[] = [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: `📊 Event: ${eventData.type}`,
          emoji: true,
        },
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*📱 App:*\n${eventData.appName || 'Unknown'}`,
          },
          {
            type: 'mrkdwn',
            text: `*👤 User:*\n${eventData.userId || 'Anonymous'}`,
          },
          {
            type: 'mrkdwn',
            text: `*🕐 Time:*\n${new Date(eventData.timestamp).toLocaleString()}`,
          },
        ],
      },
    ];

    // Add metadata if available
    if (eventData.metadata && Object.keys(eventData.metadata).length > 0) {
      blocks.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*📎 Metadata:*\n\`\`\`${JSON.stringify(eventData.metadata, null, 2).slice(0, 2000)}\`\`\``,
        },
      });
    }

    return { blocks };
  }
}