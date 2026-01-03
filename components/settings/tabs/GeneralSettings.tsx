'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
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
import { Label } from '@/components/ui/label'
import { IconUser, IconSun, IconMoon, IconDeviceDesktop, IconClock } from '@tabler/icons-react'
import type { Settings } from '@/lib/storage/settings'

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

  const handleThemeChange = (value: string | null) => {
    if (!value) return
    const newTheme = value as 'light' | 'dark' | 'system'
    setTheme(newTheme)
    setNextTheme(newTheme)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
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

  const themeOptions = [
    { value: 'light', label: 'Light', icon: IconSun },
    { value: 'dark', label: 'Dark', icon: IconMoon },
    { value: 'system', label: 'System', icon: IconDeviceDesktop },
  ]

  return (
    <div className="space-y-5">
      {/* Hidden focusable element to prevent auto-focus on name input */}
      <span tabIndex={0} className="sr-only" aria-hidden="true" />

      {/* Name Field */}
      <div className="space-y-2">
        <Label htmlFor="name" className="flex items-center gap-2 text-sm font-medium">
          <IconUser className="size-4 text-muted-foreground" />
          Your Name
        </Label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          tabIndex={-1}
          onFocus={(e) => e.target.tabIndex = 0}
          className="h-9"
        />
        <p className="text-xs text-muted-foreground">
          Shown on exported reports
        </p>
      </div>

      {/* Theme Selection */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <IconSun className="size-4 text-muted-foreground" />
          Theme
        </Label>
        <div className="grid grid-cols-3 gap-2">
          {themeOptions.map((option) => {
            const Icon = option.icon
            const isActive = theme === option.value
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleThemeChange(option.value)}
                className={`
                  flex flex-col items-center gap-1.5 rounded-lg border p-3 text-xs transition-all
                  ${isActive
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border hover:border-muted-foreground/50 hover:bg-muted/50 text-muted-foreground'
                  }
                `}
                aria-pressed={isActive}
              >
                <Icon className="size-4" />
                <span>{option.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Day Start Time */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <IconClock className="size-4 text-muted-foreground" />
          Day Starts At
        </Label>
        <Select
          value={String(dayStartHour)}
          onValueChange={(value) => setDayStartHour(Number(value))}
        >
          <SelectTrigger className="h-9">
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
        <p className="text-xs text-muted-foreground">
          When your workday logging begins
        </p>
      </div>

      {/* Save Button */}
      <Button onClick={handleSave} disabled={isSaving} className="w-full">
        {isSaving ? 'Saving...' : 'Save Changes'}
      </Button>
    </div>
  )
}
