import { notify } from '@zos/notification'
import { log as Logger } from '@zos/utils'

import { parseQuery } from '../utils/index'
import { formatNotificationTitle, getReminderById } from '../utils/reminders'

const logger = Logger.getLogger('reminder-service')

function decodeParamValue(value) {
  return String(value == null ? '' : value)
    .replace(/%3D/g, '=')
    .replace(/%26/g, '&')
    .replace(/%25/g, '%')
}

AppService({
  onInit(params) {
    logger.log(`reminder service onInit: ${params}`)
    const query = parseQuery(params || '')
    const stored = query.id ? getReminderById(query.id) : null

    const reminder = {
      title:
        (stored && stored.title) ||
        decodeParamValue(query.title) ||
        '',
      text:
        (stored && stored.text) ||
        decodeParamValue(query.text) ||
        ''
    }

    // Migrate older reminders that only had description text
    if (!reminder.title && reminder.text) {
      reminder.title = reminder.text
    }

    const enabled = stored ? stored.enabled !== false : true

    if (!enabled) {
      logger.log('reminder disabled')
      return
    }

    if (!reminder.title && !query.id && !(stored && stored.id)) {
      logger.log('reminder payload missing')
      return
    }

    const result = notify({
      title: formatNotificationTitle(reminder),
      content: reminder.text || reminder.title || 'Reminder',
      actions: [],
      vibrate: 5
    })

    logger.log(`notify result=${result}`)
  },
  onDestroy() {
    logger.log('reminder service onDestroy')
  }
})
