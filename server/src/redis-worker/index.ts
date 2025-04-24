import { Router } from "express";
import { redisWorkerController } from "./worker.controller";

const redisWorkerRouter = Router();

redisWorkerRouter.post("/process", redisWorkerController.processRequest);
redisWorkerRouter.get("/queue", redisWorkerController.getQueueStatus);
redisWorkerRouter.get("/job/:jobId", redisWorkerController.getJob);
redisWorkerRouter.post("/job/:jobId/retry", redisWorkerController.retryJob);

export { redisWorkerRouter };
