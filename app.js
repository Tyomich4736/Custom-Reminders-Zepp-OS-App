import { log as Logger } from '@zos/utils'

const logger = Logger.getLogger('custom-reminders-app')

App({
  globalData: {},
  onCreate() {
    logger.log('app onCreate invoked')
  },
  onDestroy() {
    logger.log('app onDestroy invoked')
  }
})
