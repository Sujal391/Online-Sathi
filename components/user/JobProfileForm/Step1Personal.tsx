'use client'

import * as React from 'react'
import { useFormContext } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { locationService, type Country, type State, type District } from '@/services/location.service'
import { JobProfileFormValues } from '@/lib/validations/jobProfile'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { cn } from '@/lib/utils'

const LANGUAGES = [
  'English', 'Hindi', 'Gujarati', 'Marathi', 'Punjabi', 'Kannada', 'Tamil', 'Telugu', 'Bengali'
]

export function Step1Personal() {
  const { register, watch, setValue, formState: { errors } } = useFormContext<JobProfileFormValues>()

  const [countries, setCountries] = React.useState<Country[]>([])
  const [states, setStates] = React.useState<State[]>([])
  const [districts, setDistricts] = React.useState<District[]>([])

  const [pStates, setPStates] = React.useState<State[]>([])
  const [pDistricts, setPDistricts] = React.useState<District[]>([])

  const currentCountry = watch('currentCountry')
  const currentState = watch('currentState')
  const permanentCountry = watch('permanentCountry')
  const permanentState = watch('permanentState')
  const languagesSelected = watch('languages') || []

  // Helper to safely handle API responses from location endpoints
  const ensureArray = (res: any, key: 'countries' | 'states' | 'districts') => {
    if (res && res.success && Array.isArray(res[key])) {
      return res[key];
    }
    return [];
  };

  // fetch countries on mount
  React.useEffect(() => {
    locationService.getCountries()
      .then(res => setCountries(ensureArray(res as any, 'countries')))
      .catch(console.error)
  }, [])

  // handle current address cascading
  React.useEffect(() => {
    if (currentCountry) {
      locationService.getStates(currentCountry)
        .then(res => setStates(ensureArray(res as any, 'states')))
        .catch(console.error)
    }
  }, [currentCountry])

  React.useEffect(() => {
    if (currentState) {
      locationService.getDistricts(currentState)
        .then(res => setDistricts(ensureArray(res as any, 'districts')))
        .catch(console.error)
    }
  }, [currentState])

  // handle permanent address cascading
  React.useEffect(() => {
    if (permanentCountry) {
      locationService.getStates(permanentCountry)
        .then(res => setPStates(ensureArray(res as any, 'states')))
        .catch(console.error)
    }
  }, [permanentCountry])

  React.useEffect(() => {
    if (permanentState) {
      locationService.getDistricts(permanentState)
        .then(res => setPDistricts(ensureArray(res as any, 'districts')))
        .catch(console.error)
    }
  }, [permanentState])

  const syncAddress = (checked: boolean) => {
    if (checked) {
      setValue('permanentCountry', watch('currentCountry'), { shouldDirty: true, shouldValidate: true })
      setValue('permanentState', watch('currentState'), { shouldDirty: true, shouldValidate: true })
      setValue('permanentDistrict', watch('currentDistrict'), { shouldDirty: true, shouldValidate: true })
      setValue('permanentAddress', watch('currentAddress'), { shouldDirty: true, shouldValidate: true })
      setValue('permanentPincode', watch('currentPincode'), { shouldDirty: true, shouldValidate: true })
    }
  }

  const handleLanguageToggle = (lang: string, checked: boolean) => {
    const current = [...languagesSelected]
    if (checked) {
      if (!current.includes(lang)) setValue('languages', [...current, lang], { shouldDirty: true, shouldValidate: true })
    } else {
      setValue('languages', current.filter(l => l !== lang), { shouldDirty: true, shouldValidate: true })
    }
  }

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">Personal Details</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Please provide your basic information</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Full Name</Label>
          <Input {...register('fullName')} disabled placeholder="e.g. John Doe" aria-invalid={!!errors.fullName} className="bg-zinc-50 dark:bg-zinc-900/50 cursor-not-allowed opacity-70" />
          {errors.fullName && <p className="text-xs text-red-500">{errors.fullName.message}</p>}
        </div>
        <div className="space-y-2">
          <Label>Phone Number</Label>
          <Input {...register('phoneNumber')} disabled placeholder="e.g. 9841234567" aria-invalid={!!errors.phoneNumber} className="bg-zinc-50 dark:bg-zinc-900/50 cursor-not-allowed opacity-70" />
          {errors.phoneNumber && <p className="text-xs text-red-500">{errors.phoneNumber.message}</p>}
        </div>
        <div className="space-y-2">
          <Label>Email</Label>
          <Input {...register('email')} placeholder="e.g. john@example.com" aria-invalid={!!errors.email} className="bg-zinc-50 dark:bg-zinc-900/50 cursor-not-allowed opacity-70" />
          {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
        </div>
        <div className="space-y-2">
          <Label>Date of Birth</Label>
          <Input type="date" {...register('dateOfBirth')} disabled aria-invalid={!!errors.dateOfBirth} className="bg-zinc-50 dark:bg-zinc-900/50 cursor-not-allowed opacity-70" />
          {errors.dateOfBirth && <p className="text-xs text-red-500">{errors.dateOfBirth.message}</p>}
        </div>
        <div className="space-y-2">
          <Label>Gender</Label>
          <div className="opacity-70 pointer-events-none">
            <Select disabled onValueChange={(v) => setValue('gender', v as any, { shouldDirty: true, shouldValidate: true })} value={watch('gender')}>
              <SelectTrigger className="bg-zinc-50 dark:bg-zinc-900/50"><SelectValue placeholder="Select Gender" /></SelectTrigger>
              <SelectContent>
                {['Male', 'Female', 'Other'].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          {errors.gender && <p className="text-xs text-red-500">{errors.gender.message}</p>}
        </div>
        <div className="space-y-2">
          <Label>Marital Status</Label>
          <Select onValueChange={(v) => setValue('maritalStatus', v as any, { shouldDirty: true, shouldValidate: true })} value={watch('maritalStatus')}>
            <SelectTrigger><SelectValue placeholder="Select Status" /></SelectTrigger>
            <SelectContent>
              {['Married', 'Unmarried', 'Divorced'].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
            </SelectContent>
          </Select>
          {errors.maritalStatus && <p className="text-xs text-red-500">{errors.maritalStatus.message}</p>}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-white/5 pb-2">
          <Label className="text-base font-semibold">Languages Known</Label>
          <span className="text-xs text-zinc-400 font-normal">(Select at least one)</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {LANGUAGES.map(lang => (
            <div key={lang} className="flex items-center space-x-2">
              <Checkbox
                id={`lang-${lang}`}
                checked={languagesSelected.includes(lang)}
                onCheckedChange={(checked) => handleLanguageToggle(lang, checked as boolean)}
              />
              <Label htmlFor={`lang-${lang}`} className="text-sm cursor-pointer">{lang}</Label>
            </div>
          ))}
        </div>
        {errors.languages && <p className="text-xs text-red-500">{errors.languages.message}</p>}
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-white/5 pb-2">
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Current Address</h3>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="space-y-2">
            <Label>Country</Label>
            <Select onValueChange={(v) => setValue('currentCountry', v, { shouldDirty: true, shouldValidate: true })} value={watch('currentCountry')}>
              <SelectTrigger><SelectValue placeholder="Select Country" /></SelectTrigger>
              <SelectContent>
                {Array.isArray(countries) && countries.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
            {errors.currentCountry && <p className="text-xs text-red-500">{errors.currentCountry.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>State</Label>
            <Select onValueChange={(v) => setValue('currentState', v, { shouldDirty: true, shouldValidate: true })} value={watch('currentState')}>
              <SelectTrigger><SelectValue placeholder="Select State" /></SelectTrigger>
              <SelectContent>
                {Array.isArray(states) && states.map(s => <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>)}
              </SelectContent>
            </Select>
            {errors.currentState && <p className="text-xs text-red-500">{errors.currentState.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>District</Label>
            <Select onValueChange={(v) => setValue('currentDistrict', v, { shouldDirty: true, shouldValidate: true })} value={watch('currentDistrict')}>
              <SelectTrigger><SelectValue placeholder="Select District" /></SelectTrigger>
              <SelectContent>
                {Array.isArray(districts) && districts.map(d => <SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>)}
              </SelectContent>
            </Select>
            {errors.currentDistrict && <p className="text-xs text-red-500">{errors.currentDistrict.message}</p>}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          <div className="md:col-span-3 space-y-2">
            <Label>Detailed Address</Label>
            <Input {...register('currentAddress')} placeholder="Street, House No, Area..." />
            {errors.currentAddress && <p className="text-xs text-red-500">{errors.currentAddress.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Pincode</Label>
            <Input {...register('currentPincode')} placeholder="000000" />
            {errors.currentPincode && <p className="text-xs text-red-500">{errors.currentPincode.message}</p>}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-white/5 pb-2">
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Permanent Address</h3>
          <div className="flex items-center gap-2">
            <Checkbox id="sync" onCheckedChange={(c) => syncAddress(c as boolean)} />
            <Label htmlFor="sync" className="text-xs text-zinc-500">Same as current address</Label>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="space-y-2">
            <Label>Country</Label>
            <Select onValueChange={(v) => setValue('permanentCountry', v, { shouldDirty: true, shouldValidate: true })} value={watch('permanentCountry')}>
              <SelectTrigger><SelectValue placeholder="Select Country" /></SelectTrigger>
              <SelectContent>
                {Array.isArray(countries) && countries.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
            {errors.permanentCountry && <p className="text-xs text-red-500">{errors.permanentCountry.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>State</Label>
            <Select onValueChange={(v) => setValue('permanentState', v, { shouldDirty: true, shouldValidate: true })} value={watch('permanentState')}>
              <SelectTrigger><SelectValue placeholder="Select State" /></SelectTrigger>
              <SelectContent>
                {Array.isArray(pStates) && pStates.map(s => <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>)}
              </SelectContent>
            </Select>
            {errors.permanentState && <p className="text-xs text-red-500">{errors.permanentState.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>District</Label>
            <Select onValueChange={(v) => setValue('permanentDistrict', v, { shouldDirty: true, shouldValidate: true })} value={watch('permanentDistrict')}>
              <SelectTrigger><SelectValue placeholder="Select District" /></SelectTrigger>
              <SelectContent>
                {Array.isArray(pDistricts) && pDistricts.map(d => <SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>)}
              </SelectContent>
            </Select>
            {errors.permanentDistrict && <p className="text-xs text-red-500">{errors.permanentDistrict.message}</p>}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          <div className="md:col-span-3 space-y-2">
            <Label>Detailed Address</Label>
            <Input {...register('permanentAddress')} placeholder="Street, House No, Area..." />
            {errors.permanentAddress && <p className="text-xs text-red-500">{errors.permanentAddress.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Pincode</Label>
            <Input {...register('permanentPincode')} placeholder="000000" />
            {errors.permanentPincode && <p className="text-xs text-red-500">{errors.permanentPincode.message}</p>}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-base font-semibold">Job Type Preference</Label>
        <RadioGroup
          value={watch('jobType')}
          onValueChange={(v) => setValue('jobType', v as any, { shouldDirty: true, shouldValidate: true })}
          className="grid grid-cols-1 gap-4 sm:grid-cols-3"
        >
          {['Full Time', 'Part time', 'Daily wages'].map((type) => (
            <div key={type} className="relative">
              <RadioGroupItem value={type} id={type} className="peer sr-only" />
              <Label
                htmlFor={type}
                className={cn(
                  "flex cursor-pointer flex-col items-center justify-between rounded-xl border-2 border-zinc-100 bg-white p-4 text-center transition-all peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:bg-blue-50/50 dark:border-white/5 dark:bg-white/5 dark:peer-data-[state=checked]:bg-blue-600/10",
                  watch('jobType') === type && "border-blue-600 ring-2 ring-blue-600 ring-offset-2 dark:ring-offset-zinc-950"
                )}
              >
                <span className="text-sm font-semibold">{type}</span>
              </Label>
            </div>
          ))}
        </RadioGroup>
        {errors.jobType && <p className="text-xs text-red-500">{errors.jobType.message}</p>}
      </div>
    </div>
  )
}
