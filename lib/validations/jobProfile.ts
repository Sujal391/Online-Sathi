import * as z from "zod";

export const EducationSchema = z.object({
  level: z.string().min(1, "Level is required"),
  schoolName: z.string().min(1, "School name is required"),
  degree: z.string().min(1, "Degree is required"),
  passingYear: z.string().min(4, "Invalid year").max(4, "Invalid year"),
  percentage: z.string().min(1, "Percentage is required"),
});

export const WorkExperienceSchema = z.object({
  jobRole: z.string().min(1, "Job role is required"),
  companyName: z.string().min(1, "Company name is required"),
  salary: z.coerce.number().min(0, "Invalid salary"),
  yearsExp: z.coerce.number().min(0, "Invalid years"),
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  currentlyWorking: z.boolean().default(false),
});

export const JobProfileSchema = z.object({
  // Step 1: Personal
  fullName: z.string().min(2, "Full name is required"),
  phoneNumber: z.string().regex(/^\d{10}$/, "Invalid phone number"),
  email: z.string().email("Invalid email address"),
  maritalStatus: z.string().min(1, "Select marital status"),
  gender: z.string().min(1, "Select gender"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  languages: z.array(z.string()).min(1, "Select at least one language"),

  // Addresses
  currentCountry: z.string().min(1, "Current country is required"),
  currentState: z.string().min(1, "Current state is required"),
  currentDistrict: z.string().min(1, "Current district is required"),
  currentAddress: z.string().min(5, "Address must be descriptive"),
  currentPincode: z.string().regex(/^\d{6}$/, "Invalid pincode"),

  permanentCountry: z.string().min(1, "Permanent country is required"),
  permanentState: z.string().min(1, "Permanent state is required"),
  permanentDistrict: z.string().min(1, "Permanent district is required"),
  permanentAddress: z.string().min(5, "Address must be descriptive"),
  permanentPincode: z.string().regex(/^\d{6}$/, "Invalid pincode"),

  jobType: z.enum(["Full Time", "Part time", "Daily wages"]),

  // Step 2: Job & Education
  jobRole: z.string().min(2, "Job role is required"),
  skills: z.array(z.string()).min(1, "Add at least one skill"),
  jobDescription: z.string().min(20, "Please provide a more detailed description"),
  education: z.array(EducationSchema).min(1, "Add at least one education record"),

  // Step 3: Experience
  totalExperience: z.coerce.number().min(0, "Invalid experience"),
  workExperience: z.array(WorkExperienceSchema),

  // Step 4: Documents
  documentType: z.string().min(1, "Select document type"),
  documentFront: z.string().min(1, "Document front is required"),
  documentBack: z.string().min(1, "Document back is required"),
  documentNumber: z.string().min(5, "Document number is required"),
  transactionType: z.enum(["ONLY_PROFILE", "PROFILE_WITH_RESUME"]),
});

export type JobProfileFormValues = z.infer<typeof JobProfileSchema>;
