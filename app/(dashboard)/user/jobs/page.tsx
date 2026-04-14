"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  Building2,
  AlertCircle,
  Loader2,
  ChevronRight,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { jobService } from "@/services/job.service";
import type { Job } from "@/types/job";
import Link from "next/link";

export default function JobsPage() {
  const [canView, setCanView] = useState<boolean | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    checkCanViewJobs();
  }, []);

  const checkCanViewJobs = async () => {
    try {
      setLoading(true);
      const response = await jobService.canViewJobs();
      setCanView(response.canViewJobs);
      if (response.canViewJobs) {
        await fetchJobs();
      }
    } catch (err) {
      setError("Failed to check job viewing permissions");
      setCanView(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchJobs = async (searchKeyword?: string, searchLocation?: string) => {
    try {
      setSearching(true);
      setError(null);
      const response = await jobService.searchJobs({
        keyword: searchKeyword,
        location: searchLocation,
      });
      setJobs(response.jobs || []);
    } catch (err) {
      setError("Failed to fetch jobs");
      setJobs([]);
    } finally {
      setSearching(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs(keyword, location);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Search Jobs" subtitle="Find your dream job" />
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (canView === false) {
    return (
      <div className="space-y-6">
        <PageHeader title="Search Jobs" subtitle="Find your dream job" />
        <Alert variant="destructive" className="rounded-2xl">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You need to create a job profile before you can search and apply for
            jobs. Please complete your profile first.
          </AlertDescription>
        </Alert>
        <div className="flex justify-center">
          <Link href="/user/profile">
            <Button className="rounded-xl">Create Job Profile</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Search Jobs" subtitle="Find your dream job" />

      {/* Search Form */}
      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSearch}
        className="flex flex-col sm:flex-row gap-3"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Search by job title, skills, or company..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="pl-10 rounded-xl h-11"
          />
        </div>
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Location (city, state...)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="pl-10 rounded-xl h-11"
          />
        </div>
        <Button
          type="submit"
          disabled={searching}
          className="rounded-xl h-11 px-6"
        >
          {searching ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Search className="h-4 w-4 mr-2" />
          )}
          Search
        </Button>
      </motion.form>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="rounded-2xl">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Jobs List */}
      <div className="space-y-4">
        {searching ? (
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
              <Briefcase className="h-8 w-8 text-zinc-400" />
            </div>
            <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-1">
              No jobs found
            </h3>
            <p className="text-sm text-zinc-500">
              Try adjusting your search criteria
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid gap-4"
          >
            {jobs.map((job, index) => (
              (() => {
                const jobSkills = Array.isArray(job.skills) ? job.skills : [];

                return (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={`/user/jobs/${job.id}`}>
                  <Card className="rounded-2xl hover:shadow-md transition-shadow cursor-pointer border-zinc-100 dark:border-white/5">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-2">
                            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                              {job.title}
                            </h3>
                            <Badge
                              variant="secondary"
                              className="rounded-lg text-xs"
                            >
                              {job.jobType}
                            </Badge>
                            {job.status === "ACTIVE" && (
                              <Badge className="rounded-lg text-xs bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                                Active
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center gap-4 text-sm text-zinc-500 flex-wrap mb-3">
                            <span className="flex items-center gap-1">
                              <Building2 className="h-3.5 w-3.5" />
                              {job.company}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5" />
                              {job.location}
                            </span>
                            <span className="flex items-center gap-1">
                              {job.salary}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              Posted {formatDate(job.postedDate)}
                            </span>
                          </div>

                          <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 mb-3">
                            {job.description}
                          </p>

                          <div className="flex items-center gap-2 flex-wrap">
                            {jobSkills.slice(0, 4).map((skill) => (
                              <Badge
                                key={skill}
                                variant="outline"
                                className="rounded-lg text-xs font-normal"
                              >
                                {skill}
                              </Badge>
                            ))}
                            {jobSkills.length > 4 && (
                              <Badge
                                variant="outline"
                                className="rounded-lg text-xs font-normal"
                              >
                                +{jobSkills.length - 4} more
                              </Badge>
                            )}
                          </div>
                        </div>

                        <ChevronRight className="h-5 w-5 text-zinc-400 flex-shrink-0 mt-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
                );
              })()
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
