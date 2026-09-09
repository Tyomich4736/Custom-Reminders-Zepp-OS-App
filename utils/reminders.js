import { WEEK_BITS, WEEKDAY_LABELS, ALL_WEEKDAYS } from './constants'
import { readFileSync, writeFileSync } from './fs'

export function createReminder(partial = {}) {
  return {
    id: String(Date.now()),
    title: '',
    text: '',
    hour: 9,
    minute: 0,
    weekDays: ALL_WEEKDAYS,
    alarmId: 0,
    enabled: true,
    ...partial
  }
}

export function loadReminders() {
  return readFileSync()
}

export function saveReminders(list) {
  writeFileSync(list)
}

export function getReminderById(id) {
  return loadReminders().find((r) => r.id === id) || null
}

export function upsertReminder(reminder) {
  const list = loadReminders()
  const index = list.findIndex((r) => r.id === reminder.id)
  if (index >= 0) {
    list[index] = reminder
  } else {
    list.push(reminder)
  }
  saveReminders(list)
  return list
}

export function deleteReminder(id) {
  const list = loadReminders().filter((r) => r.id !== id)
  saveReminders(list)
  return list
}

export function pad2(n) {
  return n < 10 ? `0${n}` : String(n)
}

export function formatTime(hour, minute) {
  return `${pad2(hour)}:${pad2(minute)}`
}

export function formatWeekDays(weekDays) {
  const labels = []
  WEEKDAY_LABELS.forEach((label) => {
    if (weekDays & WEEK_BITS[label]) {
      labels.push(label)
    }
  })
  if (labels.length === 7) {
    return 'Every day'
  }
  if (
    labels.length === 5 &&
    !labels.includes('Sat') &&
    !labels.includes('Sun')
  ) {
    return 'Weekdays'
  }
  return labels.join(' ')
}

export function formatSchedule(reminder) {
  return `${formatWeekDays(reminder.weekDays)} · ${formatTime(reminder.hour, reminder.minute)}`
}

export function formatListTitle(reminder) {
  return (reminder.title || reminder.text || '').trim() || 'Reminder'
}

export function formatNotificationTitle(reminder) {
  return formatListTitle(reminder)
}

export function toggleWeekDay(weekDays, label) {
  const bit = WEEK_BITS[label]
  if (!bit) {
    return weekDays
  }
  return weekDays & bit ? weekDays & ~bit : weekDays | bit
}

export function isWeekDaySelected(weekDays, label) {
  return !!(weekDays & WEEK_BITS[label])
}
