'use client'

import * as React from 'react'
import { useFormContext, useFieldArray } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Plus, Trash2, Briefcase } from 'lucide-react'
import { JobProfileFormValues } from '@/lib/validations/jobProfile'
import { motion, AnimatePresence } from 'framer-motion'

export function Step3Experience() {
  const { register, control, watch, setValue, formState: { errors } } = useFormContext<JobProfileFormValues>()
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'workExperience'
  })

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">Work History</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Share your professional journey</p>
      </div>

      <div className="max-w-[200px] space-y-2">
        <Label>Total Experience (Years)</Label>
        <Input 
          type="number" 
          {...register('totalExperience')} 
          placeholder="0"
          aria-invalid={!!errors.totalExperience}
        />
        {errors.totalExperience && <p className="text-xs text-red-500">{errors.totalExperience.message}</p>}
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-white/5 pb-2">
          <div className="flex items-center gap-2">
            <Briefcase className="text-blue-600" size={20} />
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Experience Details</h3>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ 
              jobRole: '', companyName: '', salary: 0, yearsExp: 0, 
              country: '', city: '', startDate: '', endDate: '', 
              currentlyWorking: false 
            })}
            className="rounded-xl border-blue-600/20 text-blue-600 hover:bg-blue-50"
          >
            <Plus size={14} className="mr-1" /> Add Experience
          </Button>
        </div>

        {fields.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-100 bg-zinc-50/50 p-10 dark:border-white/5 dark:bg-white/5">
            <Briefcase size={40} className="mb-4 text-zinc-300 dark:text-zinc-700" />
            <p className="text-sm text-zinc-500 dark:text-zinc-400">No experience added. If you're a fresher, you can leave this empty.</p>
          </div>
        )}

        <div className="space-y-6">
          <AnimatePresence initial={false}>
            {fields.map((field, index) => {
              const currentlyWorking = watch(`workExperience.${index}.currentlyWorking`)
              
              return (
                <motion.div
                  key={field.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="relative space-y-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-white/5"
                >
                  <div className="absolute right-4 top-4">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      className="h-8 w-8 text-zinc-300 hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Job Role</Label>
                      <Input {...register(`workExperience.${index}.jobRole`)} placeholder="e.g. Lead Designer" />
                    </div>
                    <div className="space-y-2">
                      <Label>Company Name</Label>
                      <Input {...register(`workExperience.${index}.companyName`)} placeholder="e.g. Acme Corp" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-2">
                      <Label>Monthly Salary (₹)</Label>
                      <Input type="number" {...register(`workExperience.${index}.salary`)} placeholder="0" />
                    </div>
                    <div className="space-y-2">
                      <Label>Years of Exp</Label>
                      <Input type="number" {...register(`workExperience.${index}.yearsExp`)} placeholder="0" />
                    </div>
                    <div className="space-y-2">
                      <Label>Country</Label>
                      <Input {...register(`workExperience.${index}.country`)} placeholder="e.g. India" />
                    </div>
                    <div className="space-y-2">
                      <Label>City</Label>
                      <Input {...register(`workExperience.${index}.city`)} placeholder="e.g. Delhi" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Input type="date" {...register(`workExperience.${index}.startDate`)} />
                    </div>
                    {!currentlyWorking && (
                      <div className="space-y-2">
                        <Label>End Date</Label>
                        <Input type="date" {...register(`workExperience.${index}.endDate`)} />
                      </div>
                    )}
                    <div className="flex items-end pb-2">
                      <div className="flex items-center gap-2 rounded-lg border border-zinc-100 bg-zinc-50 px-3 py-2.5 dark:border-white/5 dark:bg-white/5">
                        <Checkbox 
                          id={`working-${index}`} 
                          checked={currentlyWorking}
                          onCheckedChange={(c) => setValue(`workExperience.${index}.currentlyWorking`, c as boolean, { shouldDirty: true, shouldValidate: true })}
                        />
                        <Label htmlFor={`working-${index}`} className="text-xs">I am currently working here</Label>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
