'use client'

import { Component, type ReactNode } from 'react'
import { Button, buttonVariants } from '@/components/ui/button'
import { IconAlertCircle, IconRefresh, IconExternalLink } from '@tabler/icons-react'
import { GITHUB_ISSUES_URL } from '@/lib/constants/app'
import { cn } from '@/lib/utils'

interface ErrorBoundaryProps {
    children: ReactNode
    fallback?: ReactNode
}

interface ErrorBoundaryState {
    hasError: boolean
    error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props)
        this.state = { hasError: false, error: null }
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo)
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null })
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback
            }

            return (
                <div className="flex min-h-screen items-center justify-center bg-background p-4">
                    <div className="mx-auto max-w-md space-y-4 text-center">
                        <div className="flex justify-center">
                            <IconAlertCircle className="size-12 text-destructive" />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-2xl font-semibold">Something went wrong</h1>
                            <p className="text-muted-foreground">
                                We encountered an unexpected error. Don&apos;t worry, your data is safe.
                            </p>
                            {this.state.error && (
                                <details className="mt-4 text-left">
                                    <summary className="cursor-pointer text-sm text-muted-foreground">
                                        Error details
                                    </summary>
                                    <pre className="mt-2 overflow-auto rounded bg-muted p-2 text-xs">
                                        {this.state.error.message}
                                    </pre>
                                </details>
                            )}
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex gap-2">
                                <Button onClick={this.handleReset} className="flex-1">
                                    <IconRefresh className="mr-2 size-4" />
                                    Try Again
                                </Button>
                                <Button
                                    onClick={() => window.location.reload()}
                                    variant="outline"
                                    className="flex-1"
                                >
                                    Reload Page
                                </Button>
                            </div>
                            <a
                                href={GITHUB_ISSUES_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={cn(buttonVariants({ variant: 'ghost', size: 'default' }), 'w-full')}
                            >
                                <IconExternalLink className="mr-2 size-4" />
                                Report Issue on GitHub
                            </a>
                        </div>
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}
