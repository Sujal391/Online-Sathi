'use client'

import * as React from 'react'
import { useFormContext } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FilePicker } from '@/components/ui/FilePicker'
import { JobProfileFormValues } from '@/lib/validations/jobProfile'
import { ShieldCheck, Info } from 'lucide-react'

interface Step4DocumentsProps {
  isUpdateMode?: boolean
}

export function Step4Documents({ isUpdateMode = false }: Step4DocumentsProps) {
  const { register, watch, setValue, formState: { errors } } = useFormContext<JobProfileFormValues>()

  return (
    <div className="space-y-12">
      <div className="relative">
        <div className="flex items-center gap-4 mb-2">
          <div className="h-8 w-1 bg-zinc-900 dark:bg-zinc-100 rounded-full" />
          <h2 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">Identity Trust</h2>
        </div>
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Secure your profile with official document verification</p>
      </div>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <div className="space-y-8">
          <div className="space-y-3 group/field">
            <Label className="text-xs font-black uppercase tracking-widest text-zinc-400 group-focus-within/field:text-zinc-900 dark:group-focus-within/field:text-zinc-100 transition-colors">Credential Category</Label>
            <Select
              onValueChange={(v) => setValue('documentType', v, { shouldDirty: true, shouldValidate: true })}
              value={watch('documentType')}
            >
              <SelectTrigger className="h-12 rounded-xl focus:ring-zinc-500/10 transition-all shadow-sm">
                <SelectValue placeholder="Select Document Type" />
              </SelectTrigger>
              <SelectContent>
                {[
                  { label: 'Aadhar Card', value: 'Aadhar' },
                  { label: 'PAN Card', value: 'PAN' },
                  { label: 'Voter ID', value: 'Voter' },
                  { label: 'Passport', value: 'Passport' },
                  { label: 'Driving License', value: 'Driving' }
                ].map(item => (
                  <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.documentType && <p className="text-xs font-medium text-red-500">{errors.documentType.message}</p>}
          </div>

          <div className="space-y-3 group/field">
            <Label className="text-xs font-black uppercase tracking-widest text-zinc-400 group-focus-within/field:text-zinc-900 dark:group-focus-within/field:text-zinc-100 transition-colors">Identification Number</Label>
            <Input
              {...register('documentNumber')}
              placeholder="Unique number as per document"
              className="h-12 rounded-xl focus:ring-zinc-500/10 transition-all shadow-sm"
              aria-invalid={!!errors.documentNumber}
            />
            {errors.documentNumber && <p className="text-xs font-medium text-red-500">{errors.documentNumber.message}</p>}
          </div>

          {!isUpdateMode && (
            <div className="space-y-3 group/field">
              <Label className="text-xs font-black uppercase tracking-widest text-zinc-400 group-focus-within/field:text-emerald-600 transition-colors">Service Tier</Label>
              <Select
                onValueChange={(v) => setValue('transactionType', v as any, { shouldDirty: true, shouldValidate: true })}
                value={watch('transactionType')}
              >
                <SelectTrigger className="h-12 rounded-xl border-emerald-100 bg-emerald-50/20 focus:ring-emerald-500/10 transition-all shadow-sm">
                  <SelectValue placeholder="Select Plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PROFILE_WITH_RESUME">Professional Resume + Profile</SelectItem>
                  <SelectItem value="ONLY_PROFILE">Standard Job Profile</SelectItem>
                </SelectContent>
              </Select>
              {errors.transactionType && <p className="text-xs font-medium text-red-500">{errors.transactionType.message}</p>}
            </div>
          )}

          <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4 dark:border-blue-900/30 dark:bg-blue-950/20">
            <div className="flex gap-3">
              <div className="mt-0.5 text-blue-600">
                <ShieldCheck size={18} />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">Privacy Guarantee</p>
                <p className="text-xs leading-relaxed text-blue-700/80 dark:text-blue-400/80">
                  Your documents are strictly used for verification and are encrypted with industry-standard protocols.
                  We never share your personal data with third parties without consent.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          <div className="group/picker relative p-1 rounded-3xl bg-zinc-50 dark:bg-white/5 border border-zinc-100 transition-all hover:bg-zinc-100 hover:border-zinc-200">
            <FilePicker
              label="Verification Source (Front)"
              value={watch('documentFront')}
              onChange={(url) => setValue('documentFront', url)}
              error={errors.documentFront?.message}
            />
          </div>
          <div className="group/picker relative p-1 rounded-3xl bg-zinc-50 dark:bg-white/5 border border-zinc-100 transition-all hover:bg-zinc-100 hover:border-zinc-200">
            <FilePicker
              label="Verification Source (Back)"
              value={watch('documentBack')}
              onChange={(url) => setValue('documentBack', url)}
              error={errors.documentBack?.message}
            />
          </div>
        </div>
      </div>

      <div className="flex items-start gap-4 p-5 rounded-[1.5rem] bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-2xl">
        <div className="mt-1">
          <Info size={20} className="text-zinc-400" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-bold tracking-tight">Compliance & Authenticity</p>
          <p className="text-xs leading-relaxed text-zinc-400 dark:text-zinc-500 font-medium">
            By finalising this profile, you declare that all data is lawful and personally owned. 
            Any discrepancies may trigger automated profile suspension.
          </p>
        </div>
      </div>
    </div>
  )
}
