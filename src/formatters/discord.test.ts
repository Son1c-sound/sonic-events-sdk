import { describe, test, expect } from 'bun:test';
import { formatForDiscord } from './discord';
import type { AnalyticsEvent, ErrorEvent } from '../types';

describe('Discord Formatter', () => {
  test('formats analytics event correctly', () => {
    const event: AnalyticsEvent = {
      type: 'paywall_opened',
      timestamp: '2025-12-03T10:00:00Z',
      userId: 'user123',
      appName: 'TestApp',
      metadata: { source: 'home' },
    };

    const result = formatForDiscord(event);

    expect(result).toHaveProperty('embeds');
    expect(result.embeds).toHaveLength(1);

    const embed = result.embeds[0];
    expect(embed).toBeDefined();
    expect(embed!.title).toBe('📊 Event: paywall_opened');
    expect(embed!.color).toBe(0x5865F2); // Discord blue
    expect(embed!.footer?.text).toBe('chewmate-analytics');
  });

  test('formats error event correctly', () => {
    const error: ErrorEvent = {
      type: 'error',
      timestamp: '2025-12-03T10:00:00Z',
      userId: 'user123',
      appName: 'TestApp',
      error: {
        message: 'Test error',
        stack: 'Error: Test error\n  at test.ts:1:1',
        name: 'Error',
      },
      context: { component: 'TestComponent' },
    };

    const result = formatForDiscord(error);

    expect(result).toHaveProperty('embeds');
    expect(result.embeds).toHaveLength(1);

    const embed = result.embeds[0];
    expect(embed).toBeDefined();
    expect(embed!.title).toBe('🚨 Error: Error');
    expect(embed!.color).toBe(0xED4245); // Discord red
    expect(embed!.fields).toBeDefined();
  });

  test('includes metadata in event embed', () => {
    const event: AnalyticsEvent = {
      type: 'test_event',
      timestamp: '2025-12-03T10:00:00Z',
      metadata: { foo: 'bar', count: 42 },
    };

    const result = formatForDiscord(event);
    const embed = result.embeds[0];
    expect(embed).toBeDefined();

    const metadataField = embed!.fields.find(f => f.name === '📎 Metadata');

    expect(metadataField).toBeDefined();
    expect(metadataField?.value).toContain('foo');
    expect(metadataField?.value).toContain('bar');
  });

  test('includes stack trace in error embed', () => {
    const error: ErrorEvent = {
      type: 'error',
      timestamp: '2025-12-03T10:00:00Z',
      error: {
        message: 'Test error',
        stack: 'Error: Test error\n  at test.ts:1:1',
        name: 'Error',
      },
    };

    const result = formatForDiscord(error);
    const embed = result.embeds[0];
    expect(embed).toBeDefined();

    const stackField = embed!.fields.find(f => f.name === '🔍 Stack Trace');

    expect(stackField).toBeDefined();
    expect(stackField?.value).toContain('Error: Test error');
  });
});
