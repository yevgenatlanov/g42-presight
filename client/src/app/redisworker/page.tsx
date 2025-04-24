import React, { useState, useEffect } from "react";
import Button from "../../components/button";
import { socketService } from "../../actions/socket";
import {
  submitRedisRequest,
  getRedisQueueStatus,
} from "../../actions/redisWorker";

interface RequestState {
  id: string;
  status: "pending" | "processing" | "completed" | "failed";
  result?: string;
  error?: string;
  timestamp: Date;
}

const RedisWorkerPage: React.FC = () => {
  const [requests, setRequests] = useState<RequestState[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalProcessed, setTotalProcessed] = useState(0);

  useEffect(() => {
    // connecting to socket
    socketService.connect();

    // and listen to results
    const resultUnsubscribe = socketService.on("worker:result", (data: any) => {
      setRequests((prevRequests) =>
        prevRequests.map((req) =>
          req.id === data.requestId
            ? {
                ...req,
                status: "completed",
                result: data.result,
                timestamp: new Date(data.completedAt || Date.now()),
              }
            : req
        )
      );
      setTotalProcessed((prev) => prev + 1);
    });

    // listening to errors
    const errorUnsubscribe = socketService.on("worker:error", (data: any) => {
      setRequests((prevRequests) =>
        prevRequests.map((req) =>
          req.id === data.requestId
            ? {
                ...req,
                status: "failed",
                error: data.error,
                timestamp: new Date(data.failedAt || Date.now()),
              }
            : req
        )
      );
    });

    // Unmount
    return () => {
      resultUnsubscribe();
      errorUnsubscribe();
    };
  }, []);

  const handleSubmitRequests = async () => {
    setIsLoading(true);
    setTotalProcessed(0);

    try {
      // cleanup
      setRequests([]);

      // Submit 20 requests in parallel
      const newRequests = await Promise.all(
        Array.from({ length: 20 }).map(async (_, index) => {
          const response = await submitRedisRequest({
            data: `Redis Request ${index + 1}`,
          });

          return {
            id: response.requestId,
            status: "pending" as const,
            timestamp: new Date(),
          };
        })
      );

      setRequests(newRequests);
    } catch (error) {
      console.error("Error submitting Redis requests:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshQueueStatus = async () => {
    try {
      const response = await getRedisQueueStatus();

      if (response.success && response.queue) {
        // Update our local state with the latest from the server
        const currentIds = new Set(requests.map((r) => r.id));
        const updatedRequests = [...requests];

        response.queue.forEach((job) => {
          if (currentIds.has(job.id)) {
            // Update existing request
            const index = updatedRequests.findIndex((r) => r.id === job.id);
            if (index !== -1) {
              updatedRequests[index] = {
                ...updatedRequests[index],
                status: job.status as any,
                result: job.result,
                timestamp: new Date(job.timestamp),
              };
            }
          } else {
            // Add new request we didn't know about
            updatedRequests.push({
              id: job.id,
              status: job.status as any,
              result: job.result,
              timestamp: new Date(job.timestamp),
            });
          }
        });

        setRequests(updatedRequests);
      }
    } catch (error) {
      console.error("Error refreshing queue status:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getCardBgColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-50";
      case "processing":
        return "bg-blue-50";
      case "failed":
        return "bg-red-50";
      default:
        return "bg-yellow-50";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Redis + BullMQ Worker
          </h1>
          <p className="text-sm text-gray-500">
            Processed: {totalProcessed}/{requests.length} requests
            {requests.length > 0 &&
              ` (${Math.round((totalProcessed / requests.length) * 100)}%)`}
          </p>
        </div>
        <div className="space-x-2">
          <Button
            onClick={refreshQueueStatus}
            variant="outline"
            disabled={isLoading}
          >
            Refresh Status
          </Button>
          <Button onClick={handleSubmitRequests} disabled={isLoading}>
            {isLoading ? "Processing..." : "Submit 20 Requests"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {requests.map((request) => (
          <div
            key={request.id}
            className="bg-white rounded-lg shadow overflow-hidden border border-gray-200"
          >
            <div
              className={`px-4 py-3 border-b border-gray-200 ${getCardBgColor(request.status)}`}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">
                  Request ID: {request.id.substring(0, 8)}...
                </h3>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${getStatusColor(request.status)}`}
                >
                  {request.status}
                </span>
              </div>
            </div>

            <div className="p-4">
              {request.status === "pending" ||
              request.status === "processing" ? (
                <div className="flex items-center justify-center py-4">
                  <div className="h-5 w-5 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div>
                  <span className="ml-2 text-sm text-gray-500">
                    {request.status === "processing"
                      ? "Processing..."
                      : "Waiting..."}
                  </span>
                </div>
              ) : request.status === "failed" ? (
                <div className="text-sm text-red-600">
                  <p className="font-semibold">Error:</p>
                  <p>{request.error || "Unknown error occurred"}</p>
                </div>
              ) : (
                <div className="text-sm text-gray-700">
                  <p>{request.result}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {requests.length === 0 && !isLoading && (
        <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <p className="text-gray-500">
            Click to submit 20 requests for Redis processing.
          </p>
        </div>
      )}
    </div>
  );
};

export default RedisWorkerPage;
