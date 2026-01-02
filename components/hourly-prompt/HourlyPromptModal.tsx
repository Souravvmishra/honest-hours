'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { createEntry } from '@/lib/storage/entries'
import { getDateString } from '@/lib/utils/time'
import { MIN_TEXT_LENGTH } from '@/lib/constants/app'
import { showToast } from '@/components/ui/toast'

interface HourlyPromptModalProps {
    hourSlot: string
    timeRange: string
    onComplete: () => void
}

export function HourlyPromptModal({
    hourSlot,
    timeRange,
    onComplete,
}: HourlyPromptModalProps) {
    const [text, setText] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    useEffect(() => {
        // Auto-focus textarea on mount
        if (textareaRef.current) {
            textareaRef.current.focus()
        }
    }, [])

    // Prevent escape key and backdrop clicks
    useEffect(() => {
        function handleEscape(e: KeyboardEvent) {
            if (e.key === 'Escape') {
                e.preventDefault()
                e.stopPropagation()
            }
        }

        function handleClickOutside(e: MouseEvent) {
            // Prevent clicks outside the modal from doing anything
            e.stopPropagation()
        }

        document.addEventListener('keydown', handleEscape, true)
        document.addEventListener('click', handleClickOutside, true)

        return () => {
            document.removeEventListener('keydown', handleEscape, true)
            document.removeEventListener('click', handleClickOutside, true)
        }
    }, [])

    const isValid = text.trim().length >= MIN_TEXT_LENGTH

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!isValid || isSubmitting) return

        setIsSubmitting(true)

        try {
            const date = getDateString()
            await createEntry({
                date,
                hourSlot,
                text: text.trim(),
            })

            showToast('Entry saved successfully', 'success')
            onComplete()
        } catch (error) {
            console.error('Failed to save entry:', error)
            showToast('Failed to save entry. Please try again.', 'error')
        } finally {
            setIsSubmitting(false)
        }
    }

    const remainingChars = MIN_TEXT_LENGTH - text.trim().length
    const showCharCount = text.trim().length > 0 && !isValid

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
                if (e.key === 'Escape') {
                    e.preventDefault()
                    e.stopPropagation()
                }
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="prompt-title"
            aria-describedby="prompt-description"
        >
            <div
                className="bg-background ring-foreground/10 w-full max-w-md rounded-xl p-6 ring-1"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="mb-4 space-y-2">
                    <h2 id="prompt-title" className="text-lg font-semibold">
                        What did you do in the last hour?
                    </h2>
                    <p id="prompt-description" className="text-sm text-muted-foreground">
                        {timeRange}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Textarea
                            ref={textareaRef}
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Describe what you did in the last hour..."
                            className="min-h-24 text-base"
                            required
                            autoFocus
                            aria-label="Hourly activity description"
                            aria-describedby={showCharCount ? 'char-count' : undefined}
                            aria-invalid={!isValid && text.trim().length > 0}
                        />
                        {showCharCount && (
                            <p id="char-count" className="text-xs text-muted-foreground" role="status">
                                {remainingChars} more characters required
                            </p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        disabled={!isValid || isSubmitting}
                        className="w-full"
                        size="lg"
                        aria-label={isSubmitting ? 'Saving entry' : 'Submit entry'}
                    >
                        {isSubmitting ? 'Saving...' : 'Submit'}
                    </Button>
                </form>
            </div>
        </div>
    )
}
