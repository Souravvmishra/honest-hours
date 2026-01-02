'use client'

import { cn } from '@/lib/utils'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-muted', className)}
      {...props}
      aria-hidden="true"
    />
  )
}

export function LogEntrySkeleton() {
  return (
    <div className="border-b border-border/30 py-4 last:border-b-0">
      <Skeleton className="mb-2 h-4 w-32" />
      <Skeleton className="h-6 w-full" />
    </div>
  )
}

export function DailyLogSkeleton() {
  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 md:p-8">
      <div className="mx-auto max-w-2xl space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="space-y-0">
          {Array.from({ length: 8 }).map((_, i) => (
            <LogEntrySkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
