import React from 'react'
import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer'
import { type HourEntry } from '@/lib/storage/entries'
import { pdfStyles } from '@/lib/pdf/styles'
import { registerPDFFonts } from '@/lib/pdf/fonts'
import { formatHourSlot, formatDate, getDateString, getHourSlot } from '@/lib/utils/time'
import { format } from 'date-fns'

// Register fonts
registerPDFFonts()

// Entry list styles matching UI exactly - compact version
const entryStyles = StyleSheet.create({
  entryContainer: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#e5e5e5',
    paddingVertical: 4,
  },
  timeRange: {
    fontSize: 6,
    fontWeight: 'medium',
    color: '#666',
    marginBottom: 2,
    fontFamily: 'CourierPrime',
  },
  entryText: {
    fontSize: 7,
    lineHeight: 1.3,
    color: '#000',
    fontFamily: 'CourierPrime',
  },
  missingText: {
    fontSize: 7,
    color: '#dc2626', // destructive color
    fontFamily: 'CourierPrime',
  },
})

interface HourlyLogPDFProps {
  entries: HourEntry[]
  title: string
  subtitle?: string
  dateRange: { start: string; end: string }
  dayStartHour: number
}

/**
 * Get all hour slots for a date range
 */
function getAllHourSlotsForDateRange(
  startDate: string,
  endDate: string,
  dayStartHour: number
): string[] {
  const slots: string[] = []
  const start = new Date(startDate + 'T00:00:00')
  const end = new Date(endDate + 'T23:59:59')
  const now = new Date()

  let currentDate = new Date(start)
  
  while (currentDate <= end) {
    const dateStr = getDateString(currentDate)
    const isToday = dateStr === getDateString(now)
    const currentHour = now.getHours()
    
    // For today, only go up to current hour
    // For past dates, go up to 23 (end of day)
    const maxHour = isToday ? currentHour : 23
    
    for (let hour = dayStartHour; hour <= maxHour; hour++) {
      const slotDate = new Date(currentDate)
      slotDate.setHours(hour, 0, 0, 0)
      slots.push(getHourSlot(slotDate))
    }
    
    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1)
    currentDate.setHours(0, 0, 0, 0)
  }
  
  return slots
}

/**
 * PDF component for hourly log entries export
 * Matches the exact UI format - simple list with time range and entry text
 * Shows missing hours like the UI does
 */
export const HourlyLogPDF = ({
  entries,
  title,
  subtitle,
  dateRange,
  dayStartHour,
}: HourlyLogPDFProps) => {
  // Create entry map for quick lookup
  const entryMap = new Map<string, HourEntry>()
  entries.forEach((entry) => {
    entryMap.set(entry.hourSlot, entry)
  })

  // Get all expected hour slots for the date range
  const allHourSlots = getAllHourSlotsForDateRange(
    dateRange.start,
    dateRange.end,
    dayStartHour
  )

  // Build log entries with missing info (matching UI structure)
  interface LogEntry {
    hourSlot: string
    timeRange: string
    entry: HourEntry | null
    isMissing: boolean
    date: string
  }

  const logEntries: LogEntry[] = allHourSlots.map((slot) => {
    const entry = entryMap.get(slot) || null
    const [datePart] = slot.split(' ')
    return {
      hourSlot: slot,
      timeRange: formatHourSlot(slot),
      entry,
      isMissing: !entry,
      date: datePart,
    }
  })

  // Group by date
  const entriesByDate = new Map<string, LogEntry[]>()
  logEntries.forEach((logEntry) => {
    const dateEntries = entriesByDate.get(logEntry.date) || []
    dateEntries.push(logEntry)
    entriesByDate.set(logEntry.date, dateEntries)
  })

  // Sort dates
  const sortedDates = Array.from(entriesByDate.keys()).sort()

  // Calculate summary stats (matching UI)
  const totalHours = logEntries.length
  const missingCount = logEntries.filter((e) => e.isMissing).length

  return (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        {/* Logo - top left, very small */}
        <View style={{ marginBottom: 8, alignItems: 'flex-start' }}>
          <Image
            src="/image_1_-removebg-preview.png"
            style={{ width: 32, height: 10 }}
          />
        </View>

        {/* Date Heading - matching UI */}
        <View
          style={{
            marginBottom: 8,
            borderBottomWidth: 0.5,
            borderBottomColor: '#e5e5e5',
            paddingBottom: 6,
          }}
        >
          <Text
            style={{
              fontSize: 10,
              fontWeight: 'semibold',
              marginBottom: 3,
              fontFamily: 'CourierPrime',
            }}
          >
            {subtitle || title}
          </Text>
          {missingCount > 0 ? (
            <Text style={{ fontSize: 7, color: '#dc2626', fontFamily: 'CourierPrime' }}>
              {missingCount} {missingCount === 1 ? 'hour' : 'hours'} unaccounted – face it
            </Text>
          ) : (
            <Text style={{ fontSize: 7, color: '#666', fontFamily: 'CourierPrime' }}>
              All {totalHours} {totalHours === 1 ? 'hour' : 'hours'} accounted for
            </Text>
          )}
        </View>

        {/* Entries List - matching UI format exactly */}
        {sortedDates.length === 0 ? (
          <View style={{ marginTop: 10 }}>
            <Text style={[pdfStyles.bodyText, { fontFamily: 'CourierPrime', fontSize: 7 }]}>
              No hours logged yet
            </Text>
          </View>
        ) : (
          <View style={{ marginTop: 0 }}>
            {sortedDates.map((date) => {
              const dateEntries = entriesByDate.get(date) || []

              return (
                <View key={date} style={{ marginBottom: 6 }}>
                  {sortedDates.length > 1 && (
                    <Text
                      style={{
                        fontSize: 8,
                        fontWeight: 'bold',
                        marginBottom: 4,
                        fontFamily: 'CourierPrime',
                      }}
                    >
                      {formatDate(new Date(date))}
                    </Text>
                  )}
                  {dateEntries.map((logEntry, index) => (
                    <View
                      key={logEntry.hourSlot || index}
                      style={entryStyles.entryContainer}
                    >
                      <Text style={entryStyles.timeRange}>
                        {logEntry.timeRange}
                      </Text>
                      {logEntry.isMissing ? (
                        <Text style={entryStyles.missingText}>Missing</Text>
                      ) : (
                        <Text style={entryStyles.entryText}>
                          {logEntry.entry?.text}
                        </Text>
                      )}
                    </View>
                  ))}
                </View>
              )
            })}
          </View>
        )}

        {/* Footer */}
        <View
          style={{
            marginTop: 'auto',
            paddingTop: 10,
            borderTopWidth: 0.5,
            borderTopColor: '#e5e5e5',
          }}
        >
          <Text
            style={{
              fontSize: 6,
              textAlign: 'center',
              color: '#666',
              fontFamily: 'CourierPrime',
            }}
          >
            Generated on {format(new Date(), 'MMM dd, yyyy HH:mm')}
          </Text>
        </View>
      </Page>
    </Document>
  )
}
