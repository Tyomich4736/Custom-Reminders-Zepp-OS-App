import {
  REPEAT_WEEK,
  WEEK_FRI,
  WEEK_MON,
  WEEK_SAT,
  WEEK_SUN,
  WEEK_THU,
  WEEK_TUE,
  WEEK_WED,
  cancel,
  set
} from '@zos/alarm'
import { Time } from '@zos/sensor'
import { log as Logger } from '@zos/utils'

const logger = Logger.getLogger('reminders-alarm')

/** Map Time.getDay() 1=Mon … 7=Sun → WEEK_* bit */
const DAY_TO_BIT = [
  0,
  WEEK_MON,
  WEEK_TUE,
  WEEK_WED,
  WEEK_THU,
  WEEK_FRI,
  WEEK_SAT,
  WEEK_SUN
]

function encodeParamValue(value) {
  return String(value == null ? '' : value)
    .replace(/%/g, '%25')
    .replace(/&/g, '%26')
    .replace(/=/g, '%3D')
}

/**
 * Next UTC timestamp (seconds) for local hour:minute on selected weekdays.
 *
 * getTime() is UTC, while getHours()/getDay() are local — convert via a local
 * delta so the alarm matches the watch clock the user set.
 */
export function nextOccurrenceUtcSeconds(hour, minute, weekDays) {
  const t = new Time()
  const nowSec = Math.floor(t.getTime() / 1000)
  const currentDay = t.getDay()
  const localSecOfDay =
    t.getHours() * 3600 + t.getMinutes() * 60 + t.getSeconds()
  const targetSecOfDay = hour * 3600 + minute * 60

  for (let offset = 0; offset < 8; offset++) {
    let day = currentDay + offset
    if (day > 7) {
      day -= 7
    }
    const bit = DAY_TO_BIT[day]
    if (!bit || !(weekDays & bit)) {
      continue
    }
    const delta = offset * 86400 + (targetSecOfDay - localSecOfDay)
    if (delta > 0) {
      return nowSec + delta
    }
  }

  return nowSec + 60
}

export function buildAlarmParam(reminder) {
  return [
    `id=${encodeParamValue(reminder.id)}`,
    `title=${encodeParamValue(reminder.title || '')}`,
    `text=${encodeParamValue(reminder.text || '')}`
  ].join('&')
}

export function scheduleReminderAlarm(reminder) {
  if (!reminder.enabled || !reminder.weekDays) {
    return 0
  }

  if (reminder.alarmId) {
    try {
      cancel(reminder.alarmId)
    } catch (e) {
      // ignore cancel errors for stale ids
    }
  }

  const time = nextOccurrenceUtcSeconds(
    reminder.hour,
    reminder.minute,
    reminder.weekDays
  )

  logger.log(
    `schedule id=${reminder.id} local=${reminder.hour}:${reminder.minute} weekDays=${reminder.weekDays} utc=${time}`
  )

  const alarmId = set({
    url: 'app-service/reminder',
    param: buildAlarmParam(reminder),
    time,
    store: true,
    repeat_type: REPEAT_WEEK,
    week_days: reminder.weekDays
  })

  logger.log(`alarm set result=${alarmId}`)
  return alarmId || 0
}

export function cancelReminderAlarm(reminder) {
  if (reminder && reminder.alarmId) {
    try {
      cancel(reminder.alarmId)
    } catch (e) {
      // ignore
    }
  }
}
