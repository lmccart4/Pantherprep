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
          <div className="kicker mb-3">Erratum</div>
          <div className="mb-4 h-[2px] w-16 bg-ink" />
          <h2 className="mb-3 font-display text-3xl text-ink">Something went wrong.</h2>
          <p className="mb-6 max-w-sm italic text-ink-2">
            An unexpected error occurred. Try reloading the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="border-2 border-ink bg-accent px-6 py-2.5 font-mono text-xs font-bold uppercase tracking-[0.14em] text-accent-fg transition hover:bg-ink hover:text-paper"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
