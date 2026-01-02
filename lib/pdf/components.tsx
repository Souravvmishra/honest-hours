import React from 'react'
import { View, Text } from '@react-pdf/renderer'
import { pdfStyles } from './styles'

interface SeparatorProps {
  type?: 'single' | 'double'
}

// Reusable Separator Component
export const Separator: React.FC<SeparatorProps> = ({ type = 'single' }) => {
  const char = type === 'double' ? '=' : '-'
  const style = type === 'double' ? pdfStyles.separatorDouble : pdfStyles.separator
  return (
    <Text style={style}>
      {char.repeat(80)}{'\n'}
    </Text>
  )
}

interface SectionProps {
  number?: string
  title: string
  children: React.ReactNode
}

// Reusable Section Component
export const Section: React.FC<SectionProps> = ({ number, title, children }) => (
  <View>
    <Text style={pdfStyles.sectionHeading}>
      {number ? `${number}. ` : ''}{title}
    </Text>
    {children}
  </View>
)

interface DocumentTitleProps {
  title: string
  subtitle?: string
}

// Reusable Document Title Component
export const DocumentTitle: React.FC<DocumentTitleProps> = ({ title, subtitle }) => (
  <View>
    <Text style={pdfStyles.title}>{title}</Text>
    {subtitle && <Text style={pdfStyles.subtitle}>{subtitle}</Text>}
  </View>
)
