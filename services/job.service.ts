import { api } from "./api";
import type {
  JobSearchResponse,
  CanViewJobsResponse,
  ApplyJobRequest,
  ApplyJobResponse,
  Job,
  AdminJobPostPayload,
  CreateAdminJobPostResponse,
  AdminJobsResponse,
  AdminJobPost,
} from "@/types/job";

function normalizeStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }

  return [];
}

function normalizeLocation(rawJob: Record<string, unknown>): {
  country: string;
  state: string;
  district: string;
  pincode: string;
  fullAddress: string;
} {
  return {
    country: typeof rawJob.country === "string" ? rawJob.country : "",
    state: typeof rawJob.state === "string" ? rawJob.state : "",
    district: typeof rawJob.district === "string" ? rawJob.district : "",
    pincode: typeof rawJob.pincode === "string" ? rawJob.pincode : "",
    fullAddress:
      typeof rawJob.fullAddress === "string" ? rawJob.fullAddress : "",
  };
}

function normalizeUserJob(rawJob: unknown, index: number): Job {
  const source =
    rawJob && typeof rawJob === "object" ? (rawJob as Record<string, unknown>) : {};
  const location = normalizeLocation(source);
  const title =
    typeof source.title === "string"
      ? source.title
      : typeof source.jobRole === "string"
        ? source.jobRole
        : "";
  const description =
    typeof source.description === "string"
      ? source.description
      : typeof source.jobDescription === "string"
        ? source.jobDescription
        : "";
  const skills = normalizeStringArray(
    source.skills ?? source.requiredSkills ?? source.requirements
  );

  return {
    id:
      typeof source.id === "string"
        ? source.id
        : typeof source._id === "string"
          ? source._id
          : `job-${index}`,
    title,
    company:
      typeof source.company === "string"
        ? source.company
        : typeof source.contactName === "string"
          ? source.contactName
          : "Online Sathi",
    location:
      typeof source.location === "string"
        ? source.location
        : [location.district, location.state, location.country]
            .filter(Boolean)
            .join(", "),
    jobType: typeof source.jobType === "string" ? source.jobType : "",
    payStructure:
      typeof source.payStructure === "string" ? source.payStructure : "",
    offeredAmount:
      typeof source.offeredAmount === "number"
        ? source.offeredAmount
        : typeof source.offeredAmount === "string"
          ? Number(source.offeredAmount) || 0
          : 0,
    salary:
      typeof source.salary === "string"
        ? source.salary
        : typeof source.offeredAmount === "number"
          ? new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
              maximumFractionDigits: 0,
            }).format(source.offeredAmount)
          : typeof source.offeredAmount === "string" &&
              Number(source.offeredAmount)
            ? new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0,
              }).format(Number(source.offeredAmount))
            : "Not specified",
    description,
    requirements: normalizeStringArray(
      source.requirements ?? source.requiredSkills
    ),
    responsibilities: normalizeStringArray(source.responsibilities),
    skills,
    openings:
      typeof source.openings === "number"
        ? source.openings
        : typeof source.openings === "string"
          ? Number(source.openings) || 0
          : 0,
    shift: typeof source.shift === "string" ? source.shift : "",
    urgentHiring: Boolean(source.urgentHiring),
    experience:
      typeof source.experience === "string"
        ? source.experience
        : typeof source.experience === "number"
          ? `${source.experience} years`
          : "Not specified",
    education: typeof source.education === "string" ? source.education : "",
    gender: typeof source.gender === "string" ? source.gender : "Any",
    minAge:
      typeof source.minAge === "number"
        ? source.minAge
        : typeof source.minAge === "string"
          ? Number(source.minAge) || 0
          : 0,
    maxAge:
      typeof source.maxAge === "number"
        ? source.maxAge
        : typeof source.maxAge === "string"
          ? Number(source.maxAge) || 0
          : 0,
    country: location.country,
    state: location.state,
    district: location.district,
    pincode: location.pincode,
    fullAddress: location.fullAddress,
    weekOffDays:
      typeof source.weekOffDays === "string" ? source.weekOffDays : "",
    facilities: normalizeStringArray(source.facilities),
    joiningFees: Boolean(source.joiningFees),
    contactName:
      typeof source.contactName === "string" ? source.contactName : "",
    contactNumber:
      typeof source.contactNumber === "string" ? source.contactNumber : "",
    postedDate:
      typeof source.postedDate === "string"
        ? source.postedDate
        : typeof source.createdAt === "string"
          ? source.createdAt
          : new Date().toISOString(),
    deadline:
      typeof source.deadline === "string"
        ? source.deadline
        : typeof source.updatedAt === "string"
          ? source.updatedAt
          : new Date().toISOString(),
    status: typeof source.status === "string" ? source.status : "ACTIVE",
  };
}

