'use client'

import * as React from 'react'
import { X, Plus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface TagInputProps {
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  className?: string
}

export function TagInput({ value, onChange, placeholder, className }: TagInputProps) {
  const [pending, setPending] = React.useState('')

  const handleAdd = () => {
    const trimmed = pending.trim()
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed])
      setPending('')
    }
  }

  const handleRemove = (tag: string) => {
    onChange(value.filter((t) => t !== tag))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAdd()
    }
  }

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex flex-wrap gap-2">
        {value.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="flex items-center gap-1.5 bg-zinc-100 dark:bg-white/5 py-1.5 pl-3 pr-2 text-sm font-medium transition-all hover:bg-zinc-200 dark:hover:bg-white/10"
          >
            {tag}
            <button
              type="button"
              onClick={() => handleRemove(tag)}
              className="rounded-full p-0.5 hover:bg-zinc-300 dark:hover:bg-white/20"
            >
              <X size={12} />
            </button>
          </Badge>
        ))}
        {value.length === 0 && (
          <span className="text-sm text-zinc-400 dark:text-zinc-500 italic">No tags added yet...</span>
        )}
      </div>
      <div className="flex gap-2">
        <Input
          value={pending}
          onChange={(e) => setPending(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || 'Type and press enter...'}
          className="flex-1"
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleAdd}
          className="shrink-0"
        >
          <Plus size={16} />
        </Button>
      </div>
    </div>
  )
}
