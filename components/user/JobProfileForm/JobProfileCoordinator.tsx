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
import { jobProfileService } from '@/services/jobProfile.service'
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
    jobType: existingProfile?.jobType || '',
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
      <div className="mb-10 px-4">
        <div className="relative flex justify-between">
          <div className="absolute top-5 left-0 h-0.5 w-full bg-zinc-100 dark:bg-white/5" />
          <motion.div
            className="absolute top-5 left-0 h-0.5 bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.4)]"
            initial={{ width: '0%' }}
            animate={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
            transition={{ type: 'spring', stiffness: 50, damping: 20 }}
          />

          {STEPS.map((step) => {
            const isActive = currentStep === step.id
            const isCompleted = currentStep > step.id

            return (
              <div key={step.id} className="relative z-10 flex flex-col items-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => isCompleted && setCurrentStep(step.id)}
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300",
                    isActive ? "border-blue-600 bg-white text-blue-600 shadow-lg dark:bg-zinc-900" :
                      isCompleted ? "border-blue-600 bg-blue-600 text-white" :
                        "border-zinc-200 bg-white text-zinc-400 dark:border-white/10 dark:bg-zinc-900"
                  )}
                >
                  {isCompleted ? <CheckCircle2 size={20} /> : <span>{step.id}</span>}
                </motion.button>
                <div className="mt-3 text-center hidden sm:block">
                  <p className={cn("text-xs font-semibold uppercase tracking-wider", isActive ? "text-blue-600" : "text-zinc-400")}>
                    {step.title}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-xl shadow-zinc-200/50 dark:border-white/5 dark:bg-zinc-900/50 dark:shadow-none backdrop-blur-sm sm:p-10">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {currentStep === 1 && <Step1Personal />}
                {currentStep === 2 && <Step2JobEducation />}
                {currentStep === 3 && <Step3Experience />}
                {currentStep === 4 && <Step4Documents isUpdateMode={isUpdateMode} />}
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-between pt-6 border-t border-zinc-100 dark:border-white/5">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={prev}
                  disabled={currentStep === 1 || isSubmitting}
                  className="rounded-xl px-6"
                >
                  <ChevronLeft size={18} className="mr-2" /> Back
                </Button>
                {onClose && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="rounded-xl text-zinc-400 hover:text-red-500 hidden sm:flex"
                  >
                    Cancel
                  </Button>
                )}
              </div>

              {currentStep < 4 ? (
                <Button
                  type="button"
                  onClick={next}
                  className="rounded-xl bg-blue-600 px-8 py-6 text-base font-semibold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 dark:shadow-none transition-all hover:scale-105 active:scale-95"
                >
                  Continue <ChevronRight size={18} className="ml-2" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-emerald-600 px-10 py-6 text-base font-semibold text-white shadow-lg shadow-emerald-200 hover:bg-emerald-700 dark:shadow-none transition-all hover:scale-105 active:scale-95"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      {!isUpdateMode && methods.watch('transactionType') === 'ONLY_PROFILE'
                        ? 'Processing Payment...'
                        : (isUpdateMode ? 'Updating Profile...' : 'Creating Profile...')}
                    </>
                  ) : (
                    <>
                      {!isUpdateMode && methods.watch('transactionType') === 'ONLY_PROFILE'
                        ? 'Pay & Finish'
                        : (isUpdateMode ? 'Save Changes' : 'Complete Registration')} <CheckCircle2 size={18} className="ml-2" />
                    </>
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