function extractUserJobsPayload(payload: unknown): {
  jobs: unknown[];
  total: number;
  page: number;
  limit: number;
  success: boolean;
} {
  const source =
    payload && typeof payload === "object"
      ? (payload as Record<string, unknown>)
      : {};

  const nested =
    source.data && typeof source.data === "object"
      ? (source.data as Record<string, unknown>)
      : source;

  const rawJobs = [nested.jobs, nested.items, nested.results, source.jobs].find(
    Array.isArray
  ) as unknown[] | undefined;

  const totalCandidate = nested.total ?? source.total;
  const pageCandidate = nested.page ?? source.page;
  const limitCandidate = nested.limit ?? source.limit;

  return {
    jobs: rawJobs ?? [],
    total:
      typeof totalCandidate === "number"
        ? totalCandidate
        : typeof totalCandidate === "string"
          ? Number(totalCandidate) || (rawJobs?.length ?? 0)
          : rawJobs?.length ?? 0,
    page:
      typeof pageCandidate === "number"
        ? pageCandidate
        : typeof pageCandidate === "string"
          ? Number(pageCandidate) || 1
          : 1,
    limit:
      typeof limitCandidate === "number"
        ? limitCandidate
        : typeof limitCandidate === "string"
          ? Number(limitCandidate) || 20
          : 20,
    success: typeof source.success === "boolean" ? source.success : true,
  };
}

function normalizeAdminJob(rawJob: unknown, index: number): AdminJobPost {
  const source =
    rawJob && typeof rawJob === "object" ? (rawJob as Record<string, unknown>) : {};
  const location = normalizeLocation(source);

  return {
    id:
      typeof source.id === "string"
        ? source.id
        : typeof source._id === "string"
          ? source._id
          : `job-${index}`,
    jobRole:
      typeof source.jobRole === "string"
        ? source.jobRole
        : typeof source.title === "string"
          ? source.title
          : "",
    jobDescription:
      typeof source.jobDescription === "string"
        ? source.jobDescription
        : typeof source.description === "string"
          ? source.description
          : "",
    requiredSkills: normalizeStringArray(
      source.requiredSkills ?? source.skills ?? source.requirements
    ),
    jobType: typeof source.jobType === "string" ? source.jobType : "",
    payStructure:
      typeof source.payStructure === "string" ? source.payStructure : "",
    offeredAmount:
      typeof source.offeredAmount === "number"
        ? source.offeredAmount
        : typeof source.offeredAmount === "string"
          ? Number(source.offeredAmount) || 0
          : 0,
    openings:
      typeof source.openings === "number"
        ? source.openings
        : typeof source.openings === "string"
          ? Number(source.openings) || 0
          : 0,
    shift: typeof source.shift === "string" ? source.shift : "",
    urgentHiring: Boolean(source.urgentHiring),
    education: typeof source.education === "string" ? source.education : "",
    experience:
      typeof source.experience === "number"
        ? source.experience
        : typeof source.experience === "string"
          ? Number(source.experience) || 0
          : 0,
    gender: typeof source.gender === "string" ? source.gender : "Any",
    minAge:
      typeof source.minAge === "number"
        ? source.minAge
        : typeof source.minAge === "string"
          ? Number(source.minAge) || 0
          : 0,
    maxAge:
      typeof source.maxAge === "number"
        ? source.maxAge
        : typeof source.maxAge === "string"
          ? Number(source.maxAge) || 0
          : 0,
    country: location.country,
    state: location.state,
    district: location.district,
    pincode: location.pincode,
    fullAddress: location.fullAddress,
    weekOffDays:
      typeof source.weekOffDays === "string" ? source.weekOffDays : "",
    facilities: normalizeStringArray(source.facilities),
    joiningFees: Boolean(source.joiningFees),
    contactName:
      typeof source.contactName === "string" ? source.contactName : "",
    contactNumber:
      typeof source.contactNumber === "string" ? source.contactNumber : "",
    status: typeof source.status === "string" ? source.status : "ACTIVE",
    createdAt:
      typeof source.createdAt === "string"
        ? source.createdAt
        : typeof source.postedDate === "string"
          ? source.postedDate
          : new Date().toISOString(),
    updatedAt: typeof source.updatedAt === "string" ? source.updatedAt : undefined,
  };
}

