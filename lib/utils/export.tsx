import { type HourEntry } from '@/lib/storage/entries'
import { formatHourSlot, formatDate, getDateString } from './time'
import { downloadPDF, generateSafeFilename } from '@/lib/pdf/utils'

// Lazy load PDF library (saves ~500KB on initial load)
const loadPDFLibrary = async () => {
  const [{ pdf }, { HourlyLogPDF }] = await Promise.all([
    import('@react-pdf/renderer'),
    import('@/components/export/HourlyLogPDF'),
  ])
  return { pdf, HourlyLogPDF }
}

export function exportToCSV(entries: HourEntry[]): string {
  const headers = ['Date', 'Time Slot', 'Text', 'Tag', 'Timestamp']
  const rows = entries.map((entry) => {
    const date = entry.date
    const timeRange = formatHourSlot(entry.hourSlot)
    const text = entry.text.replace(/"/g, '""') // Escape quotes
    const tag = entry.tag || ''
    const timestamp = new Date(entry.timestamp).toISOString()
    return [date, timeRange, text, tag, timestamp]
  })

  const csvRows = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
  ]

  return csvRows.join('\n')
}

export function exportToJSON(entries: HourEntry[]): string {
  const data = entries.map((entry) => ({
    date: entry.date,
    timeSlot: formatHourSlot(entry.hourSlot),
    hourSlot: entry.hourSlot,
    text: entry.text,
    tag: entry.tag || null,
    timestamp: new Date(entry.timestamp).toISOString(),
  }))

  return JSON.stringify(data, null, 2)
}

export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export async function exportToday(entries: HourEntry[], format: 'csv' | 'json' | 'pdf' = 'csv') {
  const today = new Date()
  const dateStr = formatDate(today).replace(/,/g, '')
  const todayDateStr = getDateString(today)

  if (format === 'pdf') {
    // Lazy load PDF library
    const { pdf, HourlyLogPDF } = await loadPDFLibrary()

    // Get settings for dayStartHour
    const { getSettings } = await import('@/lib/storage/settings')
    const settings = await getSettings()

    const pdfDoc = (
      <HourlyLogPDF
        entries={entries}
        title="Today's Hourly Log"
        subtitle={dateStr}
        dateRange={{ start: todayDateStr, end: todayDateStr }}
        dayStartHour={settings.dayStartHour}
      />
    )
    const blob = await pdf(pdfDoc).toBlob()
    const filename = generateSafeFilename(`honesthours-${dateStr}`, 'pdf')
    downloadPDF(blob, filename)
    return
  }

  const filename = `honesthours-${dateStr}.${format}`
  const content = format === 'csv' ? exportToCSV(entries) : exportToJSON(entries)
  const mimeType = format === 'csv' ? 'text/csv' : 'application/json'

  downloadFile(content, filename, mimeType)
}

export async function exportWeek(entries: HourEntry[], format: 'csv' | 'json' | 'pdf' = 'csv') {
  const today = new Date()
  const weekStart = new Date(today)
  weekStart.setDate(today.getDate() - today.getDay()) // Sunday
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 6)

  const startStr = formatDate(weekStart).replace(/,/g, '')
  const endStr = formatDate(weekEnd).replace(/,/g, '')
  const startDateStr = getDateString(weekStart)
  const endDateStr = getDateString(weekEnd)

  if (format === 'pdf') {
    // Lazy load PDF library
    const { pdf, HourlyLogPDF } = await loadPDFLibrary()

    // Get settings for dayStartHour
    const { getSettings } = await import('@/lib/storage/settings')
    const settings = await getSettings()

    const subtitle = `${startStr} to ${endStr}`
    const pdfDoc = (
      <HourlyLogPDF
        entries={entries}
        title="Weekly Hourly Log"
        subtitle={subtitle}
        dateRange={{ start: startDateStr, end: endDateStr }}
        dayStartHour={settings.dayStartHour}
      />
    )
    const blob = await pdf(pdfDoc).toBlob()
    const filename = generateSafeFilename(`honesthours-week-${startStr}-to-${endStr}`, 'pdf')
    downloadPDF(blob, filename)
    return
  }

  const filename = `honesthours-week-${startStr}-to-${endStr}.${format}`
  const content = format === 'csv' ? exportToCSV(entries) : exportToJSON(entries)
  const mimeType = format === 'csv' ? 'text/csv' : 'application/json'

  downloadFile(content, filename, mimeType)
}
