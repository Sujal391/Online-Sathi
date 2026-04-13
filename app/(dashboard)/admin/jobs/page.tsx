"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  AlertCircle,
  Briefcase,
  CalendarDays,
  Loader2,
  MapPin,
  Phone,
  Plus,
  RefreshCw,
  Sparkles,
  Users,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { jobService } from "@/services/job.service";
import type { AdminJobPost } from "@/types/job";

function formatCurrency(amount: number, payStructure: string) {
  if (!amount) return "Not specified";

  return `${new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount)} / ${payStructure || "period"}`;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getLocationLabel(job: AdminJobPost) {
  return [job.district, job.state, job.country].filter(Boolean).join(", ");
}

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<AdminJobPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    void fetchJobs(1, true);
  }, []);

  const totalPages = useMemo(() => {
    if (!total) return 1;
    return Math.max(1, Math.ceil(total / limit));
  }, [limit, total]);

  async function fetchJobs(nextPage = page, showSkeleton = false) {
    try {
      setError(null);
      if (showSkeleton) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      const response = await jobService.getAdminJobs({ page: nextPage, limit });
      setJobs(response.jobs);
      setPage(response.page);
      setTotal(response.total);
    } catch (fetchError) {
      const message =
        fetchError instanceof Error ? fetchError.message : "Failed to fetch jobs";
      setError(message);
      setJobs([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Job Posts"
        subtitle="Create and manage admin job postings"
        badge="Admin"
        badgeColor="#854F0B"
      >
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => void fetchJobs(page)}
            disabled={refreshing || loading}
            className="rounded-xl"
          >
            {refreshing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Refresh
          </Button>

          <Button asChild className="rounded-xl">
            <Link href="/admin/jobs/create">
              <Plus className="mr-2 h-4 w-4" />
              Post Job
            </Link>
          </Button>
        </div>
      </PageHeader>

      {error && (
        <Alert variant="destructive" className="rounded-2xl">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-2xl border-zinc-200/80 dark:border-white/10">
          <CardHeader>
            <CardDescription>Total Posts</CardDescription>
            <CardTitle className="text-3xl">{total}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="rounded-2xl border-zinc-200/80 dark:border-white/10">
          <CardHeader>
            <CardDescription>Urgent Hiring</CardDescription>
            <CardTitle className="text-3xl">
              {jobs.filter((job) => job.urgentHiring).length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="rounded-2xl border-zinc-200/80 dark:border-white/10">
          <CardHeader>
            <CardDescription>Total Openings</CardDescription>
            <CardTitle className="text-3xl">
              {jobs.reduce((sum, job) => sum + job.openings, 0)}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {loading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((item) => (
            <Skeleton key={item} className="h-48 rounded-2xl" />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="rounded-3xl border-dashed border-zinc-300 bg-gradient-to-br from-white to-zinc-50 dark:border-white/10 dark:from-zinc-900 dark:to-zinc-950">
            <CardContent className="flex flex-col items-center px-6 py-16 text-center">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
                <Sparkles className="h-8 w-8" />
              </div>
              <h2 className="text-xl font-semibold">No job posts yet</h2>
              <p className="mt-2 max-w-xl text-sm text-zinc-500">
                Start by creating the first admin job post. New jobs created here
                will be fetched from the admin jobs API automatically.
              </p>
              <Button asChild type="button" className="mt-6 rounded-xl">
                <Link href="/admin/jobs/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Job
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <div className="grid gap-4">
          {jobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
            >
              <Card className="rounded-3xl border-zinc-200/80 bg-white/90 dark:border-white/10 dark:bg-zinc-900/60">
                <CardContent className="space-y-5 p-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-xl font-semibold">{job.jobRole}</h2>
                        <Badge variant="secondary" className="rounded-lg">
                          {job.jobType}
                        </Badge>
                        {job.urgentHiring && (
                          <Badge className="rounded-lg bg-rose-100 text-rose-700 hover:bg-rose-100 dark:bg-rose-500/15 dark:text-rose-300">
                            Urgent
                          </Badge>
                        )}
                        <Badge variant="outline" className="rounded-lg">
                          {job.status}
                        </Badge>
                      </div>
                      <p className="max-w-3xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                        {job.jobDescription}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-zinc-50 px-4 py-3 text-right dark:bg-white/5">
                      <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                        Salary
                      </p>
                      <p className="mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                        {formatCurrency(job.offeredAmount, job.payStructure)}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-3 text-sm text-zinc-600 dark:text-zinc-400 md:grid-cols-2 xl:grid-cols-4">
                    <div className="flex items-center gap-2 rounded-2xl bg-zinc-50 px-3 py-2.5 dark:bg-white/5">
                      <MapPin className="h-4 w-4 text-zinc-400" />
                      <span>{getLocationLabel(job) || "Location not specified"}</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-2xl bg-zinc-50 px-3 py-2.5 dark:bg-white/5">
                      <Users className="h-4 w-4 text-zinc-400" />
                      <span>{job.openings} openings</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-2xl bg-zinc-50 px-3 py-2.5 dark:bg-white/5">
                      <Briefcase className="h-4 w-4 text-zinc-400" />
                      <span>
                        {job.experience} yrs • {job.shift}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 rounded-2xl bg-zinc-50 px-3 py-2.5 dark:bg-white/5">
                      <CalendarDays className="h-4 w-4 text-zinc-400" />
                      <span>Posted {formatDate(job.createdAt)}</span>
                    </div>
                  </div>

                  <div className="grid gap-4 lg:grid-cols-[1.3fr_0.9fr]">
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
                        Skills
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {job.requiredSkills.length > 0 ? (
                          job.requiredSkills.map((skill) => (
                            <Badge
                              key={`${job.id}-${skill}`}
                              variant="outline"
                              className="rounded-lg"
                            >
                              {skill}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-sm text-zinc-500">
                            No skills added
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-3 rounded-2xl border border-zinc-200/80 p-4 dark:border-white/10">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                          Contact
                        </span>
                        <span className="text-sm font-medium">{job.contactName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                        <Phone className="h-4 w-4 text-zinc-400" />
                        <span>{job.contactNumber || "Not available"}</span>
                      </div>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        {job.fullAddress || "Address not specified"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          <div className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white px-4 py-3 dark:border-white/10 dark:bg-zinc-900/60">
            <p className="text-sm text-zinc-500">
              Page {page} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={page <= 1 || refreshing}
                onClick={() => void fetchJobs(page - 1)}
                className="rounded-xl"
              >
                Previous
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={page >= totalPages || refreshing}
                onClick={() => void fetchJobs(page + 1)}
                className="rounded-xl"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
