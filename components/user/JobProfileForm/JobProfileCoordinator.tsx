'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { JobProfileSchema, type JobProfileFormValues } from '@/lib/validations/jobProfile'
import { Step1Personal } from './Step1Personal'
import { Step2JobEducation } from './Step2JobEducation'
import { Step3Experience } from './Step3Experience'
import { Step4Documents } from './Step4Documents'
import { Button } from '@/components/ui/button'
import { CheckCircle2, ChevronRight, ChevronLeft, Loader2, X } from 'lucide-react'
import { jobProfileService, JobProfileData } from '@/services/jobProfile.service'
import { User } from '@/services/auth.service'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const STEPS = [
  { id: 1, title: 'Personal', description: 'About you & address' },
  { id: 2, title: 'Job & Education', description: 'Role & qualifications' },
  { id: 3, title: 'Experience', description: 'Work history' },
  { id: 4, title: 'Documents', description: 'Identity verification' },
]

const STORAGE_KEY = 'job_profile_draft'
const RZP_KEY_ID = 'rzp_test_SctRrmpPJDKXas'

interface JobProfileCoordinatorProps {
  initialData?: User | null
  existingProfile?: (JobProfileData & { profileStatus: string }) | null
  onSuccess?: () => Promise<void> | void
  onClose?: () => void
}

function buildFormValues(
  initialData?: User | null,
  existingProfile?: (JobProfileData & { profileStatus: string }) | null
): JobProfileFormValues {
  return {
    fullName: existingProfile?.fullName || initialData?.fullName || '',
    phoneNumber: existingProfile?.phoneNumber || initialData?.mobile || '',
    email: existingProfile?.email || '',
    maritalStatus: existingProfile?.maritalStatus || '',
    gender: existingProfile?.gender || (initialData?.gender === 'MALE' ? 'Male' : initialData?.gender === 'FEMALE' ? 'Female' : ''),
    dateOfBirth: existingProfile?.dateOfBirth ? existingProfile.dateOfBirth.split('T')[0] : (initialData?.dateOfBirth ? initialData.dateOfBirth.split('T')[0] : ''),
    languages: existingProfile?.languages || [],
    currentCountry: existingProfile?.currentCountry || '',
    currentState: existingProfile?.currentState || '',
    currentDistrict: existingProfile?.currentDistrict || '',
    currentAddress: existingProfile?.currentAddress || '',
    currentPincode: existingProfile?.currentPincode || '',
    permanentCountry: existingProfile?.permanentCountry || '',
    permanentState: existingProfile?.permanentState || '',
    permanentDistrict: existingProfile?.permanentDistrict || '',
    permanentAddress: existingProfile?.permanentAddress || '',
    permanentPincode: existingProfile?.permanentPincode || '',
    jobType: (existingProfile?.jobType || '') as "Full Time" | "Part time" | "Daily wages" | "",
    jobRole: existingProfile?.jobRole || '',
    skills: existingProfile?.skills || [],
    jobDescription: existingProfile?.jobDescription || '',
    education: existingProfile?.education || [],
    totalExperience: existingProfile?.totalExperience || 0,
    workExperience: existingProfile?.workExperience || [],
    documentType: existingProfile?.documentType || '',
    documentFront: existingProfile?.documentFront || '',
    documentBack: existingProfile?.documentBack || '',
    documentNumber: existingProfile?.documentNumber || '',
    transactionType: existingProfile?.transactionType || 'PROFILE_WITH_RESUME',
  }
}

