import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { WorkerQueue } from "./webworker.queue";
import { io } from "../socket";

export class WorkerController {
  private queue: WorkerQueue;

  constructor() {
    this.queue = WorkerQueue.getInstance();
    this.setupWorkerProcessing();
  }

  processRequest = (req: Request, res: Response): void => {
    try {
      // Generate unique ID for this request
      const requestId = uuidv4();

      // Add request to queue with pending status
      this.queue.enqueue({
        id: requestId,
        data: req.body.data || "Default request data",
        status: "pending",
        timestamp: new Date(),
      });

      // Return the request ID immediately
      res.status(202).json({
        success: true,
        requestId,
        status: "pending",
      });
    } catch (error) {
      console.error("Error queuing request:", error);
      res.status(500).json({
        success: false,
        error: "Failed to process request",
      });
    }
  };

  getQueueStatus = (req: Request, res: Response): void => {
    try {
      const queueStatus = this.queue.getQueue();
      res.status(200).json({
        success: true,
        queue: queueStatus,
      });
    } catch (error) {
      console.error("Error getting queue status:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get queue status",
      });
    }
  };

  // Setup worker processing
  private setupWorkerProcessing(): void {
    // Process queue items in intervals
    setInterval(() => {
      const item = this.queue.dequeue();
      if (item) {
        this.processInWorker(item);
      }
    }, 1000); // Check queue every second
  }

  // Simulate web worker processing
  private processInWorker(item: any): void {
    // In a real application, this would be offloaded to a web worker
    setTimeout(() => {
      // Processing complete, update status
      const result = `Processed request ${item.id}: ${item.data} at ${new Date().toISOString()}`;

      // Emit result via socket
      io.emit("worker:result", {
        requestId: item.id,
        result,
        status: "completed",
        completedAt: new Date(),
      });
    }, 2000); // Simulate 2 second processing time
  }
}

export const workerController = new WorkerController();
