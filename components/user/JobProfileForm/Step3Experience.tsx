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
    <div className="space-y-12">
      <div className="relative">
        <div className="flex items-center gap-4 mb-2">
          <div className="h-8 w-1 bg-emerald-600 rounded-full" />
          <h2 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">Professional Journey</h2>
        </div>
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Share your work history and career milestones</p>
      </div>

      <div className="max-w-[240px] space-y-3 group/field">
        <Label className="text-xs font-black uppercase tracking-widest text-zinc-400 group-focus-within/field:text-emerald-600 transition-colors">Total Career Experience (Years)</Label>
        <Input 
          type="number" 
          {...register('totalExperience')} 
          placeholder="0"
          className="h-12 rounded-xl focus:ring-emerald-500/10 transition-all shadow-sm font-bold text-lg"
          aria-invalid={!!errors.totalExperience}
        />
        {errors.totalExperience && <p className="text-xs font-medium text-red-500">{errors.totalExperience.message}</p>}
      </div>

      <div className="space-y-8">
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <Briefcase className="text-emerald-600" size={24} />
            <h3 className="text-lg font-black tracking-tight text-zinc-900 dark:text-zinc-100">Experience Details</h3>
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
            className="h-10 rounded-xl border-emerald-600/20 text-emerald-600 font-bold hover:bg-emerald-50 shadow-sm transition-all active:scale-95"
          >
            <Plus size={16} className="mr-2" /> Add Experience
          </Button>
        </div>

        {fields.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-100 bg-zinc-50/50 p-10 dark:border-white/5 dark:bg-white/5">
            <Briefcase size={40} className="mb-4 text-zinc-300 dark:text-zinc-700" />
            <p className="text-sm text-zinc-500 dark:text-zinc-400">No experience added. If you're a fresher, you can leave this empty.</p>
          </div>
        )}

        <div className="space-y-8">
          <AnimatePresence initial={false}>
            {fields.map((field, index) => {
              const currentlyWorking = watch(`workExperience.${index}.currentlyWorking`)
              
              return (
                <motion.div
                  key={field.id}
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -20 }}
                  className="group relative space-y-10 rounded-[2.5rem] border border-zinc-200 bg-white p-8 dark:border-white/5 dark:bg-zinc-900/40 shadow-sm transition-all hover:shadow-md"
                >
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    className="absolute right-4 top-4 h-10 w-10 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <Trash2 size={18} />
                  </Button>

                  <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2">
                    <div className="space-y-3 group/field">
                      <Label className="text-xs font-black uppercase tracking-widest text-zinc-400 group-focus-within/field:text-emerald-600 transition-colors">Designation / Role</Label>
                      <Input {...register(`workExperience.${index}.jobRole`)} placeholder="e.g. Lead Product Designer" className="h-12 rounded-xl focus:ring-emerald-500/10 transition-all shadow-sm" />
                    </div>
                    <div className="space-y-3 group/field">
                      <Label className="text-xs font-black uppercase tracking-widest text-zinc-400 group-focus-within/field:text-emerald-600 transition-colors">Organization Name</Label>
                      <Input {...register(`workExperience.${index}.companyName`)} placeholder="e.g. Google India" className="h-12 rounded-xl focus:ring-emerald-500/10 transition-all shadow-sm" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-3 group/field">
                      <Label className="text-xs font-black uppercase tracking-widest text-zinc-400 group-focus-within/field:text-emerald-600 transition-colors">Monthly Salary (₹)</Label>
                      <Input type="number" {...register(`workExperience.${index}.salary`)} placeholder="0" className="h-12 rounded-xl focus:ring-emerald-500/10 transition-all shadow-sm" />
                    </div>
                    <div className="space-y-3 group/field">
                      <Label className="text-xs font-black uppercase tracking-widest text-zinc-400 group-focus-within/field:text-emerald-600 transition-colors">Duration (Years)</Label>
                      <Input type="number" {...register(`workExperience.${index}.yearsExp`)} placeholder="0" className="h-12 rounded-xl focus:ring-emerald-500/10 transition-all shadow-sm" />
                    </div>
                    <div className="space-y-3 group/field">
                      <Label className="text-xs font-black uppercase tracking-widest text-zinc-400 group-focus-within/field:text-emerald-600 transition-colors">Location (Country)</Label>
                      <Input {...register(`workExperience.${index}.country`)} placeholder="e.g. India" className="h-12 rounded-xl focus:ring-emerald-500/10 transition-all shadow-sm" />
                    </div>
                    <div className="space-y-3 group/field">
                      <Label className="text-xs font-black uppercase tracking-widest text-zinc-400 group-focus-within/field:text-emerald-600 transition-colors">City</Label>
                      <Input {...register(`workExperience.${index}.city`)} placeholder="e.g. Bangalore" className="h-12 rounded-xl focus:ring-emerald-500/10 transition-all shadow-sm" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3">
                    <div className="space-y-3 group/field">
                      <Label className="text-xs font-black uppercase tracking-widest text-zinc-400 group-focus-within/field:text-emerald-600 transition-colors">Career Commencement Date</Label>
                      <Input type="date" {...register(`workExperience.${index}.startDate`)} className="h-12 rounded-xl focus:ring-emerald-500/10 transition-all shadow-sm" />
                    </div>
                    {!currentlyWorking && (
                      <div className="space-y-3 group/field">
                        <Label className="text-xs font-black uppercase tracking-widest text-zinc-400 group-focus-within/field:text-emerald-600 transition-colors">Career Conclusion Date</Label>
                        <Input type="date" {...register(`workExperience.${index}.endDate`)} className="h-12 rounded-xl focus:ring-emerald-500/10 transition-all shadow-sm" />
                      </div>
                    )}
                    <div className="flex items-end">
                      <div className="flex items-center gap-3 w-full p-3.5 rounded-xl border border-zinc-100 bg-zinc-50/50 dark:border-white/5 dark:bg-white/5 transition-all hover:bg-zinc-100">
                        <Checkbox 
                          id={`working-${index}`} 
                          checked={currentlyWorking}
                          onCheckedChange={(c) => setValue(`workExperience.${index}.currentlyWorking`, c as boolean, { shouldDirty: true, shouldValidate: true })}
                          className="h-5 w-5 rounded-md border-zinc-300 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                        />
                        <Label htmlFor={`working-${index}`} className="text-xs font-bold text-zinc-500 cursor-pointer">Currently Working Here</Label>
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
