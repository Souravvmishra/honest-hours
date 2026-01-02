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
import type { Settings } from '@/lib/storage/settings'

interface SettingsFormProps {
    settings: Settings
    onSave: (updates: Partial<Settings>) => Promise<void>
}

export function SettingsForm({ settings, onSave }: SettingsFormProps) {
    const { setTheme: setNextTheme } = useTheme()
    const [dayStartHour, setDayStartHour] = useState(settings.dayStartHour)
    const [theme, setTheme] = useState(settings.theme)
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        setDayStartHour(settings.dayStartHour)
        setTheme(settings.theme)
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
            <FieldGroup>
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

            <div className="flex gap-2">
                <Button onClick={handleSave} disabled={isSaving} className="w-full">
                    {isSaving ? 'Saving...' : 'Save'}
                </Button>
            </div>
        </div>
    )
}
