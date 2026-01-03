'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { IconExternalLink } from '@tabler/icons-react'
import type { Settings } from '@/lib/storage/settings'
import { SITE_URL, GITHUB_URL } from '@/lib/constants/app'

interface GeneralSettingsProps {
  settings: Settings
  onSave: (updates: Partial<Settings>) => Promise<void>
}

export function GeneralSettings({ settings, onSave }: GeneralSettingsProps) {
  const { setTheme: setNextTheme } = useTheme()
  const [dayStartHour, setDayStartHour] = useState(settings.dayStartHour)
  const [theme, setTheme] = useState(settings.theme)
  const [name, setName] = useState(settings.name || '')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    setDayStartHour(settings.dayStartHour)
    setTheme(settings.theme)
    setName(settings.name || '')
  }, [settings])

  // Update theme immediately when changed (no need to wait for save)
  function handleThemeChange(value: string | null) {
    if (!value) return
    const newTheme = value as 'light' | 'dark' | 'system'
    setTheme(newTheme)
    setNextTheme(newTheme) // Instant update via next-themes
  }

  async function handleSave() {
    setIsSaving(true)
    try {
      // Save to IndexedDB (next-themes already updated theme instantly)
      await onSave({
        dayStartHour,
        theme,
        name: name.trim() || undefined,
      })
    } finally {
      setIsSaving(false)
    }
  }

  const hourOptions = Array.from({ length: 24 }, (_, i) => ({
    value: String(i),
    label: i === 0 ? '12 AM' : i < 12 ? `${i} AM` : i === 12 ? '12 PM' : `${i - 12} PM`,
  }))

  return (
    <div className="space-y-6">
      {/* Hidden focusable element to prevent auto-focus on name input */}
      <span tabIndex={0} className="sr-only" aria-hidden="true" />
      <FieldGroup>
        <Field>
          <FieldLabel>Name</FieldLabel>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            tabIndex={-1}
            onFocus={(e) => e.target.tabIndex = 0}
          />
        </Field>

        <Field>
          <FieldLabel>Day Start Time</FieldLabel>
          <div onClick={(e) => e.stopPropagation()}>
            <Select
              value={String(dayStartHour)}
              onValueChange={(value) => setDayStartHour(Number(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {hourOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </Field>

        <Field>
          <FieldLabel>Theme</FieldLabel>
          <div onClick={(e) => e.stopPropagation()}>
            <Select
              value={theme}
              onValueChange={handleThemeChange}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </Field>
      </FieldGroup>

      <Button onClick={handleSave} disabled={isSaving} className="w-full">
        {isSaving ? 'Saving...' : 'Save'}
      </Button>

      <Separator />

      <div className="space-y-2">
        <div className="flex flex-col gap-2 text-sm">
          <a
            href={SITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <IconExternalLink className="size-4" />
            Visit Live Site
          </a>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <IconExternalLink className="size-4" />
            View on GitHub
          </a>
        </div>
      </div>
    </div>
  )
}

