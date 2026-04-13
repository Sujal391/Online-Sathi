import { api } from "./api";
import type {
  JobSearchResponse,
  CanViewJobsResponse,
  ApplyJobRequest,
  ApplyJobResponse,
} from "@/types/job";

export const jobService = {
  async canViewJobs(): Promise<CanViewJobsResponse> {
    return api.get("/job-profile/can-view-jobs");
  },

  async searchJobs(params: {
    keyword?: string;
    location?: string;
    page?: number;
    limit?: number;
  }): Promise<JobSearchResponse> {
    const queryParams = new URLSearchParams();
    
    if (params.keyword) queryParams.append("keyword", params.keyword);
    if (params.location) queryParams.append("location", params.location);
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());

    const queryString = queryParams.toString();
    return api.get(`/jobs/search${queryString ? `?${queryString}` : ""}`);
  },

  async applyForJob(
    jobId: string,
    data: ApplyJobRequest
  ): Promise<ApplyJobResponse> {
    return api.post(`/jobs/${jobId}/apply`, data);
  },
};
