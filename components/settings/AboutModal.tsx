'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  IconBrandGithub,
  IconBug,
  IconShieldLock,
  IconWifi,
  IconInfoCircle,
  IconHeart,
  IconExternalLink,
} from '@tabler/icons-react'
import { APP_NAME, APP_VERSION, GITHUB_URL, GITHUB_ISSUES_URL } from '@/lib/constants/app'

interface AboutModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AboutModal({ open, onOpenChange }: AboutModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader className="text-center pb-2">
          <div className="flex flex-col items-center gap-3">
            <div className="size-14 rounded-xl bg-primary/10 flex items-center justify-center">
              <IconInfoCircle className="size-7 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-lg">{APP_NAME}</DialogTitle>
              <Badge variant="secondary" className="mt-1.5">
                v{APP_VERSION}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-3">
          {/* Privacy Card */}
          <Card className="border-emerald-500/20 bg-emerald-500/5">
            <CardHeader className="pb-0">
              <div className="flex items-center gap-2">
                <IconShieldLock className="size-4 text-emerald-600 dark:text-emerald-400" />
                <CardTitle className="text-emerald-600 dark:text-emerald-400">Privacy First</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                All data stays on your device. No accounts, no cloud sync, no tracking.
              </CardDescription>
            </CardContent>
          </Card>

          {/* Offline Card */}
          <Card className="border-blue-500/20 bg-blue-500/5">
            <CardHeader className="pb-0">
              <div className="flex items-center gap-2">
                <IconWifi className="size-4 text-blue-600 dark:text-blue-400" />
                <CardTitle className="text-blue-600 dark:text-blue-400">Works Offline</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Fully functional without internet. Your entries sync automatically.
              </CardDescription>
            </CardContent>
          </Card>

          {/* Links */}
          <div className="flex gap-2 pt-2">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-1 rounded-md border border-border bg-transparent px-2 h-6 text-xs font-medium hover:bg-muted transition-colors"
            >
              <IconBrandGithub className="size-3.5" />
              GitHub
              <IconExternalLink className="size-3 opacity-50" />
            </a>
            <a
              href={GITHUB_ISSUES_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-1 rounded-md border border-border bg-transparent px-2 h-6 text-xs font-medium hover:bg-muted transition-colors"
            >
              <IconBug className="size-3.5" />
              Report Bug
              <IconExternalLink className="size-3 opacity-50" />
            </a>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-muted-foreground pt-2">
            Made with <IconHeart className="size-3 inline text-red-500 fill-red-500" /> for honest productivity
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
