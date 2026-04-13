'use client'

import * as React from 'react'
import { Upload, FileText, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface FilePickerProps {
  label: string
  value?: string
  onChange: (value: string) => void
  error?: string
}

export function FilePicker({ label, value, onChange, error }: FilePickerProps) {
  const [fileName, setFileName] = React.useState<string | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFileName(file.name)
      // Simulate upload and return a dummy URL
      const dummyUrl = `https://storage.online-sathi.com/uploads/${file.name.replace(/\s+/g, '_')}`
      onChange(dummyUrl)
    }
  }

  const clear = () => {
    setFileName(null)
    onChange('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}
      </label>
      
      <div
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-200 bg-zinc-50/50 p-6 transition-all hover:bg-zinc-100 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10",
          error && "border-red-500 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20",
          value && "border-emerald-500/50 bg-emerald-50/50 dark:border-emerald-500/20 dark:bg-emerald-500/5"
        )}
      >
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*,.pdf"
        />
        
        {value ? (
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
              <FileText size={24} />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">File Selected</p>
              <p className="max-w-[180px] truncate text-xs text-zinc-500 dark:text-zinc-400">
                {fileName || 'document.jpg'}
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                clear()
              }}
              className="mt-1 h-7 text-xs text-zinc-500 hover:text-red-600"
            >
              <X size={12} className="mr-1" /> Remove
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-zinc-500 dark:text-zinc-400">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-white/5">
              <Upload size={24} />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">Click to upload {label}</p>
              <p className="text-xs">PNG, JPG or PDF up to 5MB</p>
            </div>
          </div>
        )}
      </div>
      
      {error && <p className="text-xs font-medium text-red-500">{error}</p>}
    </div>
  )
}
