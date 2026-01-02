import React from 'react'
import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer'
import { type HourEntry } from '@/lib/storage/entries'
import { pdfStyles } from '@/lib/pdf/styles'
import { registerPDFFonts } from '@/lib/pdf/fonts'
import { formatHourSlot, formatDate } from '@/lib/utils/time'
import { format } from 'date-fns'

// Register fonts
registerPDFFonts()

// Entry list styles matching UI exactly
const entryStyles = StyleSheet.create({
  entryContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    paddingVertical: 16,
  },
  timeRange: {
    fontSize: 11,
    fontWeight: 'medium',
    color: '#666',
    marginBottom: 8,
  },
  entryText: {
    fontSize: 14,
    lineHeight: 1.75,
    color: '#000',
  },
  missingText: {
    fontSize: 14,
    color: '#dc2626', // destructive color
  },
})

interface HourlyLogPDFProps {
  entries: HourEntry[]
  title: string
  subtitle?: string
}

/**
 * PDF component for hourly log entries export
 * Matches the exact UI format - simple list with time range and entry text
 */
export const HourlyLogPDF = ({ entries, title, subtitle }: HourlyLogPDFProps) => {
  // Group entries by date for multi-day exports
  const entriesByDate = new Map<string, HourEntry[]>()
  entries.forEach((entry) => {
    const dateEntries = entriesByDate.get(entry.date) || []
    dateEntries.push(entry)
    entriesByDate.set(entry.date, dateEntries)
  })

  // Sort dates
  const sortedDates = Array.from(entriesByDate.keys()).sort()

  // Calculate summary stats
  const totalEntries = entries.length

  return (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        {/* Logo - top left, very small */}
        <View style={{ marginBottom: 16, alignItems: 'flex-start' }}>
          <Image
            src="/image_1_-removebg-preview.png"
            style={{ width: 40, height: 13 }}
          />
        </View>

        {/* Date Heading - matching UI */}
        <View style={{ marginBottom: 24, borderBottomWidth: 1, borderBottomColor: '#e5e5e5', paddingBottom: 16 }}>
          <Text style={{ fontSize: 20, fontWeight: 'semibold', marginBottom: 8 }}>
            {subtitle || title}
          </Text>
          {totalEntries > 0 ? (
            <Text style={{ fontSize: 14, color: '#666' }}>
              All {totalEntries} {totalEntries === 1 ? 'entry' : 'entries'} accounted for
            </Text>
          ) : (
            <Text style={{ fontSize: 14, color: '#666' }}>
              No hours logged yet
            </Text>
          )}
        </View>

        {/* Entries List - matching UI format exactly */}
        {sortedDates.length === 0 ? (
          <View style={{ marginTop: 20 }}>
            <Text style={pdfStyles.bodyText}>No hours logged yet</Text>
          </View>
        ) : (
          <View style={{ marginTop: 0 }}>
            {sortedDates.map((date) => {
              const dateEntries = entriesByDate.get(date) || []
              // Sort entries by hourSlot
              const sortedEntries = [...dateEntries].sort((a, b) => 
                a.hourSlot.localeCompare(b.hourSlot)
              )

              return (
                <View key={date} style={{ marginBottom: 16 }}>
                  {sortedEntries.length > 0 && sortedDates.length > 1 && (
                    <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 12 }}>
                      {formatDate(new Date(date))}
                    </Text>
                  )}
                  {sortedEntries.map((entry, index) => (
                    <View key={entry.id || index} style={entryStyles.entryContainer}>
                      <Text style={entryStyles.timeRange}>
                        {formatHourSlot(entry.hourSlot)}
                      </Text>
                      <Text style={entryStyles.entryText}>
                        {entry.text}
                      </Text>
                    </View>
                  ))}
                </View>
              )
            })}
          </View>
        )}

        {/* Footer */}
        <View style={{ marginTop: 'auto', paddingTop: 20, borderTopWidth: 1, borderTopColor: '#e5e5e5' }}>
          <Text style={{ fontSize: 9, textAlign: 'center', color: '#666' }}>
            Generated on {format(new Date(), 'MMM dd, yyyy HH:mm')}
          </Text>
        </View>
      </Page>
    </Document>
  )
}
