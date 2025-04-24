import { Queue, Worker, Job } from "bullmq";
import { Redis } from "ioredis";
import { io } from "../socket";

type JobStatus = "pending" | "processing" | "completed" | "failed";

interface JobData {
  id: string;
  data: any;
  status: JobStatus;
  timestamp: Date;
}

// nobody asked but i've decided to add this as alternative solution
// i took some parts from other projects and it's not fully structured properly, just for demo is ok.

export class QueueService {
  private static instance: QueueService;
  public queue: Queue;
  private worker!: Worker;
  private redis: Redis;

  private constructor() {
    // Initialize Redis connection
    // yeah i know it's supposed to be in separate file somewhere in ~/config but it's demo right? 

    this.redis = new Redis({
      host: process.env.REDIS_HOST || "localhost",
      port: Number(process.env.REDIS_PORT) || 6379,
      password: process.env.REDIS_PASSWORD,
      maxRetriesPerRequest: null,
    });

    this.queue = new Queue("tasks", {
      connection: this.redis,
      defaultJobOptions: {
        removeOnComplete: 100,
        removeOnFail: 100,
        attempts: 3,
      },
    });

    this.setupWorker();
  }

  public static getInstance(): QueueService {
    if (!QueueService.instance) {
      QueueService.instance = new QueueService();
    }
    return QueueService.instance;
  }

  public async addJob(data: JobData): Promise<string> {
    const job = await this.queue.add("process", data, { jobId: data.id });
    return job.id as string;
  }

  public async getJobs(): Promise<JobData[]> {
    const states: Array<string> = ["waiting", "active", "completed", "failed"];
    const jobs = await this.queue.getJobs(states as any);

    return jobs.map((job) => {
      const status = this.getJobStatus(job);

      return {
        id: job.id || "",
        data: job.data?.data,
        status,
        timestamp: new Date(job.timestamp),
        ...(job.returnvalue && { result: job.returnvalue }),
        ...(job.failedReason && { error: job.failedReason }),
      };
    });
  }

  public async getJob(id: string): Promise<JobData | null> {
    const job = await this.queue.getJob(id);
    if (!job) return null;

    const status = this.getJobStatus(job);

    return {
      id: job.id || "",
      data: job.data?.data,
      status,
      timestamp: new Date(job.timestamp),
      ...(job.returnvalue && { result: job.returnvalue }),
      ...(job.failedReason && { error: job.failedReason }),
    };
  }

  public async retryJob(id: string): Promise<boolean> {
    const job = await this.queue.getJob(id);
    if (!job) return false;

    const state = await job.getState();
    if (state !== "failed") return false;

    await job.retry();
    return true;
  }

  private setupWorker(): void {
    this.worker = new Worker(
      "tasks",
      async (job: Job) => {
        console.log(`Processing job ${job.id}`);

        try {
          await job.updateData({
            ...job.data,
            status: "processing",
          });
         
          await new Promise((resolve) => setTimeout(resolve, 2000));

          const result = `Processed: ${job.data.data} at ${new Date().toISOString()}`;

          io.emit("worker:result", {
            requestId: job.id,
            result,
            status: "completed",
            completedAt: new Date(),
          });

          return result;
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
          console.error(`Job ${job.id} failed:`, errorMessage);

          io.emit("worker:error", {
            requestId: job.id,
            error: errorMessage,
            status: "failed",
            failedAt: new Date(),
          });

          throw error;
        }
      },
      { connection: this.redis }
    );

    this.worker.on("completed", (job) => {
      if (job) {
        console.log(`Job ${job.id} completed`);
      }
    });

    this.worker.on("failed", (job, error) => {
      if (job) {
        console.error(`Job ${job.id} failed:`, error);
      }
    });
  }

  private getJobStatus(job: Job): JobStatus {
    if (job.finishedOn) return "completed";
    if (job.processedOn) return "processing";
    if (job.failedReason) return "failed";
    return "pending";
  }
}

export const queueService = QueueService.getInstance();
