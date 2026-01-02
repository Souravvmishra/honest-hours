'use client'

import { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { SettingsForm } from './SettingsForm'
import { useSettings } from '@/lib/hooks/useSettings'
import { IconSettings } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { showToast } from '@/components/ui/toast'

export function SettingsModal() {
    const [isOpen, setIsOpen] = useState(false)
    const { settings, update } = useSettings()

    async function handleSave(updates: Parameters<typeof update>[0]) {
        try {
            await update(updates)
            showToast('Settings saved successfully', 'success')
            setIsOpen(false)
        } catch (error) {
            console.error('Failed to save settings:', error)
            showToast('Failed to save settings. Please try again.', 'error')
        }
    }


    if (!settings) {
        return null
    }

    return (
        <>
            {/* Tiny gear icon in bottom corner */}
            <Button
                variant="ghost"
                size="icon-xs"
                className="fixed bottom-4 right-4 z-40 opacity-40 hover:opacity-100 transition-opacity"
                onClick={() => setIsOpen(true)}
                aria-label="Settings"
                title="Settings"
            >
                <IconSettings className="size-3.5" />
            </Button>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Settings</DialogTitle>
                    </DialogHeader>
                    <SettingsForm
                        settings={settings}
                        onSave={handleSave}
                    />
                </DialogContent>
            </Dialog>
        </>
    )
}
