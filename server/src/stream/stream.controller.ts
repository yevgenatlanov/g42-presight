import { Request, Response } from "express";
import { StreamService } from "./stream.service";

export class StreamController {
  private service = new StreamService();

  getStreamedText = (req: Request, res: Response): void => {
    try {
      console.log("[StreamController] Incoming request to /api/stream");

      res.setHeader("Content-Type", "text/plain");
      res.setHeader("Transfer-Encoding", "chunked");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      this.service.streamText(res);

      console.log("[StreamController] Started streaming text...");
    } catch (error) {
      console.error("[StreamController] Error while streaming:", error);
      if (!res.headersSent) {
        res
          .status(500)
          .json({ success: false, error: "Failed to stream text" });
      }
    }
  };
}

export const streamController = new StreamController();
