import {
  WEEK_FRI,
  WEEK_MON,
  WEEK_SAT,
  WEEK_SUN,
  WEEK_THU,
  WEEK_TUE,
  WEEK_WED
} from '@zos/alarm'

export const REMINDERS_FILE_NAME = 'custom_reminders.txt'

export const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

/** Bit positions matching @zos/alarm WEEK_* constants */
export const WEEK_BITS = {
  Mon: WEEK_MON,
  Tue: WEEK_TUE,
  Wed: WEEK_WED,
  Thu: WEEK_THU,
  Fri: WEEK_FRI,
  Sat: WEEK_SAT,
  Sun: WEEK_SUN
}

export const ALL_WEEKDAYS =
  WEEK_BITS.Mon |
  WEEK_BITS.Tue |
  WEEK_BITS.Wed |
  WEEK_BITS.Thu |
  WEEK_BITS.Fri |
  WEEK_BITS.Sat |
  WEEK_BITS.Sun
