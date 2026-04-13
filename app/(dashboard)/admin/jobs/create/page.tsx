"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { TagInput } from "@/components/ui/TagInput";
import { Textarea } from "@/components/ui/textarea";
import { jobService } from "@/services/job.service";
import type { AdminJobPostPayload } from "@/types/job";

const initialFormState: AdminJobPostPayload = {
  jobRole: "",
  jobDescription: "",
  requiredSkills: [],
  jobType: "Full Time",
  payStructure: "Full Time",
  offeredAmount: 0,
  openings: 1,
  shift: "Day",
  urgentHiring: false,
  education: "",
  experience: 0,
  gender: "Any",
  minAge: 18,
  maxAge: 60,
  country: "India",
  state: "",
  district: "",
  pincode: "",
  fullAddress: "",
  weekOffDays: "Sunday",
  facilities: [],
  joiningFees: false,
  contactName: "",
  contactNumber: "",
};

export default function AdminCreateJobPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<AdminJobPostPayload>(initialFormState);

  function updateField<K extends keyof AdminJobPostPayload>(
    key: K,
    value: AdminJobPostPayload[K]
  ) {
    setFormData((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (
      !formData.jobRole.trim() ||
      !formData.jobDescription.trim() ||
      !formData.contactName.trim() ||
      !formData.contactNumber.trim()
    ) {
      toast.error("Please fill the required job details");
      return;
    }

    try {
      setSubmitting(true);
      const response = await jobService.createAdminJobPost(formData);
      toast.success(response.message || "Job posted successfully");
      router.push("/admin/jobs");
    } catch (submitError) {
      toast.error(
        submitError instanceof Error
          ? submitError.message
          : "Failed to create job post"
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Job Post"
        subtitle="Publish a new admin job posting"
        badge="Admin"
        badgeColor="#854F0B"
      >
        <Button asChild type="button" variant="outline" className="rounded-xl">
          <Link href="/admin/jobs">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Jobs
          </Link>
        </Button>
      </PageHeader>

      <Card className="rounded-3xl border-zinc-200/80 dark:border-white/10">
        <CardHeader>
          <CardTitle>Create Job Post</CardTitle>
          <CardDescription>
            Fill in the role details and submit to publish the new job post.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="jobRole">Job role</Label>
                <Input
                  id="jobRole"
                  value={formData.jobRole}
                  onChange={(event) => updateField("jobRole", event.target.value)}
                  placeholder="Software Engineer"
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="jobDescription">Job description</Label>
                <Textarea
                  id="jobDescription"
                  value={formData.jobDescription}
                  onChange={(event) =>
                    updateField("jobDescription", event.target.value)
                  }
                  placeholder="Describe the role, expectations, and work environment"
                  className="min-h-28 rounded-xl"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Required skills</Label>
                <TagInput
                  value={formData.requiredSkills}
                  onChange={(value) => updateField("requiredSkills", value)}
                  placeholder="JavaScript, React, Node.js"
                />
              </div>

              <div className="space-y-2">
                <Label>Job type</Label>
                <Select
                  value={formData.jobType}
                  onValueChange={(value) => updateField("jobType", value)}
                >
                  <SelectTrigger className="h-10 w-full rounded-xl">
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full Time">Full Time</SelectItem>
                    <SelectItem value="Part Time">Part Time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Pay structure</Label>
                <Select
                  value={formData.payStructure}
                  onValueChange={(value) => updateField("payStructure", value)}
                >
                  <SelectTrigger className="h-10 w-full rounded-xl">
                    <SelectValue placeholder="Select pay structure" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full Time">Full Time</SelectItem>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                    <SelectItem value="Weekly">Weekly</SelectItem>
                    <SelectItem value="Daily">Daily</SelectItem>
                    <SelectItem value="Hourly">Hourly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="offeredAmount">Offered amount</Label>
                <Input
                  id="offeredAmount"
                  type="number"
                  min={0}
                  value={formData.offeredAmount}
                  onChange={(event) =>
                    updateField("offeredAmount", Number(event.target.value) || 0)
                  }
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="openings">Openings</Label>
                <Input
                  id="openings"
                  type="number"
                  min={1}
                  value={formData.openings}
                  onChange={(event) =>
                    updateField("openings", Number(event.target.value) || 1)
                  }
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label>Shift</Label>
                <Select
                  value={formData.shift}
                  onValueChange={(value) => updateField("shift", value)}
                >
                  <SelectTrigger className="h-10 w-full rounded-xl">
                    <SelectValue placeholder="Select shift" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Day">Day</SelectItem>
                    <SelectItem value="Night">Night</SelectItem>
                    <SelectItem value="Rotational">Rotational</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Experience (years)</Label>
                <Input
                  id="experience"
                  type="number"
                  min={0}
                  value={formData.experience}
                  onChange={(event) =>
                    updateField("experience", Number(event.target.value) || 0)
                  }
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="education">Education</Label>
                <Input
                  id="education"
                  value={formData.education}
                  onChange={(event) =>
                    updateField("education", event.target.value)
                  }
                  placeholder="Bachelor's Degree"
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label>Gender preference</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => updateField("gender", value)}
                >
                  <SelectTrigger className="h-10 w-full rounded-xl">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Any">Any</SelectItem>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="minAge">Minimum age</Label>
                <Input
                  id="minAge"
                  type="number"
                  min={18}
                  value={formData.minAge}
                  onChange={(event) =>
                    updateField("minAge", Number(event.target.value) || 18)
                  }
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxAge">Maximum age</Label>
                <Input
                  id="maxAge"
                  type="number"
                  min={formData.minAge}
                  value={formData.maxAge}
                  onChange={(event) =>
                    updateField("maxAge", Number(event.target.value) || 60)
                  }
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(event) => updateField("country", event.target.value)}
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(event) => updateField("state", event.target.value)}
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="district">District</Label>
                <Input
                  id="district"
                  value={formData.district}
                  onChange={(event) =>
                    updateField("district", event.target.value)
                  }
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pincode">Pincode</Label>
                <Input
                  id="pincode"
                  value={formData.pincode}
                  onChange={(event) => updateField("pincode", event.target.value)}
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="fullAddress">Full address</Label>
                <Textarea
                  id="fullAddress"
                  value={formData.fullAddress}
                  onChange={(event) =>
                    updateField("fullAddress", event.target.value)
                  }
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weekOffDays">Week off days</Label>
                <Input
                  id="weekOffDays"
                  value={formData.weekOffDays}
                  onChange={(event) =>
                    updateField("weekOffDays", event.target.value)
                  }
                  placeholder="Sunday"
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Facilities</Label>
                <TagInput
                  value={formData.facilities}
                  onChange={(value) => updateField("facilities", value)}
                  placeholder="Health Insurance, PF, Meal"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactName">Contact name</Label>
                <Input
                  id="contactName"
                  value={formData.contactName}
                  onChange={(event) =>
                    updateField("contactName", event.target.value)
                  }
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactNumber">Contact number</Label>
                <Input
                  id="contactNumber"
                  value={formData.contactNumber}
                  onChange={(event) =>
                    updateField("contactNumber", event.target.value)
                  }
                  className="rounded-xl"
                />
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-white/10 dark:bg-white/5">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Urgent hiring</p>
                  <p className="text-xs text-zinc-500">
                    Highlight this job as priority hiring.
                  </p>
                </div>
                <Switch
                  checked={formData.urgentHiring}
                  onCheckedChange={(checked) =>
                    updateField("urgentHiring", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-white/10 dark:bg-white/5">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Joining fees</p>
                  <p className="text-xs text-zinc-500">
                    Toggle if the role involves any joining fees.
                  </p>
                </div>
                <Switch
                  checked={formData.joiningFees}
                  onCheckedChange={(checked) =>
                    updateField("joiningFees", checked)
                  }
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t pt-4">
              <Button asChild type="button" variant="outline" className="rounded-xl">
                <Link href="/admin/jobs">Cancel</Link>
              </Button>
              <Button type="submit" disabled={submitting} className="rounded-xl">
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Posting...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Job
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
