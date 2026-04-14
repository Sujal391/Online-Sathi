'use client'

import * as React from 'react'
import { useFormContext, useFieldArray } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { TagInput } from '@/components/ui/TagInput'
import { Plus, Trash2, GraduationCap } from 'lucide-react'
import { JobProfileFormValues } from '@/lib/validations/jobProfile'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { motion, AnimatePresence } from 'framer-motion'

export function Step2JobEducation() {
  const { register, watch, setValue, control, formState: { errors } } = useFormContext<JobProfileFormValues>()
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'education'
  })

  // Ensure at least one education field
  React.useEffect(() => {
    if (fields.length === 0) {
      append({ level: '', schoolName: '', degree: '', passingYear: '', percentage: '' })
    }
  }, [fields, append])

  return (
    <div className="space-y-12">
      <div className="relative">
        <div className="flex items-center gap-4 mb-2">
          <div className="h-8 w-1 bg-indigo-600 rounded-full" />
          <h2 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">Career & Academic</h2>
        </div>
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Define your professional goals and educational foundation</p>
      </div>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <div className="space-y-3 group/field">
          <Label className="text-xs font-black uppercase tracking-widest text-zinc-400 group-focus-within/field:text-indigo-600 transition-colors">Target Job Role</Label>
          <Input {...register('jobRole')} placeholder="e.g. Senior Software Engineer" aria-invalid={!!errors.jobRole} className="h-12 rounded-xl focus:ring-indigo-500/10 transition-all shadow-sm" />
          {errors.jobRole && <p className="text-xs font-medium text-red-500">{errors.jobRole.message}</p>}
        </div>
        <div className="space-y-3 group/field">
          <Label className="text-xs font-black uppercase tracking-widest text-zinc-400 group-focus-within/field:text-indigo-600 transition-colors">Core Expertise</Label>
          <TagInput
            value={watch('skills') || []}
            onChange={(tags) => setValue('skills', tags, { shouldDirty: true, shouldValidate: true })}
            placeholder="Add skills (e.g. React, Node.js...)"
          />
          {errors.skills && <p className="text-xs font-medium text-red-500">{errors.skills.message}</p>}
        </div>
        <div className="md:col-span-2 space-y-3 group/field">
          <Label className="text-xs font-black uppercase tracking-widest text-zinc-400 group-focus-within/field:text-indigo-600 transition-colors">Professional Objective</Label>
          <Textarea 
            {...register('jobDescription')} 
            placeholder="Briefly describe your career aspirations and what makes you unique..."
            className="min-h-[120px] rounded-2xl focus:ring-indigo-500/10 transition-all shadow-sm leading-relaxed p-4"
            aria-invalid={!!errors.jobDescription}
          />
          {errors.jobDescription && <p className="text-xs font-medium text-red-500">{errors.jobDescription.message}</p>}
        </div>
      </div>

      <div className="space-y-8">
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <GraduationCap className="text-indigo-600" size={24} />
            <h3 className="text-lg font-black tracking-tight text-zinc-900 dark:text-zinc-100">Academic History</h3>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ level: '', schoolName: '', degree: '', passingYear: '', percentage: '' })}
            className="h-10 rounded-xl border-indigo-600/20 text-indigo-600 font-bold hover:bg-indigo-50 shadow-sm transition-all active:scale-95"
          >
            <Plus size={16} className="mr-2" /> Add Record
          </Button>
        </div>

        <div className="space-y-8">
          <AnimatePresence initial={false}>
            {fields.map((field, index) => (
              <motion.div
                key={field.id}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                className="group relative space-y-8 rounded-[2rem] border border-zinc-200 bg-white p-8 dark:border-white/5 dark:bg-zinc-900/40 shadow-sm transition-all hover:shadow-md"
              >
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    className="absolute right-4 top-4 h-10 w-10 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <Trash2 size={18} />
                  </Button>
                )}

                <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
                  <div className="space-y-3 group/field">
                    <Label className="text-xs font-black uppercase tracking-widest text-zinc-400 group-focus-within/field:text-indigo-600 transition-colors">Level</Label>
                    <Select 
                      onValueChange={(v) => setValue(`education.${index}.level`, v, { shouldDirty: true, shouldValidate: true })} 
                      value={watch(`education.${index}.level`)}
                    >
                      <SelectTrigger className="h-12 rounded-xl focus:ring-indigo-500/10 transition-all shadow-sm"><SelectValue placeholder="Select Level" /></SelectTrigger>
                      <SelectContent>
                        {["Master's", "Bachelor's", "Diploma", "School"].map(v => (
                          <SelectItem key={v} value={v}>{v}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3 group/field">
                    <Label className="text-xs font-black uppercase tracking-widest text-zinc-400 group-focus-within/field:text-indigo-600 transition-colors">School / University</Label>
                    <Input {...register(`education.${index}.schoolName`)} placeholder="e.g. Oxford University" className="h-12 rounded-xl focus:ring-indigo-500/10 transition-all shadow-sm" />
                  </div>
                  <div className="space-y-3 group/field">
                    <Label className="text-xs font-black uppercase tracking-widest text-zinc-400 group-focus-within/field:text-indigo-600 transition-colors">Degree / Major</Label>
                    <Input {...register(`education.${index}.degree`)} placeholder="e.g. Computer Science" className="h-12 rounded-xl focus:ring-indigo-500/10 transition-all shadow-sm" />
                  </div>
                  <div className="space-y-3 group/field">
                    <Label className="text-xs font-black uppercase tracking-widest text-zinc-400 group-focus-within/field:text-indigo-600 transition-colors">Graduation Year</Label>
                    <Input {...register(`education.${index}.passingYear`)} placeholder="YYYY" maxLength={4} className="h-12 rounded-xl focus:ring-indigo-500/10 transition-all shadow-sm" />
                  </div>
                  <div className="space-y-3 group/field">
                    <Label className="text-xs font-black uppercase tracking-widest text-zinc-400 group-focus-within/field:text-indigo-600 transition-colors">Result (GPA / %)</Label>
                    <Input {...register(`education.${index}.percentage`)} placeholder="e.g. 85% or 3.8/4.0" className="h-12 rounded-xl focus:ring-indigo-500/10 transition-all shadow-sm" />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
