/**
 * PDF Utility Functions
 * Shared helpers for PDF generation across the application
 */

/**
 * Generates a safe filename from a string
 * Removes special characters and replaces spaces with dashes
 */
export const generateSafeFilename = (name: string, extension = 'pdf'): string => {
    const sanitized = name
        .trim()
        .replace(/[^a-zA-Z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with dashes
        .toLowerCase()

    return `${sanitized}.${extension}`
}

/**
 * Downloads a PDF blob in the browser
 */
export const downloadPDF = (blob: Blob, filename: string): void => {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
}
