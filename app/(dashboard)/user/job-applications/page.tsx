"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  AlertCircle,
  Briefcase,
  Building2,
  Calendar,
  ChevronRight,
  Clock,
  FileText,
  Loader2,
  MapPin,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { jobService } from "@/services/job.service";
import type { JobApplication } from "@/types/job";

const statusStyles: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700 hover:bg-amber-100",
  ACCEPTED: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
  REJECTED: "bg-rose-100 text-rose-700 hover:bg-rose-100",
  REVIEWED: "bg-sky-100 text-sky-700 hover:bg-sky-100",
};

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatCurrency(amount: number) {
  if (!amount) {
    return "Salary not specified";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function JobApplicationsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await jobService.getMyApplications();
      setApplications(response.applications || []);
    } catch (fetchError) {
      setApplications([]);
      setError("Failed to fetch your job applications");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenJob = (jobId: string) => {
    router.push(`/user/jobs/${jobId}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Applications"
        subtitle="Track the jobs you have applied for"
      />

      {error && (
        <Alert variant="destructive" className="rounded-2xl">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((item) => (
            <Skeleton key={item} className="h-40 w-full rounded-2xl" />
          ))}
        </div>
      ) : applications.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-3xl border border-dashed border-zinc-200 bg-white p-10 text-center dark:border-white/10 dark:bg-white/5"
        >
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
            <Briefcase className="h-8 w-8 text-zinc-400" />
          </div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            No applications yet
          </h3>
          <p className="mt-1 text-sm text-zinc-500">
            Applied jobs will appear here after you submit an application.
          </p>
          <Link
            href="/user/jobs"
            className="mt-5 inline-flex rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
          >
            Browse Jobs
          </Link>
        </motion.div>
      ) : (
        <div className="grid gap-4">
          {applications.map((application, index) => {
            const job = application.job;
            const location = [job.district, job.state].filter(Boolean).join(", ");

            return (
              <motion.div
                key={application.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  role="button"
                  tabIndex={0}
                  onClick={() => handleOpenJob(application.jobId)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      handleOpenJob(application.jobId);
                    }
                  }}
                  className="cursor-pointer rounded-2xl border-zinc-100 transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300 dark:border-white/5 dark:focus-visible:ring-white/20"
                >
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                              {job.title}
                            </h3>
                            <Badge variant="secondary" className="rounded-lg text-xs">
                              {job.jobType || "Job"}
                            </Badge>
                            <Badge
                              className={`rounded-lg text-xs ${
                                statusStyles[application.status] ??
                                "bg-zinc-100 text-zinc-700 hover:bg-zinc-100"
                              }`}
                            >
                              {application.status}
                            </Badge>
                          </div>

                          <div className="mb-3 flex flex-wrap items-center gap-4 text-sm text-zinc-500">
                            <span className="flex items-center gap-1">
                              <Building2 className="h-3.5 w-3.5" />
                              {job.company}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5" />
                              {location || job.location || "Location not specified"}
                            </span>
                            <span className="flex items-center gap-1">
                              {job.salary || formatCurrency(job.offeredAmount)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              Applied {formatDate(application.appliedAt)}
                            </span>
                          </div>

                          <p className="mb-3 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
                            {job.description}
                          </p>

                          <div className="grid gap-3 text-sm text-zinc-500 md:grid-cols-2">
                            <div className="flex items-start gap-2 rounded-xl bg-zinc-50 p-3 dark:bg-white/5">
                              <FileText className="mt-0.5 h-4 w-4 flex-shrink-0" />
                              <div className="min-w-0">
                                <p className="text-xs uppercase tracking-wide text-zinc-400">
                                  Cover Letter
                                </p>
                                <p className="line-clamp-2 text-zinc-600 dark:text-zinc-300">
                                  {application.coverLetter || "Not provided"}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2 rounded-xl bg-zinc-50 p-3 dark:bg-white/5">
                              <Clock className="mt-0.5 h-4 w-4 flex-shrink-0" />
                              <div>
                                <p className="text-xs uppercase tracking-wide text-zinc-400">
                                  Last Updated
                                </p>
                                <p className="text-zinc-600 dark:text-zinc-300">
                                  {formatDate(application.updatedAt)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-3">
                          <ChevronRight className="mt-1 h-5 w-5 flex-shrink-0 text-zinc-400" />
                          <button
                            type="button"
                            className="inline-flex items-center rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:text-zinc-300 dark:hover:bg-white/5"
                            onClick={(event) => {
                              event.stopPropagation();
                              if (application.resumeUrl) {
                                window.open(application.resumeUrl, "_blank", "noreferrer");
                              }
                            }}
                            disabled={!application.resumeUrl}
                          >
                            View Resume
                          </button>
                        </div>
                      </div>
                    </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center text-sm text-zinc-500">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading applications...
        </div>
      )}
    </div>
  );
}
