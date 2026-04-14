"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  Building2,
  Calendar,
  GraduationCap,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Send,
  FileText,
  Link as LinkIcon,
  Phone,
  UserRound,
  BadgeIndianRupee,
  ShieldCheck,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { jobService } from "@/services/job.service";
import type { Job } from "@/types/job";
import { toast } from "sonner";

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const [applying, setApplying] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");

  useEffect(() => {
    if (jobId) {
      fetchJobDetails();
    }
  }, [jobId]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      // Since there's no specific get job by ID API, we'll search and find the job
      // In a real scenario, you might want to add a specific endpoint
      const response = await jobService.searchJobs({});
      const foundJob = response.jobs.find((j) => j.id === jobId);
      if (foundJob) {
        setJob(foundJob);
      } else {
        setError("Job not found");
      }
    } catch (err) {
      setError("Failed to fetch job details");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coverLetter.trim() || !resumeUrl.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setApplying(true);
      const response = await jobService.applyForJob(jobId, {
        coverLetter,
        resumeUrl,
      });
      if (response.success) {
        toast.success(response.message || "Application submitted successfully!");
        setApplyDialogOpen(false);
        setCoverLetter("");
        setResumeUrl("");
      } else {
        toast.error(response.message || "Failed to submit application");
      }
    } catch (err) {
      toast.error("Failed to submit application");
    } finally {
      setApplying(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatLocation = (jobItem: Job) => {
    return [
      jobItem.fullAddress,
      jobItem.district,
      jobItem.state,
      jobItem.country,
      jobItem.pincode,
    ]
      .filter(Boolean)
      .join(", ");
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Job Details" subtitle="View job information" />
        <Skeleton className="h-64 w-full rounded-2xl" />
        <div className="grid gap-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="space-y-6">
        <PageHeader title="Job Details" subtitle="View job information" />
        <Alert variant="destructive" className="rounded-2xl">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error || "Job not found"}
          </AlertDescription>
        </Alert>
        <Button
          variant="outline"
          onClick={() => router.push("/user/jobs")}
          className="rounded-xl"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Jobs
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Job Details" subtitle="View job information">
        <Button
          variant="outline"
          onClick={() => router.push("/user/jobs")}
          className="rounded-xl"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </PageHeader>

      {/* Job Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="rounded-2xl border-zinc-100 dark:border-white/5">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-3">
                  <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                    {job.title}
                  </h1>
                  <Badge variant="secondary" className="rounded-lg">
                    {job.jobType}
                  </Badge>
                  {job.status === "ACTIVE" && (
                    <Badge className="rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                      Active
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-4 text-sm text-zinc-500 flex-wrap">
                  <span className="flex items-center gap-1.5">
                    <Building2 className="h-4 w-4" />
                    {job.contactName || job.company}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    {job.salary}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="h-4 w-4" />
                    {job.experience}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    {job.shift || "Shift not specified"}
                  </span>
                </div>
              </div>

              <Dialog open={applyDialogOpen} onOpenChange={setApplyDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="rounded-xl px-6">
                    <Send className="h-4 w-4 mr-2" />
                    Apply Now
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px] rounded-2xl">
                  <DialogHeader>
                    <DialogTitle>Apply for {job.title}</DialogTitle>
                    <DialogDescription>
                      Submit your application for this position with{" "}
                      {job.contactName || job.company}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleApply} className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="coverLetter">
                        <FileText className="h-4 w-4 inline mr-1" />
                        Cover Letter
                      </Label>
                      <Textarea
                        id="coverLetter"
                        placeholder="Write a brief cover letter explaining why you're a good fit for this position..."
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                        className="min-h-[120px] rounded-xl resize-none"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="resumeUrl">
                        <LinkIcon className="h-4 w-4 inline mr-1" />
                        Resume URL
                      </Label>
                      <Input
                        id="resumeUrl"
                        type="url"
                        placeholder="https://example.com/your-resume.pdf"
                        value={resumeUrl}
                        onChange={(e) => setResumeUrl(e.target.value)}
                        className="rounded-xl"
                        required
                      />
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setApplyDialogOpen(false)}
                        className="rounded-xl"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={applying}
                        className="rounded-xl"
                      >
                        {applying ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            Submit Application
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Job Details Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="rounded-2xl border-zinc-100 dark:border-white/5">
              <CardHeader>
                <CardTitle className="text-lg">Job Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-600 dark:text-zinc-400 whitespace-pre-line">
                  {job.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Requirements */}
         <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="rounded-2xl border-zinc-100 dark:border-white/5">
              <CardHeader>
                <CardTitle className="text-lg">Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                {job.requirements.length > 0 ? (
                  <ul className="space-y-2">
                    {job.requirements.map((req, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-zinc-600 dark:text-zinc-400"
                      >
                        <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl bg-zinc-50 p-4 dark:bg-white/5">
                      <p className="text-xs text-zinc-500">Education</p>
                      <p className="mt-1 text-sm font-medium">{job.education || "Not specified"}</p>
                    </div>
                    <div className="rounded-xl bg-zinc-50 p-4 dark:bg-white/5">
                      <p className="text-xs text-zinc-500">Experience</p>
                      <p className="mt-1 text-sm font-medium">{job.experience}</p>
                    </div>
                    <div className="rounded-xl bg-zinc-50 p-4 dark:bg-white/5">
                      <p className="text-xs text-zinc-500">Gender</p>
                      <p className="mt-1 text-sm font-medium">{job.gender}</p>
                    </div>
                    <div className="rounded-xl bg-zinc-50 p-4 dark:bg-white/5">
                      <p className="text-xs text-zinc-500">Age Range</p>
                      <p className="mt-1 text-sm font-medium">
                        {job.minAge > 0 || job.maxAge > 0
                          ? `${job.minAge} - ${job.maxAge} years`
                          : "Not specified"}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Job Details */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="rounded-2xl border-zinc-100 dark:border-white/5">
              <CardHeader>
                <CardTitle className="text-lg">Work Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl bg-zinc-50 p-4 dark:bg-white/5">
                    <p className="text-xs text-zinc-500">Openings</p>
                    <p className="mt-1 text-sm font-medium">{job.openings || 0}</p>
                  </div>
                  <div className="rounded-xl bg-zinc-50 p-4 dark:bg-white/5">
                    <p className="text-xs text-zinc-500">Shift</p>
                    <p className="mt-1 text-sm font-medium">{job.shift || "Not specified"}</p>
                  </div>
                  <div className="rounded-xl bg-zinc-50 p-4 dark:bg-white/5">
                    <p className="text-xs text-zinc-500">Week Off</p>
                    <p className="mt-1 text-sm font-medium">{job.weekOffDays || "Not specified"}</p>
                  </div>
                  <div className="rounded-xl bg-zinc-50 p-4 dark:bg-white/5">
                    <p className="text-xs text-zinc-500">Joining Fees</p>
                    <p className="mt-1 text-sm font-medium">
                      {job.joiningFees ? "Applicable" : "No joining fees"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="rounded-2xl border-zinc-100 dark:border-white/5">
              <CardHeader>
                <CardTitle className="text-lg">Facilities & Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {job.facilities.length > 0 ? (
                    job.facilities.map((facility) => (
                      <Badge
                        key={facility}
                        variant="secondary"
                        className="rounded-lg text-xs"
                      >
                        {facility}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-zinc-500">No facilities listed</p>
                  )}
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl bg-zinc-50 p-4 dark:bg-white/5">
                    <div className="flex items-center gap-2 text-zinc-500">
                      <UserRound className="h-4 w-4" />
                      <span className="text-xs">Contact Person</span>
                    </div>
                    <p className="mt-2 text-sm font-medium">
                      {job.contactName || "Not specified"}
                    </p>
                  </div>
                  <div className="rounded-xl bg-zinc-50 p-4 dark:bg-white/5">
                    <div className="flex items-center gap-2 text-zinc-500">
                      <Phone className="h-4 w-4" />
                      <span className="text-xs">Contact Number</span>
                    </div>
                    <p className="mt-2 text-sm font-medium">
                      {job.contactNumber || "Not specified"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Job Overview */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="rounded-2xl border-zinc-100 dark:border-white/5">
              <CardHeader>
                <CardTitle className="text-lg">Job Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-zinc-400" />
                  <div>
                    <p className="text-xs text-zinc-500">Posted Date</p>
                    <p className="text-sm font-medium">
                      {formatDate(job.postedDate)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-zinc-400" />
                  <div>
                    <p className="text-xs text-zinc-500">Last Updated</p>
                    <p className="text-sm font-medium">
                      {formatDate(job.deadline)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <GraduationCap className="h-4 w-4 text-zinc-400" />
                  <div>
                    <p className="text-xs text-zinc-500">Education</p>
                    <p className="text-sm font-medium">{job.education}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Briefcase className="h-4 w-4 text-zinc-400" />
                  <div>
                    <p className="text-xs text-zinc-500">Experience</p>
                    <p className="text-sm font-medium">{job.experience}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <BadgeIndianRupee className="h-4 w-4 text-zinc-400" />
                  <div>
                    <p className="text-xs text-zinc-500">Pay Structure</p>
                    <p className="text-sm font-medium">
                      {job.payStructure || "Not specified"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-4 w-4 text-zinc-400" />
                  <div>
                    <p className="text-xs text-zinc-500">Hiring Priority</p>
                    <p className="text-sm font-medium">
                      {job.urgentHiring ? "Urgent hiring" : "Regular hiring"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Skills */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="rounded-2xl border-zinc-100 dark:border-white/5">
              <CardHeader>
                <CardTitle className="text-lg">Required Skills</CardTitle>
              </CardHeader>
              <CardContent>
                {job.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="rounded-lg text-xs"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-zinc-500">No specific skills listed</p>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="rounded-2xl border-zinc-100 dark:border-white/5">
              <CardHeader>
                <CardTitle className="text-lg">Location</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {formatLocation(job) || "Location not specified"}
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-xs text-zinc-500">District</p>
                    <p className="text-sm font-medium">{job.district || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">State</p>
                    <p className="text-sm font-medium">{job.state || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">Country</p>
                    <p className="text-sm font-medium">{job.country || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">Pincode</p>
                    <p className="text-sm font-medium">{job.pincode || "Not specified"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
