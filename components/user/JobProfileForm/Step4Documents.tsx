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
    <div className="space-y-10">
      <div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">Identity Verification</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Final step to secure your profile</p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Document Type</Label>
            <Select
              onValueChange={(v) => setValue('documentType', v, { shouldDirty: true, shouldValidate: true })}
              value={watch('documentType')}
            >
              <SelectTrigger className="h-12 rounded-xl">
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
            {errors.documentType && <p className="text-xs text-red-500">{errors.documentType.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Document Number</Label>
            <Input
              {...register('documentNumber')}
              placeholder="Enter unique ID number"
              className="h-12 rounded-xl"
              aria-invalid={!!errors.documentNumber}
            />
            {errors.documentNumber && <p className="text-xs text-red-500">{errors.documentNumber.message}</p>}
          </div>

          {!isUpdateMode && (
            <div className="space-y-2">
              <Label>Transaction Type</Label>
              <Select
                onValueChange={(v) => setValue('transactionType', v as any, { shouldDirty: true, shouldValidate: true })}
                value={watch('transactionType')}
              >
                <SelectTrigger className="h-12 rounded-xl">
                  <SelectValue placeholder="Select Transaction Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PROFILE_WITH_RESUME">Job Profile With Resume</SelectItem>
                  <SelectItem value="ONLY_PROFILE">Only Job Profile</SelectItem>
                </SelectContent>
              </Select>
              {errors.transactionType && <p className="text-xs text-red-500">{errors.transactionType.message}</p>}
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

        <div className="grid grid-cols-1 gap-6">
          <FilePicker
            label="Document Front"
            value={watch('documentFront')}
            onChange={(url) => setValue('documentFront', url)}
            error={errors.documentFront?.message}
          />
          <FilePicker
            label="Document Back"
            value={watch('documentBack')}
            onChange={(url) => setValue('documentBack', url)}
            error={errors.documentBack?.message}
          />
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-2xl bg-zinc-50 p-4 dark:bg-white/5">
        <div className="mt-0.5 text-zinc-400">
          <Info size={16} />
        </div>
        <p className="text-xs leading-relaxed text-zinc-500">
          By completing this registration, you agree that the information provided is accurate and belongs to you.
          Misleading information may lead to profile suspension.
        </p>
      </div>
    </div>
  )
}
