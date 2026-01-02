import { openDB } from './db'

export interface Settings {
    promptInterval: number // minutes (30-120)
    dayStartHour: number // 0-23
    theme: 'light' | 'dark' | 'system'
    lastPromptTime?: number // timestamp
    name?: string // user's name
}

const DEFAULT_SETTINGS: Settings = {
    promptInterval: 60, // 60 minutes
    dayStartHour: 6, // 6 AM
    theme: 'system',
}

interface SettingsRecord {
    key: string
    value: Settings
}

export async function getSettings(): Promise<Settings> {
    const db = await openDB()
    const transaction = db.transaction('settings', 'readonly')
    const store = transaction.objectStore('settings')

    return new Promise((resolve, reject) => {
        const request = store.get('appSettings')
        request.onsuccess = () => {
            const record = request.result as SettingsRecord | undefined
            if (record) {
                resolve({ ...DEFAULT_SETTINGS, ...record.value })
            } else {
                resolve(DEFAULT_SETTINGS)
            }
        }
        request.onerror = () => reject(request.error)
    })
}

export async function updateSettings(
    updates: Partial<Settings>
): Promise<Settings> {
    const current = await getSettings()
    const updated = { ...current, ...updates }

    const db = await openDB()
    const transaction = db.transaction('settings', 'readwrite')
    const store = transaction.objectStore('settings')

    const record: SettingsRecord = {
        key: 'appSettings',
        value: updated,
    }

    return new Promise((resolve, reject) => {
        const request = store.put(record)
        request.onsuccess = () => resolve(updated)
        request.onerror = () => reject(request.error)
    })
}

export async function resetSettings(): Promise<Settings> {
    return updateSettings(DEFAULT_SETTINGS)
}
