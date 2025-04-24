import React, { useState, useEffect } from "react";

import Button from "../../components/button";
import { socketService } from "../../actions/socket";
import { submitWorkerRequest } from "../../actions/webWorker";

interface RequestState {
  id: string;
  status: "pending" | "completed";
  result?: string;
  timestamp: Date;
}

const WebWorkerPage: React.FC = () => {
  const [requests, setRequests] = useState<RequestState[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Connect to socket server
    socketService.connect();

    // Listen for worker results
    const unsubscribe = socketService.on("worker:result", (data: any) => {
      setRequests((prevRequests) =>
        prevRequests.map((req) =>
          req.id === data.requestId
            ? { ...req, status: "completed", result: data.result }
            : req
        )
      );
    });

    // Clean up on unmount
    return () => {
      unsubscribe();
    };
  }, []);

  const handleSubmitRequests = async () => {
    setIsLoading(true);

    try {
      // Clear previous requests
      setRequests([]);

      // Submit 20 requests in parallel
      const newRequests = await Promise.all(
        Array.from({ length: 20 }).map(async (_, index) => {
          const response = await submitWorkerRequest({
            data: `Request ${index + 1}`,
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
      console.error("Error submitting requests:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          WebWorker Processing Demo
        </h1>
        <Button onClick={handleSubmitRequests} disabled={isLoading}>
          {isLoading ? "Processing..." : "Submit 20 Requests"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {requests.map((request) => (
          <div
            key={request.id}
            className="bg-white rounded-lg shadow overflow-hidden border border-gray-200"
          >
            <div
              className={`px-4 py-3 border-b border-gray-200 ${
                request.status === "completed" ? "bg-green-50" : "bg-yellow-50"
              }`}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">
                  Request ID: {request.id.substring(0, 8)}...
                </h3>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    request.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {request.status}
                </span>
              </div>
            </div>

            <div className="p-4">
              {request.status === "pending" ? (
                <div className="flex items-center justify-center py-4">
                  <div className="h-5 w-5 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div>
                  <span className="ml-2 text-sm text-gray-500">
                    Processing...
                  </span>
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
            Click the button above to submit 20 requests for processing.
          </p>
        </div>
      )}
    </div>
  );
};

export default WebWorkerPage;
