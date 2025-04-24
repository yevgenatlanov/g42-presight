export interface QueueItem {
  id: string;
  data: any;
  status: "pending" | "processing" | "completed";
  timestamp: Date;
  result?: any;
}

export class WorkerQueue {
  private static instance: WorkerQueue;
  private queue: QueueItem[] = [];

  private constructor() {}

  public static getInstance(): WorkerQueue {
    if (!WorkerQueue.instance) {
      WorkerQueue.instance = new WorkerQueue();
    }
    return WorkerQueue.instance;
  }

  public enqueue(item: QueueItem): void {
    this.queue.push(item);
  }

  public dequeue(): QueueItem | undefined {
    if (this.queue.length === 0) return undefined;

    // Get the first pending item
    const item = this.queue.find((item) => item.status === "pending");

    if (item) {
      // Mark as processing
      item.status = "processing";
      return item;
    }

    return undefined;
  }

  public getQueue(): QueueItem[] {
    return [...this.queue];
  }

  public updateItem(id: string, update: Partial<QueueItem>): boolean {
    const index = this.queue.findIndex((item) => item.id === id);
    if (index !== -1) {
      this.queue[index] = { ...this.queue[index], ...update };
      return true;
    }
    return false;
  }
}
