// src/errors/ErrorBoundary.tsx

import React, { Component } from 'react';
import { trackError } from '../core/analytics';
import type { ErrorBoundaryProps } from '../types';

type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
};

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error) {
    return {
      hasError: true,
      error,
    };
  }

  override componentDidCatch(error: Error, errorInfo: any) {
    // Just send to webhook, don't show UI
    trackError(error, { componentStack: errorInfo.componentStack }, this.props.config);
  }

  override render() {
    // Just render children normally, even if there's an error
    // Let the app crash naturally or handle it however they want
    return this.props.children;
  }
}