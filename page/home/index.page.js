import * as hmUI from '@zos/ui'
import { getText } from '@zos/i18n'
import { log as Logger } from '@zos/utils'
import { push } from '@zos/router'

import {
  ADD_BUTTON,
  SCROLL_LIST,
  TIPS_TEXT_STYLE,
  TITLE_TEXT_STYLE
} from './index.page.r.layout'
import { getScrollListDataConfig } from './../../utils/index'
import {
  deleteReminder,
  formatListTitle,
  formatSchedule,
  loadReminders
} from './../../utils/reminders'
import { cancelReminderAlarm } from './../../utils/alarm'

const logger = Logger.getLogger('reminders-home')

function toListItems(reminders) {
  return reminders.map((r) => ({
    id: r.id,
    title: formatListTitle(r),
    schedule: formatSchedule(r),
    img_src: 'delete.png'
  }))
}

Page({
  state: {
    scrollList: null,
    tipText: null,
    dataList: []
  },
  onInit() {
    logger.log('home onInit')
  },
  build() {
    hmUI.createWidget(hmUI.widget.TEXT, {
      ...TITLE_TEXT_STYLE
    })

    hmUI.createWidget(hmUI.widget.BUTTON, {
      ...ADD_BUTTON,
      click_func: () => {
        push({
          url: 'page/edit/index.page'
        })
      }
    })

    this.refreshList()
  },
  refreshList() {
    const reminders = loadReminders()
    this.state.dataList = toListItems(reminders)
    this.createAndUpdateList()
  },
  changeUI(showEmpty) {
    const { dataList } = this.state
    const isEmpty = dataList.length === 0

    if (!this.state.tipText) {
      this.state.tipText = hmUI.createWidget(hmUI.widget.TEXT, {
        ...TIPS_TEXT_STYLE
      })
    }

    this.state.tipText.setProperty(hmUI.prop.VISIBLE, showEmpty && isEmpty)
    if (this.state.scrollList) {
      this.state.scrollList.setProperty(hmUI.prop.VISIBLE, !(showEmpty && isEmpty))
    }
  },
  createAndUpdateList() {
    const { scrollList, dataList } = this.state
    this.changeUI(true)

    const dataTypeConfig = getScrollListDataConfig(dataList.length)

    const onItemClick = (_list, index, key) => {
      if (key === 'img_src') {
        this.deleteItem(index)
        return
      }
      const item = this.state.dataList[index]
      if (item && item.id) {
        push({
          url: 'page/edit/index.page',
          params: `id=${item.id}`
        })
      }
    }

    if (scrollList) {
      scrollList.setProperty(hmUI.prop.UPDATE_DATA, {
        data_array: dataList,
        data_count: dataList.length,
        data_type_config: dataTypeConfig,
        data_type_config_count: dataTypeConfig.length,
        on_page: 1
      })
    } else {
      this.state.scrollList = hmUI.createWidget(hmUI.widget.SCROLL_LIST, {
        ...SCROLL_LIST,
        data_array: dataList,
        data_count: dataList.length,
        data_type_config: dataTypeConfig,
        data_type_config_count: dataTypeConfig.length,
        item_enable_horizon_drag: true,
        item_drag_max_distance: -120,
        on_page: 1,
        item_click_func: onItemClick
      })
    }
  },
  deleteItem(index) {
    const item = this.state.dataList[index]
    if (!item) {
      return
    }
    const reminders = loadReminders()
    const reminder = reminders.find((r) => r.id === item.id)
    if (reminder) {
      cancelReminderAlarm(reminder)
    }
    deleteReminder(item.id)
    hmUI.showToast({
      text: getText('deleteSuccess')
    })
    this.refreshList()
  }
})
