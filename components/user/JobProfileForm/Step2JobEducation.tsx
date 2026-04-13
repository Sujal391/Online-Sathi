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
    <div className="space-y-10">
      <div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">Career Goal & Education</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Tell us about your professional background</p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Desired Job Role</Label>
            <Input {...register('jobRole')} placeholder="e.g. Software Engineer" aria-invalid={!!errors.jobRole} />
            {errors.jobRole && <p className="text-xs text-red-500">{errors.jobRole.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Professional Skills</Label>
            <TagInput
              value={watch('skills') || []}
              onChange={(tags) => setValue('skills', tags, { shouldDirty: true, shouldValidate: true })}
              placeholder="Add skills (e.g. JavaScript, React...)"
            />
            {errors.skills && <p className="text-xs text-red-500">{errors.skills.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Brief Job Description / Objective</Label>
          <Textarea 
            {...register('jobDescription')} 
            placeholder="Describe your career goals and what you bring to the table..."
            className="min-h-[100px]"
            aria-invalid={!!errors.jobDescription}
          />
          {errors.jobDescription && <p className="text-xs text-red-500">{errors.jobDescription.message}</p>}
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-white/5 pb-2">
          <div className="flex items-center gap-2">
            <GraduationCap className="text-blue-600" size={20} />
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Education Details</h3>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ level: '', schoolName: '', degree: '', passingYear: '', percentage: '' })}
            className="rounded-xl border-blue-600/20 text-blue-600 hover:bg-blue-50"
          >
            <Plus size={14} className="mr-1" /> Add Education
          </Button>
        </div>

        <div className="space-y-6">
          <AnimatePresence initial={false}>
            {fields.map((field, index) => (
              <motion.div
                key={field.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="relative space-y-4 rounded-2xl border border-zinc-100 bg-zinc-50/30 p-5 dark:border-white/5 dark:bg-white/5"
              >
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    className="absolute right-2 top-2 h-8 w-8 text-zinc-400 hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </Button>
                )}

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Education Level</Label>
                    <Select 
                      onValueChange={(v) => setValue(`education.${index}.level`, v, { shouldDirty: true, shouldValidate: true })} 
                      value={watch(`education.${index}.level`)}
                    >
                      <SelectTrigger><SelectValue placeholder="Select Level" /></SelectTrigger>
                      <SelectContent>
                        {["Master's", "Bachelor's", "Diploma", "School"].map(v => (
                          <SelectItem key={v} value={v}>{v}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>School/University Name</Label>
                    <Input {...register(`education.${index}.schoolName`)} placeholder="e.g. Oxford University" />
                  </div>
                  <div className="space-y-2">
                    <Label>Degree/Stream</Label>
                    <Input {...register(`education.${index}.degree`)} placeholder="e.g. Computer Science" />
                  </div>
                  <div className="space-y-2">
                    <Label>Passing Year</Label>
                    <Input {...register(`education.${index}.passingYear`)} placeholder="YYYY" maxLength={4} />
                  </div>
                  <div className="space-y-2">
                    <Label>Percentage/CGPA</Label>
                    <Input {...register(`education.${index}.percentage`)} placeholder="e.g. 85%" />
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
