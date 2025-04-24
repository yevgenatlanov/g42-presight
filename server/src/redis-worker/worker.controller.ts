import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { QueueService } from "./worker.queue";

// nobody asked but i've decided to add this as alternative solution
// i took some parts from other projects and it's not fully structured properly, just for demo is ok.

export class RedisWorkerController {
  private queueService: QueueService;

  constructor() {
    this.queueService = QueueService.getInstance();
  }

  processRequest = async (req: Request, res: Response): Promise<void> => {
    try {
      const requestId = uuidv4();

      // Cooking job
      const jobData = {
        id: requestId,
        data: req.body.data || "Redis worker request data",
        status: "pending" as const,
        timestamp: new Date(),
      };

      // Push it to queue
      await this.queueService.addJob(jobData);

      // Return with ID
      res.status(202).json({
        success: true,
        requestId,
        status: "pending",
        queue: "redis",
      });
    } catch (error) {
      console.error("Error queuing Redis request:", error);
      res.status(500).json({
        success: false,
        error: "Failed to process Redis request",
      });
    }
  };

  getQueueStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const jobs = await this.queueService.getJobs();
      res.status(200).json({
        success: true,
        queue: jobs,
      });
    } catch (error) {
      console.error("Error getting Redis queue status:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get Redis queue status",
      });
    }
  };

  getJob = async (req: Request, res: Response): Promise<void> => {
    try {
      const { jobId } = req.params;
      const job = await this.queueService.getJob(jobId);

      if (!job) {
        res.status(404).json({
          success: false,
          error: "Redis job not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        job,
      });
    } catch (error) {
      console.error("Error getting Redis job:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get Redis job",
      });
    }
  };

  retryJob = async (req: Request, res: Response): Promise<void> => {
    try {
      const { jobId } = req.params;
      const success = await this.queueService.retryJob(jobId);

      if (!success) {
        res.status(400).json({
          success: false,
          error: "Redis job not found or not in failed state",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: `Redis job ${jobId} queued for retry`,
      });
    } catch (error) {
      console.error("Error retrying Redis job:", error);
      res.status(500).json({
        success: false,
        error: "Failed to retry Redis job",
      });
    }
  };
}

export const redisWorkerController = new RedisWorkerController();
