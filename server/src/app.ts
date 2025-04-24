import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { userRouter } from "./user";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware";
import { corsMiddleware } from "./middleware/cors.middleware";
import { streamRouter } from "./stream";
import { workerRouter } from "./webworker";
import { redisWorkerRouter } from "./redis-worker";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(corsMiddleware);
app.use(helmet());
app.use(morgan("dev"));

app.use("/api", userRouter);

app.use("/api/stream", streamRouter);

app.use("/api/worker", workerRouter);

app.use("/api/redis-worker", redisWorkerRouter);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
