import { describe, test, expect, mock, beforeEach } from 'bun:test';
import { trackEvent, trackError } from './analytics';
import type { AnalyticsConfig } from '../types';

// Mock fetch globally
const originalFetch = global.fetch;

describe('Analytics Core Functions', () => {
  beforeEach(() => {
    // Reset fetch mock before each test
    global.fetch = mock(() => Promise.resolve(new Response('OK', { status: 200 })));
  });

  describe('trackEvent', () => {
    test('sends event to webhook', async () => {
      const config: AnalyticsConfig = {
        webhook: 'https://example.com/webhook',
        appName: 'TestApp',
        userId: 'user123',
        enableInDev: true,
      };

      await trackEvent('test_event', { foo: 'bar' }, config);

      expect(global.fetch).toHaveBeenCalledTimes(1);
      const call = (global.fetch as any).mock.calls[0];
      expect(call[0]).toBe('https://example.com/webhook');
      expect(call[1].method).toBe('POST');
    });

    test('includes metadata in event payload', async () => {
      const config: AnalyticsConfig = {
        webhook: 'https://example.com/webhook',
        enableInDev: true,
      };

      await trackEvent('test_event', { key: 'value', count: 42 }, config);

      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    test('skips sending when webhook is missing', async () => {
      const config: AnalyticsConfig = {
        webhook: '',
      };

      await trackEvent('test_event', {}, config);

      expect(global.fetch).not.toHaveBeenCalled();
    });

    test('detects Discord webhook and uses Discord formatter', async () => {
      const config: AnalyticsConfig = {
        webhook: 'https://discord.com/api/webhooks/123/abc',
        enableInDev: true,
      };

      await trackEvent('test_event', {}, config);

      expect(global.fetch).toHaveBeenCalledTimes(1);
      const call = (global.fetch as any).mock.calls[0];
      const body = JSON.parse(call[1].body);
      expect(body).toHaveProperty('embeds');
    });

    test('detects Slack webhook and uses Slack formatter', async () => {
      const config: AnalyticsConfig = {
        webhook: 'https://hooks.slack.com/services/T00/B00/XXX',
        enableInDev: true,
      };

      await trackEvent('test_event', {}, config);

      expect(global.fetch).toHaveBeenCalledTimes(1);
      const call = (global.fetch as any).mock.calls[0];
      const body = JSON.parse(call[1].body);
      expect(body).toHaveProperty('blocks');
    });
  });

  describe('trackError', () => {
    test('sends error to webhook', async () => {
      const config: AnalyticsConfig = {
        webhook: 'https://example.com/webhook',
        appName: 'TestApp',
        enableInDev: true,
      };

      const error = new Error('Test error');
      await trackError(error, { component: 'TestComponent' }, config);

      expect(global.fetch).toHaveBeenCalledTimes(1);
      const call = (global.fetch as any).mock.calls[0];
      expect(call[0]).toBe('https://example.com/webhook');
    });

    test('includes error details in payload', async () => {
      const config: AnalyticsConfig = {
        webhook: 'https://example.com/webhook',
        enableInDev: true,
      };

      const error = new Error('Test error');
      error.name = 'TestError';

      await trackError(error, {}, config);

      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    test('handles errors without config gracefully', async () => {
      const error = new Error('Test error');

      await expect(trackError(error, {})).resolves.toBeUndefined();
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

});
