import axios from "axios";

const API_URL = "/api/redis-worker";

export interface WorkerRequest {
  data: any;
}

export interface WorkerResponse {
  success: boolean;
  requestId: string;
  status: string;
  queue?: string;
}

export interface JobDetails {
  id: string;
  data: any;
  status: string;
  timestamp: string;
  result?: string;
  error?: string;
}

export interface QueueStatusResponse {
  success: boolean;
  queue: JobDetails[];
}

export const submitRedisRequest = async (
  request: WorkerRequest
): Promise<WorkerResponse> => {
  try {
    const response = await axios.post<WorkerResponse>(
      `${API_URL}/process`,
      request
    );
    return response.data;
  } catch (error) {
    console.error("Error submitting Redis worker request:", error);
    throw error;
  }
};

export const getRedisQueueStatus = async (): Promise<QueueStatusResponse> => {
  try {
    const response = await axios.get<QueueStatusResponse>(`${API_URL}/queue`);
    return response.data;
  } catch (error) {
    console.error("Error getting Redis queue status:", error);
    throw error;
  }
};

export const getRedisJob = async (
  jobId: string
): Promise<{ success: boolean; job: JobDetails }> => {
  try {
    const response = await axios.get(`${API_URL}/job/${jobId}`);
    return response.data;
  } catch (error) {
    console.error(`Error getting Redis job ${jobId}:`, error);
    throw error;
  }
};

export const retryRedisJob = async (
  jobId: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await axios.post(`${API_URL}/job/${jobId}/retry`);
    return response.data;
  } catch (error) {
    console.error(`Error retrying Redis job ${jobId}:`, error);
    throw error;
  }
};
