import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}
interface State {
  error: Error | null;
}

/** Catches errors while rendering, so a crash shows a message instead of a blank page. */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <main className="flex min-h-screen items-center justify-center bg-canvas p-6">
        <div className="max-w-md text-center">
          <h1 className="text-xl font-semibold tracking-tight text-fg">Something went wrong</h1>
          <p className="mt-2 break-words text-sm text-muted">{this.state.error.message}</p>
          <button
            type="button"
            onClick={() => this.setState({ error: null })}
            className="mt-5 inline-flex h-10 items-center justify-center rounded-xl bg-action px-4 text-sm font-medium text-on-action transition-colors hover:bg-action-hover"
          >
            Try again
          </button>
        </div>
      </main>
    );
  }
}
