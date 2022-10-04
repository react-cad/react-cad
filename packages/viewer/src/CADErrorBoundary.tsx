import React from "react";

interface Props {
  shape: any;
  log: (error: unknown, info: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
}

// Prevents errors in the CAD model corrupting the viewer
export class CADErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(_error: unknown): State {
    return { hasError: true };
  }
  componentDidCatch(error: unknown, errorInfo: React.ErrorInfo): void {
    this.props.log(error, errorInfo);
  }
  componentDidUpdate(prevProps: Props): void {
    if (this.state.hasError && prevProps.shape !== this.props.shape) {
      this.setState({ hasError: false });
    }
  }
  render(): React.ReactNode {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}

export default CADErrorBoundary;
