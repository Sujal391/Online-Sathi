'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { User as UserIcon, Briefcase, ChevronRight, Loader2, Edit3, Mail, Phone, Calendar, UserCircle, GraduationCap, Building2, MapPin, CheckCircle2, Languages, Award } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { JobProfileCoordinator } from '@/components/user/JobProfileForm/JobProfileCoordinator'
import { authService, type User } from '@/services/auth.service'
import { jobProfileService, type JobProfileData } from '@/services/jobProfile.service'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export default function UserProfilePage() {
  const [user, setUser] = React.useState<User | null>(null)
  const [jobProfile, setJobProfile] = React.useState<(JobProfileData & { profileStatus: string }) | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [mounted, setMounted] = React.useState(false)
  const [isEditing, setIsEditing] = React.useState(false)

  const fetchProfileData = React.useCallback(async () => {
    const [userRes, profileRes] = await Promise.all([
      authService.getMe(),
      jobProfileService.getMyProfile()
    ])

    if (userRes.success) setUser(userRes.user)
    if (profileRes.success) setJobProfile(profileRes.profile)
  }, [])

  React.useEffect(() => {
    setMounted(true)
    const initializePage = async () => {
      try {
        await fetchProfileData()
      } catch (err) {
        console.error('Failed to fetch profile data:', err)
      } finally {
        setLoading(false)
      }
    }
    initializePage()
  }, [fetchProfileData])

  if (!mounted || loading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        <p className="text-sm font-medium text-zinc-500 animate-pulse">Syncing your profile...</p>
      </div>
    )
  }

  const ProfileInfoView = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Account Info Card */}
      <div className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-white p-8 dark:border-white/5 dark:bg-zinc-900/50">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/5 blur-3xl" />
        <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-indigo-500/5 blur-3xl" />

        <div className="relative flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-zinc-100 ring-8 ring-zinc-50 dark:bg-white/5 dark:ring-white/5">
              <UserIcon size={40} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{user?.fullName}</h2>
              <div className="mt-1 flex items-center gap-2">
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400">
                  {user?.approvalStatus || 'APPROVED'}
                </Badge>
                <span className="text-xs text-zinc-400">Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'recent'}</span>
              </div>
            </div>
          </div>

          <Button
            onClick={() => setIsEditing(true)}
            className="group h-12 gap-2 rounded-2xl bg-zinc-900 px-6 font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            <Edit3 size={18} className="transition-transform group-hover:rotate-12" />
            {jobProfile ? 'Manage Profile' : 'Create Job Profile'}
          </Button>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 xl:grid-cols-4">
          <InfoCard icon={<Mail size={18} />} label="Email Address" value={user?.email || jobProfile?.email} />
          <InfoCard icon={<Phone size={18} />} label="Phone Number" value={user?.mobile || jobProfile?.phoneNumber} />
          <InfoCard icon={<Calendar size={18} />} label="Date of Birth" value={user?.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : (jobProfile?.dateOfBirth ? new Date(jobProfile.dateOfBirth).toLocaleDateString() : 'N/A')} />
          <InfoCard icon={<UserCircle size={18} />} label="Gender" value={user?.gender || jobProfile?.gender} />
        </div>
      </div>

      {jobProfile ? (
        <JobProfileDetailView profile={jobProfile} />
      ) : (
        <div className="rounded-3xl border border-dashed border-zinc-200 bg-zinc-50/50 p-12 text-center dark:border-white/5 dark:bg-white/5">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-zinc-300 shadow-sm dark:bg-zinc-900">
            <Briefcase size={32} />
          </div>
          <h3 className="mt-6 text-lg font-bold text-zinc-900 dark:text-zinc-100">No Job Profile Yet</h3>
          <p className="mx-auto mt-2 max-w-sm text-sm text-zinc-500 dark:text-zinc-400">
            Your professional profile is currently empty. Build your profile to get matched with the best jobs in your area.
          </p>
          <Button
            variant="link"
            onClick={() => setIsEditing(true)}
            className="mt-4 font-bold text-blue-600 hover:text-blue-700"
          >
            Start Building Now &rarr;
          </Button>
        </div>
      )}
    </motion.div>
  )

  const InfoCard = ({ icon, label, value }: { icon: React.ReactNode, label: string, value?: string }) => (
    <div className="flex flex-col gap-2 min-w-0">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400">
        {icon}
        <span className="truncate">{label}</span>
      </div>
      <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 break-all sm:break-words">
        {value || 'Not provided'}
      </div>
    </div>
  )

  const JobProfileDetailView = ({ profile }: { profile: JobProfileData & { profileStatus: string } }) => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Professional Info */}
        <Card className="lg:col-span-2 p-8 rounded-3xl border-zinc-200 dark:border-white/5 space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Briefcase className="text-blue-600" size={22} />
                Professional Summary
              </h3>
              <p className="text-zinc-500 text-sm">Overview of your professional background</p>
            </div>
            <Badge className={cn(
              "rounded-lg px-3 py-1",
              profile.profileStatus === 'VERIFIED' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-orange-50 text-orange-600 border-orange-100"
            )}>
              {profile.profileStatus}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Desired Job Role</label>
              <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{profile.jobRole}</p>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Job Type</label>
              <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{profile.jobType}</p>
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Professional Bio</label>
              <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{profile.jobDescription}</p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest block">Skills & Expertise</label>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill) => (
                <Badge key={skill} variant="outline" className="rounded-xl px-4 py-1.5 border-blue-100 bg-blue-50/30 text-blue-700 dark:border-blue-900/30 dark:bg-blue-900/20 dark:text-blue-300">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </Card>

        {/* Sidebar Info - Experience/Languages */}
        <div className="space-y-6">
          <Card className="p-6 rounded-3xl border-zinc-200 dark:border-white/5 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600">
                <Award size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-400 uppercase">Total Experience</p>
                <p className="text-lg font-bold">{profile.totalExperience} Year{profile.totalExperience !== 1 ? 's' : ''}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600">
                <Languages size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-400 uppercase">Languages Known</p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {profile.languages.map((lang, i) => (
                    <React.Fragment key={lang}>
                      <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">{lang}</span>
                      {i < profile.languages.length - 1 && <span className="text-zinc-400">, </span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 rounded-3xl border-zinc-200 dark:border-white/5 bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xl shadow-blue-200 dark:shadow-none">
            <div className="space-y-4">
              <CheckCircle2 size={32} />
              <div className="space-y-1">
                <h4 className="font-bold">Verified Professional</h4>
                <p className="text-xs text-blue-100 leading-relaxed">Your identity and skills have been processed. You are eligible for premium job matches.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Experience & Education */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Education Section */}
        <Card className="p-8 rounded-3xl border-zinc-200 dark:border-white/5 space-y-6">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <GraduationCap className="text-indigo-600" size={20} />
            Education History
          </h3>
          <div className="space-y-6">
            {profile.education.map((edu, idx) => (
              <div key={idx} className="relative pl-8 before:absolute before:left-[11px] before:top-2 before:bottom-0 before:w-0.5 before:bg-zinc-100 dark:before:bg-white/5 last:before:hidden">
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-white dark:bg-zinc-900 border-4 border-indigo-600 z-10" />
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-zinc-900 dark:text-zinc-100">{edu.degree} ({edu.level})</p>
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded-md">{edu.passingYear}</span>
                  </div>
                  <p className="text-sm text-zinc-500 flex items-center gap-1.5">
                    <Building2 size={14} /> {edu.schoolName}
                  </p>
                  <p className="text-xs font-semibold text-emerald-600 mt-1">Grade/Percentage: {edu.percentage}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Work Experience Section */}
        <Card className="p-8 rounded-3xl border-zinc-200 dark:border-white/5 space-y-6">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Building2 className="text-emerald-600" size={20} />
            Work Experience
          </h3>
          <div className="space-y-6">
            {profile.workExperience.map((exp, idx) => (
              <div key={idx} className="relative pl-8 before:absolute before:left-[11px] before:top-2 before:bottom-0 before:w-0.5 before:bg-zinc-100 dark:before:bg-white/5 last:before:hidden">
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-white dark:bg-zinc-900 border-4 border-emerald-500 z-10" />
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-zinc-900 dark:text-zinc-100">{exp.jobRole}</p>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-md">
                      {exp.startDate} — {exp.currentlyWorking ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-500 font-medium">{exp.companyName}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <p className="text-xs text-zinc-400 flex items-center gap-1">
                      <MapPin size={12} /> {exp.city}, {exp.country}
                    </p>
                    <p className="text-xs font-bold text-blue-600">₹{exp.salary.toLocaleString()}/mo</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )

  return (
    <div className="space-y-8">
      <PageHeader
        title="My Profile"
        subtitle="Manage your professional identity and job preferences"
        badge="Career Center"
        badgeColor="#185FA5"
      >
        <div className="flex items-center gap-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
          <span>User</span>
          <ChevronRight size={14} />
          <span className="text-zinc-900 dark:text-zinc-200">Job Profile</span>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* sidebar info */}
        <div className="lg:col-span-4 space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-3xl border border-zinc-200 bg-white p-6 dark:border-white/5 dark:bg-zinc-900/50"
          >
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-blue-600 text-white shadow-xl shadow-blue-200 dark:shadow-none">
                  <UserIcon size={48} />
                </div>
                {jobProfile && (
                  <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-lg">
                    <CheckCircle2 size={16} />
                  </div>
                )}
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{user?.fullName || 'Complete Your Profile'}</h3>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                {jobProfile ? (
                  <>Your profile is <span className="font-bold text-emerald-600">Active</span> and matching with local job opportunities.</>
                ) : (
                  <>A complete job profile increases your chances of getting noticed by recruiters by <span className="font-bold text-blue-600">80%</span>.</>
                )}
              </p>
            </div>

            <div className="mt-8 space-y-4">
              <div className="rounded-2xl border border-dashed border-zinc-100 p-4 dark:border-white/5">
                <div className="mb-2 flex justify-between text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  <span>Profile Strength</span>
                  <span className="text-blue-600">{jobProfile ? 'Excellent' : isEditing ? 'Drafting' : 'Beginner'}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-white/5">
                  <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: jobProfile ? '100%' : isEditing ? '25%' : '10%' }} />
                </div>
              </div>

              <ul className="space-y-3">
                {[
                  { label: 'Account Verified', active: !!user },
                  { label: 'Job Preferences', active: !!jobProfile },
                  { label: 'Skills & Education', active: !!jobProfile },
                  { label: 'Work Experience', active: !!jobProfile && jobProfile.workExperience.length > 0 },
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-zinc-500">
                    <div className={`h-1.5 w-1.5 rounded-full ${item.active ? 'bg-emerald-500' : 'bg-zinc-200 dark:bg-zinc-700'}`} />
                    {item.label}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          <div className="rounded-3xl border border-blue-100 bg-blue-50/50 p-6 dark:border-blue-900/20 dark:bg-blue-950/10">
            <h4 className="text-sm font-bold text-blue-900 dark:text-blue-300">Why build a Saathi profile?</h4>
            <p className="mt-2 text-xs leading-relaxed text-blue-800/70 dark:text-blue-400/70">
              Build a digital resume that works for you. Get notified for jobs matching your skills and experience in your locality.
            </p>
          </div>
        </div>

        {/* main content */}
        <div className="lg:col-span-8">
          {isEditing ? (
            <JobProfileCoordinator
              initialData={user}
              existingProfile={jobProfile}
              onSuccess={fetchProfileData}
              onClose={() => setIsEditing(false)}
            />
          ) : (
            <ProfileInfoView />
          )}
        </div>
      </div>
    </div>
  )
}
