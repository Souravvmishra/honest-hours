'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
    DropdownMenuPortal,
} from '@/components/ui/dropdown-menu'
import { IconDownload, IconFileTypePdf, IconFileTypeCsv, IconCode } from '@tabler/icons-react'
import { getTodayEntries, getWeekEntries } from '@/lib/storage/entries'
import { exportToday, exportWeek } from '@/lib/utils/export'
import { getWeekDateRange, getDateString } from '@/lib/utils/time'
import { showToast } from '@/components/ui/toast'

export function ExportButton() {
    const [isExporting, setIsExporting] = useState(false)

    async function handleExportToday(format: 'csv' | 'json' | 'pdf') {
        setIsExporting(true)
        try {
            const today = getDateString()
            const entries = await getTodayEntries(today)
            await exportToday(entries, format)
            showToast(`Today's log exported as ${format.toUpperCase()}`, 'success')
        } catch (error) {
            console.error('Failed to export today:', error)
            showToast('Failed to export data. Please try again.', 'error')
        } finally {
            setIsExporting(false)
        }
    }

    async function handleExportWeek(format: 'csv' | 'json' | 'pdf') {
        setIsExporting(true)
        try {
            const { start, end } = getWeekDateRange()
            const entries = await getWeekEntries(start, end)
            await exportWeek(entries, format)
            showToast(`Week's log exported as ${format.toUpperCase()}`, 'success')
        } catch (error) {
            console.error('Failed to export week:', error)
            showToast('Failed to export data. Please try again.', 'error')
        } finally {
            setIsExporting(false)
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                render={
                    <Button variant="outline" size="sm" disabled={isExporting}>
                        <IconDownload className="size-4" />
                        <span>Export</span>
                    </Button>
                }
            />
            <DropdownMenuContent align="end">
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                        Today
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                            <DropdownMenuItem onClick={() => handleExportToday('pdf')}>
                                <IconFileTypePdf className="size-4" />
                                PDF
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleExportToday('csv')}>
                                <IconFileTypeCsv className="size-4" />
                                CSV
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleExportToday('json')}>
                                <IconCode className="size-4" />
                                JSON
                            </DropdownMenuItem>
                        </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                        This Week
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                            <DropdownMenuItem onClick={() => handleExportWeek('pdf')}>
                                <IconFileTypePdf className="size-4" />
                                PDF
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleExportWeek('csv')}>
                                <IconFileTypeCsv className="size-4" />
                                CSV
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleExportWeek('json')}>
                                <IconCode className="size-4" />
                                JSON
                            </DropdownMenuItem>
                        </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                </DropdownMenuSub>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
