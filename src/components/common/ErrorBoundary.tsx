import React from "react";

interface ErrorBoundaryProps {
  onRetry: () => void;
  children?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    this.props.onRetry();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-2 rounded mb-4">
          <p>Error: {this.state.error?.message}</p>
          <button
            className="ml-3 underline hover:text-yellow-400"
            onClick={this.handleRetry}
          >
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