export function JobProfileCoordinator({ initialData, existingProfile, onSuccess, onClose }: JobProfileCoordinatorProps) {
  const [currentStep, setCurrentStep] = React.useState(1)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isRestored, setIsRestored] = React.useState(false)

  const isUpdateMode = !!existingProfile
  const hasInitializedForm = React.useRef(false)

  const methods = useForm<JobProfileFormValues>({
    resolver: zodResolver(JobProfileSchema) as any,
    mode: 'onChange',
    defaultValues: buildFormValues(initialData, existingProfile),
  } as any)

  const { handleSubmit, trigger, reset, getValues, formState: { errors } } = methods

  // 1. Initial Draft Restoration
  React.useEffect(() => {
    if (isUpdateMode) {
      setIsRestored(true)
      return
    }

    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved && !isRestored) {
      try {
        const draft = JSON.parse(saved)
        reset(draft.data)
        if (draft.step) setCurrentStep(draft.step)
        setIsRestored(true)
        toast.info('Restored your draft progress')
      } catch (e) {
        console.error('Failed to restore draft:', e)
      }
    }
  }, [reset, isRestored, isUpdateMode])

  // 2. Prepopulate once from auth/profile after mount
  React.useEffect(() => {
    if ((initialData || existingProfile) && !hasInitializedForm.current && isRestored) {
      reset(buildFormValues(initialData, existingProfile))
      hasInitializedForm.current = true
    }
  }, [initialData, existingProfile, reset, isRestored])

  // 3. Load Razorpay Script
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true)
        return
      }
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const saveDraft = (step: number) => {
    const data = getValues()
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ data, step, timestamp: Date.now() }))
  }

  const next = async () => {
    const fields = getFieldsForStep(currentStep) as any[]
    const isValid = await trigger(fields)

    if (isValid) {
      const nextStep = currentStep + 1
      if (currentStep < 4) {
        setCurrentStep(nextStep)
        saveDraft(nextStep)
      }
    } else {
      console.log('Validation Errors for Step', currentStep, ':', errors)
      toast.error('Please fix the errors before continuing')
    }
  }

  const prev = () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1
      setCurrentStep(prevStep)
      saveDraft(prevStep)
    }
  }

  const getFieldsForStep = (step: number) => {
    switch (step) {
      case 1:
        return [
          'fullName', 'phoneNumber', 'email', 'maritalStatus', 'gender', 'dateOfBirth', 'languages',
          'currentCountry', 'currentState', 'currentDistrict', 'currentAddress', 'currentPincode',
          'permanentCountry', 'permanentState', 'permanentDistrict', 'permanentAddress', 'permanentPincode',
          'jobType'
        ]
      case 2:
        return ['jobRole', 'skills', 'jobDescription', 'education']
      case 3:
        return ['totalExperience', 'workExperience']
      case 4:
        return ['documentType', 'documentFront', 'documentBack', 'documentNumber', 'transactionType']
      default:
        return []
    }
  }

  const handlePayment = (data: any) => {
    return new Promise((resolve, reject) => {
      const options = {
        key: RZP_KEY_ID,
        amount: 1000, // 10 INR in paise
        currency: 'INR',
        name: 'Online Sathi',
        description: 'Job Profile Creation Fee',
        handler: function (response: any) {
          resolve(response.razorpay_payment_id)
        },
        prefill: {
          name: data.fullName,
          email: data.email,
          contact: data.phoneNumber
        },
        theme: {
          color: '#2563eb',
        },
        modal: {
          ondismiss: function () {
            reject(new Error('Payment cancelled'))
          }
        }
      }
      const rzp = new (window as any).Razorpay(options)
      rzp.open()
    })
  }

  const onSubmit = async (data: any) => {
    setIsSubmitting(true)

    try {
      const shouldProcessPayment = !isUpdateMode && data.transactionType === 'ONLY_PROFILE'

      // 1. Conditional Payment Logic
      if (shouldProcessPayment) {
        const scriptLoaded = await loadRazorpay()
        if (!scriptLoaded) {
          toast.error('Failed to load payment gateway')
          setIsSubmitting(false)
          return
        }

        try {
          await handlePayment(data)
          toast.success('Payment Successful!')
        } catch (err: any) {
          toast.error(err.message || 'Payment failed')
          setIsSubmitting(false)
          return
        }
      }

      // 2. Final API Call
      const response = isUpdateMode
        ? await jobProfileService.updateJobProfile(data as any)
        : await jobProfileService.saveJobProfile(data as any)

      if (response.success) {
        toast.success(response.message || `Job Profile ${isUpdateMode ? 'updated' : 'created'} successfully!`)
        localStorage.removeItem(STORAGE_KEY)

        if (onSuccess) {
          await onSuccess()
        }

        // Auto-close form on success
        if (onClose) onClose()
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to save job profile')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl pb-10">
      {/* header with cancel button */}
      <div className="mb-6 flex items-center justify-between px-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            {isUpdateMode ? 'Update Job Profile' : 'Create Job Profile'}
          </h1>
          <p className="text-sm text-zinc-500">Step {currentStep} of {STEPS.length}</p>
        </div>
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-xl hover:bg-zinc-100 dark:hover:bg-white/5"
            title="Cancel and close"
          >
            <X size={20} />
          </Button>
        )}
      </div>

      {/* progress indicator */}
      <div className="mb-12 px-6">
        <div className="relative flex justify-between">
          <div className="absolute top-[1.35rem] left-0 h-[3px] w-full bg-zinc-100 dark:bg-white/5 rounded-full" />
          <motion.div
            className="absolute top-[1.35rem] left-0 h-[3px] bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.3)]"
            initial={{ width: '0%' }}
            animate={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
            transition={{ type: 'spring', stiffness: 40, damping: 15 }}
          />

          {STEPS.map((step) => {
            const isActive = currentStep === step.id
            const isCompleted = currentStep > step.id

            return (
              <div key={step.id} className="relative z-10 flex flex-col items-center">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={() => isCompleted && setCurrentStep(step.id)}
                  className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-2xl border-2 transition-all duration-500",
                    isActive ? "border-blue-600 bg-white text-blue-600 shadow-[0_8px_20px_rgba(37,99,235,0.2)] dark:bg-zinc-900 ring-4 ring-blue-50 dark:ring-blue-900/10" :
                      isCompleted ? "border-blue-600 bg-blue-600 text-white shadow-lg" :
                        "border-zinc-200 bg-white text-zinc-400 dark:border-white/10 dark:bg-zinc-900"
                  )}
                >
                  {isCompleted ? <CheckCircle2 size={22} className="animate-in zoom-in-50 duration-300" /> : <span className="text-sm font-bold">{step.id}</span>}
                </motion.button>
                <div className="mt-4 text-center hidden sm:block">
                  <p className={cn(
                    "text-[10px] font-black uppercase tracking-[0.15em]",
                    isActive ? "text-blue-600" : "text-zinc-400"
                  )}>
                    {step.title}
                  </p>
                  <p className="text-[10px] text-zinc-400 mt-1 font-medium">{step.description.split(' ')[0]}...</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[2.5rem] border border-zinc-200 bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.05)] shadow-zinc-200/50 dark:border-white/5 dark:bg-zinc-900/50 dark:shadow-none backdrop-blur-md sm:p-12">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -ml-32 -mb-32" />
        
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="relative space-y-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.02, y: -10 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                {currentStep === 1 && <Step1Personal />}
                {currentStep === 2 && <Step2JobEducation />}
                {currentStep === 3 && <Step3Experience />}
                {currentStep === 4 && <Step4Documents isUpdateMode={isUpdateMode} />}
              </motion.div>
            </AnimatePresence>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-10 border-t border-zinc-100 dark:border-white/5">
              <div className="flex gap-4 w-full sm:w-auto">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prev}
                  disabled={currentStep === 1 || isSubmitting}
                  className="flex-1 sm:flex-none rounded-2xl h-14 px-8 font-bold border-zinc-200 hover:bg-zinc-50 dark:border-white/10 dark:hover:bg-white/5 transition-all active:scale-95"
                >
                  <ChevronLeft size={20} className="mr-2" /> Back
                </Button>
                {onClose && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="flex-1 sm:flex-none rounded-2xl h-14 px-6 text-zinc-400 font-bold hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all active:scale-95"
                  >
                    Cancel
                  </Button>
                )}
              </div>

              {currentStep < 4 ? (
                <Button
                  type="button"
                  onClick={next}
                  className="w-full sm:w-auto rounded-2xl bg-zinc-900 h-14 px-12 text-base font-bold text-white shadow-xl shadow-zinc-200 transition-all hover:bg-zinc-800 hover:-translate-y-1 hover:shadow-2xl dark:bg-white dark:text-zinc-900 dark:shadow-none dark:hover:bg-zinc-200 active:scale-95"
                >
                  Next Step <ChevronRight size={20} className="ml-2" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 h-14 px-14 text-base font-bold text-white shadow-xl shadow-emerald-200/50 transition-all hover:-translate-y-1 hover:shadow-2xl dark:shadow-none active:scale-95"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-3">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <span>{!isUpdateMode && methods.watch('transactionType') === 'ONLY_PROFILE' ? 'Pay & Complete' : (isUpdateMode ? 'Update Profile' : 'Complete Setup')}</span>
                      <CheckCircle2 size={20} />
                    </div>
                  )}
                </Button>
              )}
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  )
}
