import { describe, test, expect } from 'bun:test';
import { formatForWeb } from './web';
import type { AnalyticsEvent, ErrorEvent } from '../types';

describe('Web Formatter', () => {
  test('formats analytics event correctly', () => {
    const event: AnalyticsEvent = {
      type: 'paywall_opened',
      timestamp: '2025-12-03T10:00:00Z',
      userId: 'user123',
      appName: 'TestApp',
      metadata: { source: 'home' },
    };

    const result = formatForWeb(event);

    expect(result.event_type).toBe('analytics_event');
    expect(result.timestamp).toBe('2025-12-03T10:00:00Z');
    expect(result.app_name).toBe('TestApp');
    expect(result.user_id).toBe('user123');
    expect(result.data.event_name).toBe('paywall_opened');
    expect(result.data.metadata).toEqual({ source: 'home' });
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

    const result = formatForWeb(error);

    expect(result.event_type).toBe('error_event');
    expect(result.timestamp).toBe('2025-12-03T10:00:00Z');
    expect(result.app_name).toBe('TestApp');
    expect(result.user_id).toBe('user123');
    expect(result.data.error_name).toBe('Error');
    expect(result.data.error_message).toBe('Test error');
    expect(result.data.error_stack).toContain('Error: Test error');
    expect(result.data.context).toEqual({ component: 'TestComponent' });
  });

  test('handles missing optional fields', () => {
    const event: AnalyticsEvent = {
      type: 'simple_event',
      timestamp: '2025-12-03T10:00:00Z',
    };

    const result = formatForWeb(event);

    expect(result.event_type).toBe('analytics_event');
    expect(result.app_name).toBeUndefined();
    expect(result.user_id).toBeUndefined();
    expect(result.data.metadata).toBeUndefined();
  });
});
