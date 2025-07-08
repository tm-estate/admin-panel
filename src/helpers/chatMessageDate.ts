import { isToday, format, parseISO } from 'date-fns'
export function formatMessageTime(dateInput: string | Date): string {
  const date = typeof dateInput === 'string' ? parseISO(dateInput) : dateInput

  if (isToday(date)) {
    return format(date, 'HH:mm') // e.g., 14:35
  }

  return format(date, 'MMM d') // e.g., Jul 2
}
