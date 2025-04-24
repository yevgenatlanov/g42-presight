import axios from "axios";

const API_URL = "/api/worker";

export interface WorkerRequest {
  data: any;
}

export interface WorkerResponse {
  success: boolean;
  requestId: string;
  status: string;
}

export const submitWorkerRequest = async (
  request: WorkerRequest
): Promise<WorkerResponse> => {
  try {
    const response = await axios.post<WorkerResponse>(
      `${API_URL}/process`,
      request
    );
    return response.data;
  } catch (error) {
    console.error("Error submitting worker request:", error);
    throw error;
  }
};

export const getQueueStatus = async () => {
  try {
    const response = await axios.get(`${API_URL}/status`);
    return response.data;
  } catch (error) {
    console.error("Error getting queue status:", error);
    throw error;
  }
};
