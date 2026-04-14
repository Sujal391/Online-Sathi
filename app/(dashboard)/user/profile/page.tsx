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
      className="space-y-10"
    >
      {/* Account Info Card */}
      <div className="group relative overflow-hidden rounded-[2.5rem] border border-zinc-200 bg-white p-10 dark:border-white/5 dark:bg-zinc-900/50 shadow-sm transition-all hover:shadow-xl hover:shadow-blue-500/5">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-500/5 blur-[100px] transition-all group-hover:bg-blue-500/10" />
        <div className="absolute -left-32 -bottom-32 h-96 w-96 rounded-full bg-indigo-500/5 blur-[100px] transition-all group-hover:bg-indigo-500/10" />

        <div className="relative flex flex-col gap-10 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-8 md:flex-row md:items-center">
            <div className="relative">
              <div className="flex h-28 w-28 items-center justify-center rounded-[2rem] bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-2xl shadow-blue-500/30">
                <UserIcon size={48} className="drop-shadow-sm" />
              </div>
              {jobProfile && (
                <div className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg ring-4 ring-white dark:ring-zinc-900">
                  <CheckCircle2 size={18} />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">{user?.fullName}</h2>
              <div className="flex flex-wrap items-center gap-3">
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 px-3 py-1 rounded-full dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">
                  <span className="flex items-center gap-1.5 capitalize">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    {user?.approvalStatus?.toLowerCase() || 'active profile'}
                  </span>
                </Badge>
                <div className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                <span className="text-sm font-medium text-zinc-500">Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) : 'recent'}</span>
              </div>
            </div>
          </div>

          <Button
            onClick={() => setIsEditing(true)}
            className="group h-14 gap-3 rounded-2xl bg-zinc-900 px-8 font-bold text-white shadow-xl shadow-zinc-200 transition-all hover:-translate-y-1 hover:bg-zinc-800 hover:shadow-2xl dark:bg-white dark:text-zinc-900 dark:shadow-none dark:hover:bg-zinc-200"
          >
            <Edit3 size={20} className="transition-transform group-hover:rotate-12" />
            {jobProfile ? 'Edit Job Profile' : 'Build Profile'}
            <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Button>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <InfoCard icon={<Mail size={20} className="text-blue-500" />} label="Email Address" value={user?.email || jobProfile?.email} />
          <InfoCard icon={<Phone size={20} className="text-indigo-500" />} label="Contact" value={user?.mobile || jobProfile?.phoneNumber} />
          <InfoCard icon={<Calendar size={20} className="text-purple-500" />} label="Date of Birth" value={user?.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : (jobProfile?.dateOfBirth ? new Date(jobProfile.dateOfBirth).toLocaleDateString() : 'N/A')} />
          <InfoCard icon={<UserCircle size={20} className="text-emerald-500" />} label="Gender" value={user?.gender || jobProfile?.gender} />
        </div>
      </div>

      {jobProfile ? (
        <JobProfileDetailView profile={jobProfile} />
      ) : (
        <div className="group relative overflow-hidden rounded-[2.5rem] border-2 border-dashed border-zinc-200 bg-zinc-50/30 p-20 text-center transition-all hover:border-blue-300 dark:border-white/10 dark:bg-white/5">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-indigo-500/0 opacity-0 transition-opacity group-hover:opacity-5 group-hover:to-indigo-500/10" />
          <div className="relative">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-white text-zinc-300 shadow-xl transition-transform group-hover:scale-110 group-hover:rotate-3 dark:bg-zinc-900">
              <Briefcase size={40} className="text-zinc-200 group-hover:text-blue-400 transition-colors" />
            </div>
            <h3 className="mt-8 text-2xl font-bold text-zinc-900 dark:text-zinc-100">Unlock Career Opportunities</h3>
            <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-zinc-500 dark:text-zinc-400">
              Your professional profile is currently empty. Completing it increases your visibility to recruiters by <span className="text-blue-600 font-bold">80%</span>.
            </p>
            <Button
              onClick={() => setIsEditing(true)}
              className="mt-10 h-14 rounded-2xl bg-blue-600 px-10 font-bold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-2xl dark:shadow-none transition-all"
            >
              Start Building Now
              <ChevronRight size={20} className="ml-2" />
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  )

  const InfoCard = ({ icon, label, value }: { icon: React.ReactNode, label: string, value?: string }) => (
    <div className="flex flex-col gap-3 group/info">
      <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-[0.1em] text-zinc-400">
        <div className="p-2 rounded-xl bg-zinc-50 dark:bg-white/5 transition-transform group-hover/info:scale-110 group-hover/info:bg-white group-hover/info:shadow-md dark:group-hover/info:bg-white/10">
          {icon}
        </div>
        <span className="truncate">{label}</span>
      </div>
      <div className="pl-1 text-[1.05rem] font-bold text-zinc-900 dark:text-zinc-100 break-all sm:break-words">
        {value || 'Not provided'}
      </div>
    </div>
  )

  const JobProfileDetailView = ({ profile }: { profile: JobProfileData & { profileStatus: string } }) => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Professional Info */}
        <Card className="lg:col-span-2 p-10 rounded-[2.5rem] border-zinc-200 dark:border-white/5 space-y-10 shadow-sm">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="space-y-2">
              <h3 className="text-2xl font-extrabold flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10">
                  <Briefcase size={24} />
                </div>
                Professional Profile
              </h3>
              <p className="text-zinc-500 font-medium">Detailed overview of your professional scope</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-zinc-50 dark:bg-white/5 border border-zinc-100 dark:border-white/10">
              <div className={cn(
                "h-2 w-2 rounded-full",
                profile.profileStatus === 'VERIFIED' ? "bg-emerald-500" : "bg-orange-500"
              )} />
              <span className="text-xs font-bold uppercase tracking-widest">{profile.profileStatus}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-3">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Target Role</label>
              <p className="text-xl font-bold bg-gradient-to-r from-zinc-900 to-zinc-600 bg-clip-text text-transparent dark:from-white dark:to-zinc-400">
                {profile.jobRole}
              </p>
            </div>
            <div className="space-y-3">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Employment Type</label>
              <Badge variant="outline" className="text-sm font-semibold rounded-xl px-4 py-1 border-zinc-200">
                {profile.jobType}
              </Badge>
            </div>
            <div className="md:col-span-2 space-y-3">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">About Professional Journey</label>
              <p className="text-[1.05rem] leading-[1.8] text-zinc-600 dark:text-zinc-400 font-medium whitespace-pre-wrap">{profile.jobDescription}</p>
            </div>
          </div>

          <div className="space-y-5">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest block underline decoration-blue-500/30 underline-offset-8">Expertise & Technical Skills</label>
            <div className="flex flex-wrap gap-3">
              {profile.skills.map((skill) => (
                <div key={skill} className="group/skill relative">
                  <div className="absolute inset-0 bg-blue-600 rounded-2xl blur-md opacity-0 transition-opacity group-hover/skill:opacity-20" />
                  <Badge className="relative rounded-2xl px-5 py-2.5 border-blue-100 bg-white text-blue-700 shadow-sm transition-all hover:-translate-y-1 hover:border-blue-300 dark:border-blue-900/30 dark:bg-blue-900/20 dark:text-blue-300">
                    {skill}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Sidebar Info - Experience/Languages */}
        <div className="space-y-8">
          <Card className="p-8 rounded-[2.5rem] border-zinc-200 dark:border-white/5 space-y-8 shadow-sm">
            <div className="flex items-center gap-5">
              <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 shadow-inner">
                <Award size={28} />
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Experience</p>
                <p className="text-2xl font-black">{profile.totalExperience} Year{profile.totalExperience !== 1 ? 's' : ''}</p>
              </div>
            </div>

            <div className="h-px bg-zinc-100 dark:bg-white/5" />

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                <Languages size={18} className="text-emerald-500" />
                Languages
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.languages.map((lang) => (
                  <span key={lang} className="text-sm font-bold px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          </Card>

          <div className="relative overflow-hidden p-8 rounded-[2.5rem] bg-gradient-to-br from-zinc-900 to-black text-white shadow-2xl">
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-500/20 blur-2xl" />
            <div className="relative space-y-6">
              <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md">
                <CheckCircle2 size={24} className="text-emerald-400" />
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-bold tracking-tight">Verified Professional</h4>
                <p className="text-sm text-zinc-400 leading-relaxed font-medium">Your global identity has been established. You are now prioritized for premium career matches.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Experience & Education Timelines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Education Timeline */}
        <Card className="p-10 rounded-[2.5rem] border-zinc-200 dark:border-white/5 space-y-8 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                <GraduationCap size={22} />
              </div>
              Education
            </h3>
          </div>
          <div className="space-y-10 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-zinc-100 dark:before:bg-white/5">
            {profile.education.map((edu, idx) => (
              <div key={idx} className="relative pl-12 group/item">
                <div className="absolute left-0 top-1 w-10 h-10 rounded-2xl bg-white dark:bg-zinc-900 border-2 border-zinc-100 dark:border-white/10 flex items-center justify-center z-10 shadow-sm transition-all group-hover/item:border-indigo-500 group-hover/item:scale-110">
                  <div className="w-3 h-3 rounded-full bg-indigo-600" />
                </div>
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{edu.degree}</p>
                    <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-widest">{edu.passingYear}</span>
                  </div>
                  <p className="font-bold text-zinc-400 text-sm">{edu.level}</p>
                  <p className="text-sm font-medium text-zinc-500 flex items-center gap-2">
                    <Building2 size={16} className="text-zinc-300" /> {edu.schoolName}
                  </p>
                  <div className="mt-2 text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 inline-block px-2 py-0.5 rounded">
                    Result: {edu.percentage}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Work Timeline */}
        <Card className="p-10 rounded-[2.5rem] border-zinc-200 dark:border-white/5 space-y-8 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <Building2 size={22} />
              </div>
              Experience
            </h3>
          </div>
          <div className="space-y-10 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-zinc-100 dark:before:bg-white/5">
            {profile.workExperience.map((exp, idx) => (
              <div key={idx} className="relative pl-12 group/item">
                <div className="absolute left-0 top-1 w-10 h-10 rounded-2xl bg-white dark:bg-zinc-900 border-2 border-zinc-100 dark:border-white/10 flex items-center justify-center z-10 shadow-sm transition-all group-hover/item:border-emerald-500 group-hover/item:scale-110">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                </div>
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{exp.jobRole}</p>
                    <span className={cn(
                      "text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest",
                      exp.currentlyWorking ? "bg-emerald-500 text-white" : "bg-zinc-100 text-zinc-500 dark:bg-white/10 dark:text-zinc-400"
                    )}>
                      {exp.startDate} — {exp.currentlyWorking ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <p className="font-bold text-zinc-400 text-sm">{exp.companyName}</p>
                  <div className="flex flex-wrap items-center gap-6 mt-3">
                    <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
                      <MapPin size={16} className="text-zinc-300" /> {exp.city}, {exp.country}
                    </div>
                    <div className="text-xs font-black text-blue-600 tabular-nums">
                      ₹{exp.salary.toLocaleString()}/mo
                    </div>
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

      <div className="max-w-5xl">
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
  )
}
