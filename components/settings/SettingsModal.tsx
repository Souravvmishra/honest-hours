'use client'

import { useState, useEffect, useRef } from 'react'
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
import { Logo } from '@/components/Logo'
import { showToast } from '@/components/ui/toast'

export function SettingsModal() {
    const [isOpen, setIsOpen] = useState(false)
    const { settings, update } = useSettings()
    const longPressTimerRef = useRef<NodeJS.Timeout | null>(null)

    // Long-press on title to open settings
    useEffect(() => {
        function handleMouseDown(e: MouseEvent) {
            const target = e.target as HTMLElement
            // Check if clicking on the h1 title
            if (target.tagName === 'H1' || target.closest('h1')) {
                longPressTimerRef.current = setTimeout(() => {
                    setIsOpen(true)
                }, 3000) // 3 seconds
            }
        }

        function handleMouseUp() {
            if (longPressTimerRef.current) {
                clearTimeout(longPressTimerRef.current)
                longPressTimerRef.current = null
            }
        }

        function handleTouchStart(e: TouchEvent) {
            const target = e.target as HTMLElement
            if (target.tagName === 'H1' || target.closest('h1')) {
                longPressTimerRef.current = setTimeout(() => {
                    setIsOpen(true)
                }, 3000)
            }
        }

        function handleTouchEnd() {
            if (longPressTimerRef.current) {
                clearTimeout(longPressTimerRef.current)
                longPressTimerRef.current = null
            }
        }

        // Listen for long-press on document (delegated event)
        document.addEventListener('mousedown', handleMouseDown)
        document.addEventListener('mouseup', handleMouseUp)
        document.addEventListener('mouseleave', handleMouseUp)
        document.addEventListener('touchstart', handleTouchStart)
        document.addEventListener('touchend', handleTouchEnd)
        document.addEventListener('touchcancel', handleTouchEnd)

        return () => {
            document.removeEventListener('mousedown', handleMouseDown)
            document.removeEventListener('mouseup', handleMouseUp)
            document.removeEventListener('mouseleave', handleMouseUp)
            document.removeEventListener('touchstart', handleTouchStart)
            document.removeEventListener('touchend', handleTouchEnd)
            document.removeEventListener('touchcancel', handleTouchEnd)
        }
    }, [])

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
                title="Settings (or long-press the date title)"
            >
                <IconSettings className="size-3.5" />
            </Button>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <div className="mb-3 flex justify-center">
                            <Logo width={100} height={33} className="opacity-90" />
                        </div>
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
