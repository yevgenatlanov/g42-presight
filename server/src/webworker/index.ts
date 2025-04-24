import { Router } from "express";
import { workerController } from "./webworker.controller";

const workerRouter = Router();

workerRouter.post("/process", workerController.processRequest);
workerRouter.get("/status", workerController.getQueueStatus);

export { workerRouter };
