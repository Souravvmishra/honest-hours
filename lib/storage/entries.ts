import { openDB, type HourEntry } from './db'

export async function createEntry(entry: Omit<HourEntry, 'id' | 'timestamp'>): Promise<HourEntry> {
    const db = await openDB()
    const transaction = db.transaction('hourEntries', 'readwrite')
    const store = transaction.objectStore('hourEntries')

    const fullEntry: HourEntry = {
        ...entry,
        id: `${entry.hourSlot}-${Date.now()}`,
        timestamp: Date.now(),
    }

    return new Promise((resolve, reject) => {
        const request = store.add(fullEntry)
        request.onsuccess = () => resolve(fullEntry)
        request.onerror = () => reject(request.error)
    })
}

export async function getEntryByHourSlot(
    hourSlot: string
): Promise<HourEntry | null> {
    const db = await openDB()
    const transaction = db.transaction('hourEntries', 'readonly')
    const store = transaction.objectStore('hourEntries')
    const index = store.index('hourSlot')

    return new Promise((resolve, reject) => {
        const request = index.get(hourSlot)
        request.onsuccess = () => {
            resolve(request.result || null)
        }
        request.onerror = () => reject(request.error)
    })
}

export async function getTodayEntries(date: string): Promise<HourEntry[]> {
    const db = await openDB()
    const transaction = db.transaction('hourEntries', 'readonly')
    const store = transaction.objectStore('hourEntries')
    const index = store.index('date')

    return new Promise((resolve, reject) => {
        const request = index.getAll(date)
        request.onsuccess = () => {
            const entries = request.result as HourEntry[]
            // Sort by hourSlot ascending
            entries.sort((a, b) => a.hourSlot.localeCompare(b.hourSlot))
            resolve(entries)
        }
        request.onerror = () => reject(request.error)
    })
}

export async function getWeekEntries(
    startDate: string,
    endDate: string
): Promise<HourEntry[]> {
    const db = await openDB()
    const transaction = db.transaction('hourEntries', 'readonly')
    const store = transaction.objectStore('hourEntries')
    const index = store.index('date')

    return new Promise((resolve, reject) => {
        // Use IDBKeyRange for efficient date range query
        const range = IDBKeyRange.bound(startDate, endDate, false, false)
        const request = index.getAll(range)

        request.onsuccess = () => {
            const entries = request.result as HourEntry[]
            // Sort by timestamp descending (newest first)
            entries.sort((a, b) => b.timestamp - a.timestamp)
            resolve(entries)
        }
        request.onerror = () => reject(request.error)
    })
}

export async function getAllEntries(): Promise<HourEntry[]> {
    const db = await openDB()
    const transaction = db.transaction('hourEntries', 'readonly')
    const store = transaction.objectStore('hourEntries')

    return new Promise((resolve, reject) => {
        const request = store.getAll()
        request.onsuccess = () => {
            const entries = request.result as HourEntry[]
            entries.sort((a, b) => b.timestamp - a.timestamp)
            resolve(entries)
        }
        request.onerror = () => reject(request.error)
    })
}

export async function deleteAllEntries(): Promise<void> {
    const db = await openDB()
    const transaction = db.transaction('hourEntries', 'readwrite')
    const store = transaction.objectStore('hourEntries')

    return new Promise((resolve, reject) => {
        const request = store.clear()
        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)
    })
}
