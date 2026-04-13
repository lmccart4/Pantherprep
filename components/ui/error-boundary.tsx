"use client";

import { Component, type ReactNode, type ErrorInfo } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary] Caught error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
          <div className="mb-4 text-4xl">⚠️</div>
          <h2 className="mb-2 font-display text-2xl text-white">Something went wrong</h2>
          <p className="mb-6 text-sm text-text-muted">
            An unexpected error occurred. Try reloading the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-radius-md bg-accent-red px-6 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
