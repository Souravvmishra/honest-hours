'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useSettings } from '@/lib/hooks/useSettings'
import { IconSettings, IconAdjustments, IconDownload, IconDeviceMobile } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { showToast } from '@/components/ui/toast'
import { GeneralSettings } from './tabs/GeneralSettings'
import { ExportSettings } from './tabs/ExportSettings'
import { AppSettings } from './tabs/AppSettings'

export function SettingsModal() {
  const [isOpen, setIsOpen] = useState(false)
  const { settings, update } = useSettings()

  async function handleSave(updates: Parameters<typeof update>[0]) {
    try {
      await update(updates)
      showToast('Settings saved successfully', 'success')
    } catch (error) {
      console.error('Failed to save settings:', error)
      showToast('Failed to save settings. Please try again.', 'error')
    }
  }

  if (!settings) {
    return null
  }

  return (
    <>
      {/* Tiny gear icon in bottom corner */}
      <Button
        variant="ghost"
        size="icon-xs"
        className="fixed bottom-4 right-4 z-40 opacity-40 hover:opacity-100 transition-opacity"
        onClick={() => setIsOpen(true)}
        aria-label="Settings"
        title="Settings"
      >
        <IconSettings className="size-3.5" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="general" className="flex-1 gap-1.5">
                <IconAdjustments className="size-4" />
                <span className="hidden sm:inline">General</span>
              </TabsTrigger>
              <TabsTrigger value="export" className="flex-1 gap-1.5">
                <IconDownload className="size-4" />
                <span className="hidden sm:inline">Export</span>
              </TabsTrigger>
              <TabsTrigger value="app" className="flex-1 gap-1.5">
                <IconDeviceMobile className="size-4" />
                <span className="hidden sm:inline">App</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="general" className="mt-4">
              <GeneralSettings settings={settings} onSave={handleSave} />
            </TabsContent>
            <TabsContent value="export" className="mt-4">
              <ExportSettings />
            </TabsContent>
            <TabsContent value="app" className="mt-4">
              <AppSettings />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  )
}
