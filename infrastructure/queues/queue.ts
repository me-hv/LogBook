export interface Job {
  id: string;
  name: string;
  payload: any;
  retries: number;
  maxRetries: number;
  status: "pending" | "processing" | "completed" | "failed";
}

/**
 * Planet-Scale Queues: Background tasks worker queues manager.
 */
class JobQueueManager {
  private queue: Job[] = [];

  /**
   * Push background job to queue.
   */
  async push(name: string, payload: any, maxRetries = 3): Promise<string> {
    const id = `job_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    this.queue.push({
      id,
      name,
      payload,
      retries: 0,
      maxRetries,
      status: "pending",
    });

    // Fire non-blocking worker loop
    this.processQueue();
    return id;
  }

  /**
   * Worker queue processing loop.
   */
  private async processQueue() {
    const job = this.queue.find((j) => j.status === "pending");
    if (!job) return;

    job.status = "processing";
    try {
      // Simulate task processing (e.g. newsletter deliveries, media optimizations, AI gens)
      await new Promise((resolve) => setTimeout(resolve, 800));
      job.status = "completed";
      console.log(`[Queue Worker] Job ${job.name} (${job.id}) completed successfully.`);
    } catch (err) {
      job.retries++;
      if (job.retries < job.maxRetries) {
        job.status = "pending"; // retry later
        console.warn(`[Queue Worker] Job ${job.name} failed. Retrying (${job.retries}/${job.maxRetries}).`);
      } else {
        job.status = "failed";
        console.error(`[Queue Worker] Job ${job.name} failed permanently.`);
      }
    } finally {
      // Process next in queue
      this.processQueue();
    }
  }

  /**
   * Get queue health status log metrics.
   */
  getHealthMetrics() {
    return {
      total: this.queue.length,
      completed: this.queue.filter((j) => j.status === "completed").length,
      failed: this.queue.filter((j) => j.status === "failed").length,
      pending: this.queue.filter((j) => j.status === "pending").length,
    };
  }
}

export const queue = new JobQueueManager();
