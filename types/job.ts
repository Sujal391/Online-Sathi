export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  jobType: string;
  salary: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  skills: string[];
  experience: string;
  education: string;
  postedDate: string;
  deadline: string;
  status: string;
}

export interface JobSearchResponse {
  success: boolean;
  jobs: Job[];
  total: number;
  page: number;
  limit: number;
}

export interface CanViewJobsResponse {
  success: boolean;
  canView: boolean;
  message?: string;
}

export interface ApplyJobRequest {
  coverLetter: string;
  resumeUrl: string;
}

export interface ApplyJobResponse {
  success: boolean;
  message: string;
  applicationId?: string;
}
