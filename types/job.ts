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
  payStructure: string;
  offeredAmount: number;
  openings: number;
  shift: string;
  urgentHiring: boolean;
  gender: string;
  minAge: number;
  maxAge: number;
  country: string;
  state: string;
  district: string;
  pincode: string;
  fullAddress: string;
  weekOffDays: string;
  facilities: string[];
  joiningFees: boolean;
  contactName: string;
  contactNumber: string;
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

export interface AdminJobPostPayload {
  jobRole: string;
  jobDescription: string;
  requiredSkills: string[];
  jobType: string;
  payStructure: string;
  offeredAmount: number;
  openings: number;
  shift: string;
  urgentHiring: boolean;
  education: string;
  experience: number;
  gender: string;
  minAge: number;
  maxAge: number;
  country: string;
  state: string;
  district: string;
  pincode: string;
  fullAddress: string;
  weekOffDays: string;
  facilities: string[];
  joiningFees: boolean;
  contactName: string;
  contactNumber: string;
}

export interface AdminJobPost extends AdminJobPostPayload {
  id: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AdminJobsResponse {
  success: boolean;
  jobs: AdminJobPost[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateAdminJobPostResponse {
  success: boolean;
  message: string;
  job?: AdminJobPost;
}
