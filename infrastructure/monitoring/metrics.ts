export interface MetricPayload {
  route: string;
  durationMs: number;
  statusCode: number;
  timestamp: string;
}

/**
 * Planet-Scale Observability: Edge request latency and health logs metrics tracker.
 */
class ObservabilityTracker {
  private metrics: MetricPayload[] = [];

  /**
   * Log API request latencies.
   */
  logRequest(route: string, durationMs: number, statusCode = 200) {
    const payload: MetricPayload = {
      route,
      durationMs,
      statusCode,
      timestamp: new Date().toISOString(),
    };
    this.metrics.push(payload);
    
    // Cap in-memory history logs
    if (this.metrics.length > 500) {
      this.metrics.shift();
    }
  }

  /**
   * Calculate P99 and P95 latency stats metrics.
   */
  getLatencyMetrics() {
    if (this.metrics.length === 0) return { p95: 0, p99: 0, avg: 0, errorRate: 0 };

    const sorted = [...this.metrics].map((m) => m.durationMs).sort((a, b) => a - b);
    const p95Idx = Math.floor(sorted.length * 0.95);
    const p99Idx = Math.floor(sorted.length * 0.99);
    const sum = sorted.reduce((acc, curr) => acc + curr, 0);

    const failed = this.metrics.filter((m) => m.statusCode >= 400).length;

    return {
      p95: sorted[p95Idx] || 0,
      p99: sorted[p99Idx] || 0,
      avg: Math.round(sum / sorted.length),
      errorRate: parseFloat(((failed / this.metrics.length) * 100).toFixed(2)),
    };
  }
}

export const monitor = new ObservabilityTracker();
