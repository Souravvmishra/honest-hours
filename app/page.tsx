'use client'

import { useHourlyPrompt } from '@/lib/hooks/useHourlyPrompt'
import { useTheme } from '@/lib/hooks/useTheme'
import { HourlyPromptModal } from '@/components/hourly-prompt/HourlyPromptModal'
import { DailyLogView } from '@/components/daily-log/DailyLogView'
import { SettingsModal } from '@/components/settings/SettingsModal'
import { ExportButton } from '@/components/export/ExportButton'
import { NotificationPermissionAlert } from '@/components/notifications/NotificationPermissionAlert'
import { Logo } from '@/components/Logo'
import { ErrorBoundary } from '@/components/error-boundary/ErrorBoundary'
import { ToastContainer } from '@/components/ui/toast'
import { ServiceWorkerUpdater } from '@/components/service-worker/ServiceWorkerUpdater'

export default function Page() {
    useTheme()
    const { isDue, hourSlot, timeRange, isActive, markPromptComplete } =
        useHourlyPrompt()

    return (
        <ErrorBoundary>
            <ServiceWorkerUpdater />
            <ToastContainer />
            {isDue && isActive && hourSlot && timeRange ? (
                <HourlyPromptModal
                    hourSlot={hourSlot}
                    timeRange={timeRange}
                    onComplete={markPromptComplete}
                />
            ) : (
                <>
                    <div className="fixed top-4 left-4 z-30">
                        <Logo width={40} height={40} priority />
                    </div>
                    <div className="fixed top-4 right-4 z-30 flex items-center gap-2">
                        <NotificationPermissionAlert />
                        <ExportButton />
                    </div>
                    <DailyLogView />
                    <SettingsModal />
                </>
            )}
        </ErrorBoundary>
    )
}
