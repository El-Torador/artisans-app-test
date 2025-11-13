import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Button, Typography, Paper, Alert } from '@mui/material';
import { UnAuthenticatedError } from '../utils';

type FallbackProps = {
  error: Error | null;
  reset: () => void;
};

type ErrorBoundaryProps = {
  children: ReactNode;
  /** A React component to render when an error occurs. Receives { error, reset } */
  FallbackComponent?: React.ComponentType<FallbackProps>;
  /** Or a React node to show as fallback UI */
  fallback?: ReactNode;
  /** Optional callback to report/log errors */
  onError?: (error: Error, info: ErrorInfo) => void;
  /** When these keys change, the boundary will reset */
  resetKeys?: any[];
};

type State = {
  hasError: boolean;
  error: Error | null;
};

function shallowEqualArray(a?: any[], b?: any[]) {
  if (a === b) return true;
  if (!a || !b) return false;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

/**
 * ErrorBoundary class component.
 * - Use FallbackComponent prop to pass a custom fallback component that receives {error, reset}.
 * - Or pass a `fallback` React node to show a simple element.
 * - `onError` is called with (error, info) so you can report errors to a service.
 * - `resetKeys` can be used to automatically reset the error boundary when inputs change.
 */
export default class ErrorBoundary extends Component<ErrorBoundaryProps, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Default behavior: console.error, and call optional onError callback
    try {
      // keep a clear, consistent log
      if (this.props.onError) this.props.onError(error, info);

      // If the error indicates the user is unauthenticated, redirect to home
      if (error instanceof UnAuthenticatedError) {
        // Use a full navigation to the home page
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
        return;
      }
    } catch (e) {
      // swallow logging errors to avoid cascading failures
    }
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    // If resetKeys are provided and changed, reset the boundary
    if (!shallowEqualArray(this.props.resetKeys, prevProps.resetKeys)) {
      // only reset if there was an error
      if (this.state.hasError) this.reset();
    }
  }

  reset = () => this.setState({ hasError: false, error: null });

  render() {
    const { children, FallbackComponent, fallback } = this.props;
    const { hasError, error } = this.state;

    if (error instanceof UnAuthenticatedError) {
      return null;
    }

    if (hasError) {
      if (FallbackComponent) return <FallbackComponent error={error} reset={this.reset} />;
      if (fallback) return <>{fallback}</>;

      // default fallback UI (Material UI)
      return (
        <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }} role="alert">
          <Paper elevation={3} sx={{ p: 3, maxWidth: 800, width: '100%' }}>
            <Alert severity="error" sx={{ mb: 2 }}>
              <Typography variant="h6">Something went wrong.</Typography>
            </Alert>

            {error && (
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mb: 2 }}>
                {error.message}
              </Typography>
            )}

            <Box sx={{ textAlign: 'center' }}>
              <Button variant="contained" onClick={this.reset}>
                Try again
              </Button>
            </Box>
          </Paper>
        </Box>
      );
    }

    // normal render
    return children as ReactNode;
  }
}
