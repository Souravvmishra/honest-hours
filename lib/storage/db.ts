const DB_NAME = 'HonestHoursDB'
const DB_VERSION = 1

export interface HourEntry {
    id: string
    date: string // YYYY-MM-DD
    hourSlot: string // YYYY-MM-DD HH:00
    text: string
    tag?: string
    timestamp: number
}

let dbInstance: IDBDatabase | null = null

export async function openDB(): Promise<IDBDatabase> {
    if (dbInstance) {
        return dbInstance
    }

    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION)

        request.onerror = () => reject(request.error)
        request.onsuccess = () => {
            dbInstance = request.result
            resolve(dbInstance)
        }

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result

            // HourEntries store
            if (!db.objectStoreNames.contains('hourEntries')) {
                const entriesStore = db.createObjectStore('hourEntries', {
                    keyPath: 'id',
                })
                entriesStore.createIndex('date', 'date', { unique: false })
                entriesStore.createIndex('hourSlot', 'hourSlot', { unique: true })
                entriesStore.createIndex('timestamp', 'timestamp', { unique: false })
            }

            // Settings store
            if (!db.objectStoreNames.contains('settings')) {
                db.createObjectStore('settings', { keyPath: 'key' })
            }
        }
    })
}

export async function closeDB(): Promise<void> {
    if (dbInstance) {
        dbInstance.close()
        dbInstance = null
    }
}
