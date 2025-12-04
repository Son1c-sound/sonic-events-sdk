import type { AnalyticsEvent, ErrorEvent, DiscordWebhookPayload, DiscordEmbed } from '../types';


export function formatForDiscord(data: AnalyticsEvent | ErrorEvent): DiscordWebhookPayload {
  const isError = data.type === 'error';

  if (isError) {
    const errorData = data as ErrorEvent;
    const embed: DiscordEmbed = {
      title: `🚨 Error: ${errorData.error.name || 'Error'}`,
      color: 0xED4245, // Discord red
      fields: [
        {
          name: '📝 Message',
          value: errorData.error.message || 'No message',
          inline: false,
        },
        {
          name: '📱 App',
          value: errorData.appName || 'Unknown',
          inline: true,
        },
        {
          name: '👤 User',
          value: errorData.userId || 'Anonymous',
          inline: true,
        },
      ],
      timestamp: errorData.timestamp,
      footer: {
        text: 'chewmate-analytics',
      },
    };

    // Add stack trace if available
    if (errorData.error.stack) {
      embed.fields.push({
        name: '🔍 Stack Trace',
        value: `\`\`\`\n${errorData.error.stack.slice(0, 1000)}\n\`\`\``,
        inline: false,
      });
    }

    // Add context if available
    if (errorData.context && Object.keys(errorData.context).length > 0) {
      embed.fields.push({
        name: '📎 Context',
        value: `\`\`\`json\n${JSON.stringify(errorData.context, null, 2).slice(0, 1000)}\n\`\`\``,
        inline: false,
      });
    }

    return { embeds: [embed] };
  } else {
    const eventData = data as AnalyticsEvent;
    const embed: DiscordEmbed = {
      title: `📊 Event: ${eventData.type}`,
      color: 0x5865F2, // Discord blurple
      fields: [
        {
          name: '📱 App',
          value: eventData.appName || 'Unknown',
          inline: true,
        },
        {
          name: '👤 User',
          value: eventData.userId || 'Anonymous',
          inline: true,
        },
      ],
      timestamp: eventData.timestamp,
      footer: {
        text: 'chewmate-analytics',
      },
    };

    // Add metadata if available
    if (eventData.metadata && Object.keys(eventData.metadata).length > 0) {
      embed.fields.push({
        name: '📎 Metadata',
        value: `\`\`\`json\n${JSON.stringify(eventData.metadata, null, 2).slice(0, 1000)}\n\`\`\``,
        inline: false,
      });
    }

    return { embeds: [embed] };
  }
}