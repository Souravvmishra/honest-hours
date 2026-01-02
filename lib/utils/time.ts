export function formatHourSlot(hourSlot: string): string {
    // hourSlot format: "YYYY-MM-DD HH:00"
    const [datePart, timePart] = hourSlot.split(' ')
    const [year, month, day] = datePart.split('-').map(Number)
    const [hour] = timePart.split(':').map(Number)

    const date = new Date(year, month - 1, day, hour)
    return formatTimeRange(date, new Date(date.getTime() + 60 * 60 * 1000))
}

export function formatTimeRange(start: Date, end: Date): string {
    const startTime = formatTime(start)
    const endTime = formatTime(end)
    return `${startTime} – ${endTime}`
}

export function formatTime(date: Date): string {
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const period = hours >= 12 ? 'PM' : 'AM'
    const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours
    const displayMinutes = minutes.toString().padStart(2, '0')
    return `${displayHour}:${displayMinutes} ${period}`
}

export function formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
}

export function getDateString(date: Date = new Date()): string {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

export function getHourSlot(date: Date): string {
    const dateStr = getDateString(date)
    const hour = date.getHours()
    const hourSlot = `${dateStr} ${String(hour).padStart(2, '0')}:00`
    return hourSlot
}

export function getTodayHourSlots(dayStartHour: number = 6): string[] {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    return getDateHourSlots(today, dayStartHour)
}

export function getDateHourSlots(date: Date, dayStartHour: number = 6): string[] {
    const targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const now = new Date()
    const isToday = getDateString(targetDate) === getDateString(now)

    const slots: string[] = []
    const startHour = dayStartHour
    // For today, only go up to current hour; for past dates, show all hours up to 23
    const endHour = isToday ? now.getHours() : 23

    for (let hour = startHour; hour <= endHour; hour++) {
        const slotDate = new Date(targetDate)
        slotDate.setHours(hour, 0, 0, 0)
        slots.push(getHourSlot(slotDate))
    }

    return slots
}

export function getPreviousHourSlot(currentDate: Date = new Date()): string {
    const prevHour = new Date(currentDate.getTime() - 60 * 60 * 1000)
    return getHourSlot(prevHour)
}

export function getCurrentHourSlot(currentDate: Date = new Date()): string {
    return getHourSlot(currentDate)
}

export function isSameHourSlot(slot1: string, slot2: string): boolean {
    return slot1 === slot2
}

export function getWeekDateRange(date: Date = new Date()): {
    start: string
    end: string
} {
    // Clone date to avoid mutating input
    const dateClone = new Date(date)
    const day = dateClone.getDay()
    const diff = dateClone.getDate() - day // Sunday is 0, so we get Sunday of current week
    const startOfWeek = new Date(dateClone)
    startOfWeek.setDate(diff)
    startOfWeek.setHours(0, 0, 0, 0)

    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)
    endOfWeek.setHours(23, 59, 59, 999)

    return {
        start: getDateString(startOfWeek),
        end: getDateString(endOfWeek),
    }
}
