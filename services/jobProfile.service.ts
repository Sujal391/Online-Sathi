import { api } from "./api";

export interface JobProfileData {
  fullName: string;
  phoneNumber: string;
  email: string;
  maritalStatus: string;
  gender: string;
  dateOfBirth: string;
  languages: string[];
  currentCountry: string;
  currentState: string;
  currentDistrict: string;
  currentAddress: string;
  currentPincode: string;
  permanentCountry: string;
  permanentState: string;
  permanentDistrict: string;
  permanentAddress: string;
  permanentPincode: string;
  jobType: string;
  jobRole: string;
  skills: string[];
  jobDescription: string;
  education: Array<{
    level: string;
    schoolName: string;
    degree: string;
    passingYear: string;
    percentage: string;
  }>;
  totalExperience: number;
  workExperience: Array<{
    jobRole: string;
    companyName: string;
    salary: number;
    yearsExp: number;
    country: string;
    city: string;
    startDate: string;
    endDate?: string;
    currentlyWorking: boolean;
  }>;
  documentType: string;
  documentFront: string;
  documentBack: string;
  documentNumber: string;
  transactionType: "ONLY_PROFILE" | "PROFILE_WITH_RESUME";
}

export const jobProfileService = {
  async saveJobProfile(data: JobProfileData): Promise<{ success: boolean; message?: string }> {
    return api.post("/job-profile/save", data);
  },

  async getMyProfile(): Promise<{ success: boolean; profile: JobProfileData & { profileStatus: string } }> {
    return api.get("/job-profile/my-profile");
  },

  async updateJobProfile(data: Partial<JobProfileData>): Promise<{ success: boolean; message?: string }> {
    return api.patch("/job-profile/update", data);
  }
};
