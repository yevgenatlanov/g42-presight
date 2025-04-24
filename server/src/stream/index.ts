import { Router } from "express";
import { streamController } from "./stream.controller";

const streamRouter = Router();

streamRouter.get("/text", streamController.getStreamedText);

export { streamRouter };
