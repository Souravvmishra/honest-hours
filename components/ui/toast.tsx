'use client'

import { useEffect, useState } from 'react'
import { IconCheck, IconX, IconAlertCircle, IconInfoCircle } from '@tabler/icons-react'
import { Button } from './button'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface Toast {
    id: string
    message: string
    type: ToastType
    duration?: number
}

interface ToastProps {
    toast: Toast
    onClose: (id: string) => void
}

function ToastComponent({ toast, onClose }: ToastProps) {
    useEffect(() => {
        if (toast.duration !== 0) {
            const timer = setTimeout(() => {
                onClose(toast.id)
            }, toast.duration || 5000)

            return () => clearTimeout(timer)
        }
    }, [toast.id, toast.duration, onClose])

    const icons = {
        success: IconCheck,
        error: IconAlertCircle,
        info: IconInfoCircle,
        warning: IconAlertCircle,
    }

    const iconColors = {
        success: 'text-muted-foreground',
        error: 'text-destructive',
        info: 'text-muted-foreground',
        warning: 'text-muted-foreground',
    }

    const Icon = icons[toast.type]

    return (
        <div
            className="flex items-center gap-2 rounded-md bg-background border border-border/30 px-3 py-2 text-sm text-foreground"
            role="alert"
            aria-live="polite"
        >
            <Icon className={`size-3.5 shrink-0 ${iconColors[toast.type]}`} />
            <p className="flex-1 text-sm text-muted-foreground">{toast.message}</p>
            <button
                onClick={() => onClose(toast.id)}
                aria-label="Close notification"
                className="shrink-0 opacity-40 hover:opacity-100 transition-opacity p-0.5 -mr-1"
            >
                <IconX className="size-3" />
            </button>
        </div>
    )
}

export function ToastContainer() {
    const [toasts, setToasts] = useState<Toast[]>([])

    useEffect(() => {
        const handleToast = (event: CustomEvent<Toast>) => {
            setToasts((prev) => [...prev, event.detail])
        }

        window.addEventListener('show-toast', handleToast as EventListener)

        return () => {
            window.removeEventListener('show-toast', handleToast as EventListener)
        }
    }, [])

    const handleClose = (id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }

    if (toasts.length === 0) return null

    return (
        <div
            className="fixed bottom-4 right-4 z-50 flex flex-col gap-1.5"
            role="region"
            aria-label="Notifications"
        >
            {toasts.map((toast) => (
                <ToastComponent key={toast.id} toast={toast} onClose={handleClose} />
            ))}
        </div>
    )
}

export function showToast(message: string, type: ToastType = 'info', duration?: number) {
    const toast: Toast = {
        id: `${Date.now()}-${Math.random()}`,
        message,
        type,
        duration,
    }

    window.dispatchEvent(new CustomEvent('show-toast', { detail: toast }))
}
