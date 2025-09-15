import React from "react";

// Simple reusable Error Boundary to isolate runtime errors in complex trees
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Basic logging; can extend to remote telemetry later
    console.error("ErrorBoundary caught error", error, info);
    this.setState({ info });
    if (this.props.onError) {
      try {
        this.props.onError(error, info);
      } catch (_) {
        // swallow secondary errors
      }
    }
  }

  handleReset = () => {
    if (this.props.onReset) {
      try {
        this.props.onReset();
      } catch (_) {
        // ignore
      }
    }
    this.setState({ hasError: false, error: null, info: null });
  };

  render() {
    if (this.state.hasError) {
      const { error } = this.state;
      return (
        <div
          style={{
            padding: "1rem",
            border: "2px solid #c00",
            background: "#fff5f5",
          }}
        >
          <h2 style={{ marginTop: 0 }}>Si è verificato un errore inatteso</h2>
          <p>
            La sezione è stata isolata per evitare il blocco completo
            dell'applicazione.
          </p>
          {error && (
            <pre
              style={{
                whiteSpace: "pre-wrap",
                background: "#ffecec",
                padding: "0.5rem",
                maxHeight: 200,
                overflow: "auto",
              }}
            >
              {String(error.message || error)}
            </pre>
          )}
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <button onClick={this.handleReset}>Riprova</button>
            {this.props.renderExtra &&
              this.props.renderExtra({ error, reset: this.handleReset })}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
