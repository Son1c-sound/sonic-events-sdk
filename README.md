# sonic-events

Function-based TypeScript SDK for tracking events and errors to Discord, Slack, or any webhook.

## Features

- **Simple & Lightweight** - Just two functions: `trackEvent()` and `trackError()`
- **Multi-Platform Support** - Auto-detects Discord, Slack, or generic webhooks
- **Silent Error Tracking** - Catches React errors without showing UI to users
- **TypeScript First** - Fully typed with excellent IntelliSense support
- **React Native Ready** - Works seamlessly with React and React Native
- **Developer Focused** - Built for developers to track their app's events

## Installation

```bash
npm install sonic-events
# or
yarn add sonic-events
# or
bun add sonic-events
```

## Quick Start

### 1. Wrap your app with AnalyticsWrapper

```tsx
import { AnalyticsWrapper } from 'sonic-events';

function App() {
  return (
    <AnalyticsWrapper
      webhook="https://discord.com/api/webhooks/..."
      appName="MyApp"
      captureErrors={true}
    >
      <YourApp />
    </AnalyticsWrapper>
  );
}
```

### 2. Track events anywhere

```tsx
import { useAnalytics } from 'sonic-events';

function PaywallScreen() {
  const { trackEvent } = useAnalytics();

  const handleUpgrade = () => {
    trackEvent('paywall_opened', {
      source: 'home',
      plan: 'premium'
    });
  };

  return <Button onPress={handleUpgrade}>Upgrade</Button>;
}
```

### 3. Track errors manually (optional)

```tsx
import { useAnalytics } from 'sonic-events';

function CheckoutScreen() {
  const { trackError } = useAnalytics();

  const processPayment = async () => {
    try {
      await charge();
    } catch (error) {
      trackError(error, {
        component: 'CheckoutScreen',
        action: 'processPayment'
      });
    }
  };
}
```

## API Reference

### `<AnalyticsWrapper>`

Main provider component that wraps your app.

**Props:**
- `webhook` (required) - Your webhook URL (Discord/Slack/generic)
- `appName` (optional) - Name of your app (included in all events)
- `userId` (optional) - User identifier for tracking per-user events
- `captureErrors` (optional) - Auto-catch React errors (default: `true`)
- `enableInDev` (optional) - Send events in dev mode (default: `false`, logs to console instead)

```tsx
<AnalyticsWrapper
  webhook="https://discord.com/api/webhooks/your-webhook"
  appName="MyApp"
  userId="user123"
  captureErrors={true}
  enableInDev={false}
>
  <App />
</AnalyticsWrapper>
```

### `useAnalytics()`

Hook to access tracking functions from context.

**Returns:**
- `trackEvent(eventName, metadata?)` - Track custom events
- `trackError(error, context?)` - Track errors
- `config` - Current analytics configuration

```tsx
const { trackEvent, trackError, config } = useAnalytics();
```

### `trackEvent(eventName, metadata?, config?)`

Track any custom event in your app.

**Parameters:**
- `eventName` (string) - Name of the event (e.g., 'paywall_opened')
- `metadata` (object, optional) - Additional data about the event
- `config` (object, optional) - Override global config for this event

**Examples:**
```tsx
trackEvent('user_signup');
trackEvent('purchase_completed', { amount: 9.99, plan: 'premium' });
trackEvent('feature_used', { feature: 'export' });
```

### `trackError(error, context?, config?)`

Track errors in your app.

**Parameters:**
- `error` (Error) - Error object to track
- `context` (object, optional) - Additional context about the error
- `config` (object, optional) - Override global config for this error

**Examples:**
```tsx
try {
  await riskyOperation();
} catch (error) {
  trackError(error, {
    component: 'PaymentScreen',
    userId: user.id
  });
}
```

## Webhook Formats

### Discord
Automatically formats as rich embeds with colors and emojis:
- Events: Blue embeds with event details
- Errors: Red embeds with stack traces

### Slack
Formats using Block Kit for modern, rich messages:
- Headers with emojis
- Organized fields for easy reading

### Generic Webhooks
Clean JSON format for any webhook service:
- Works with Zapier, Make, n8n
- Custom backends
- Webhook.site for testing

**Example payload:**
```json
{
  "event_type": "analytics_event",
  "timestamp": "2025-12-03T10:30:00Z",
  "app_name": "MyApp",
  "user_id": "user123",
  "data": {
    "event_name": "paywall_opened",
    "metadata": { "source": "home" }
  }
}
```

## TypeScript Support

Full TypeScript support with exported types:

```tsx
import type {
  AnalyticsConfig,
  AnalyticsEvent,
  ErrorEvent
} from 'sonic-events';
```

## Development Mode

By default, events are NOT sent to webhooks in development - they're logged to console instead.

To enable webhook sending in development:
```tsx
<AnalyticsWrapper
  webhook="..."
  enableInDev={true}
>
```

## Error Boundary

The SDK includes a silent ErrorBoundary that catches React errors and reports them without showing UI to users.

Enable it:
```tsx
<AnalyticsWrapper captureErrors={true}>
```

Or use the ErrorBoundary directly:
```tsx
import { ErrorBoundary } from 'sonic-events';

<ErrorBoundary config={{ webhook: '...' }}>
  <App />
</ErrorBoundary>
```

## License

MIT

## Author

Your Name