function extractAdminJobsPayload(payload: unknown): {
  jobs: unknown[];
  total: number;
  page: number;
  limit: number;
  success: boolean;
} {
  const source =
    payload && typeof payload === "object"
      ? (payload as Record<string, unknown>)
      : {};

  const nested =
    source.data && typeof source.data === "object"
      ? (source.data as Record<string, unknown>)
      : source;

  const rawJobs = [nested.jobs, nested.items, nested.jobPosts, source.jobs].find(
    Array.isArray
  ) as unknown[] | undefined;

  const pagination =
    nested.pagination && typeof nested.pagination === "object"
      ? (nested.pagination as Record<string, unknown>)
      : {};

  const totalCandidate = nested.total ?? pagination.total;
  const pageCandidate = nested.page ?? pagination.page;
  const limitCandidate = nested.limit ?? pagination.limit;

  return {
    jobs: rawJobs ?? [],
    total:
      typeof totalCandidate === "number"
        ? totalCandidate
        : typeof totalCandidate === "string"
          ? Number(totalCandidate) || (rawJobs?.length ?? 0)
          : rawJobs?.length ?? 0,
    page:
      typeof pageCandidate === "number"
        ? pageCandidate
        : typeof pageCandidate === "string"
          ? Number(pageCandidate) || 1
          : 1,
    limit:
      typeof limitCandidate === "number"
        ? limitCandidate
        : typeof limitCandidate === "string"
          ? Number(limitCandidate) || 20
          : 20,
    success: typeof source.success === "boolean" ? source.success : true,
  };
}

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
    const response = await api.get<unknown>(
      `/jobs/search${queryString ? `?${queryString}` : ""}`
    );
    const payload = extractUserJobsPayload(response);

    return {
      success: payload.success,
      jobs: payload.jobs.map((job, index) => normalizeUserJob(job, index)),
      total: payload.total,
      page: payload.page,
      limit: payload.limit,
    };
  },

  async applyForJob(
    jobId: string,
    data: ApplyJobRequest
  ): Promise<ApplyJobResponse> {
    return api.post(`/jobs/${jobId}/apply`, data);
  },

  async createAdminJobPost(
    data: AdminJobPostPayload
  ): Promise<CreateAdminJobPostResponse> {
    const response = await api.post<CreateAdminJobPostResponse | { job?: unknown; data?: { job?: unknown }; message?: string; success?: boolean }>(
      "/job-posting/jobs",
      data
    );

    const source =
      response && typeof response === "object"
        ? (response as Record<string, unknown>)
        : {};
    const rawJob =
      source.job ??
      (source.data &&
      typeof source.data === "object" &&
      (source.data as Record<string, unknown>).job
        ? (source.data as Record<string, unknown>).job
        : undefined);

    return {
      success: typeof source.success === "boolean" ? source.success : true,
      message:
        typeof source.message === "string"
          ? source.message
          : "Job posted successfully",
      job: rawJob ? normalizeAdminJob(rawJob, 0) : undefined,
    };
  },

  async getAdminJobs(params?: {
    page?: number;
    limit?: number;
  }): Promise<AdminJobsResponse> {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 20;
    const response = await api.get<unknown>(
      `/job-posting/admin/jobs?page=${page}&limit=${limit}`
    );
    const payload = extractAdminJobsPayload(response);

    return {
      success: payload.success,
      jobs: payload.jobs.map((job, index) => normalizeAdminJob(job, index)),
      total: payload.total,
      page: payload.page,
      limit: payload.limit,
    };
  },
};
