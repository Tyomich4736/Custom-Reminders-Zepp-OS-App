import {
  createKeyboard,
  deleteKeyboard,
  inputType
} from '@zos/ui'
import * as hmUI from '@zos/ui'
import { getText } from '@zos/i18n'
import { log as Logger, px } from '@zos/utils'
import { back } from '@zos/router'
import { SCROLL_MODE_FREE, scrollTo, setScrollLock, setScrollMode } from '@zos/page'

import {
  DELETE_BUTTON,
  DEVICE_HEIGHT,
  DEVICE_WIDTH,
  LABEL_STYLE,
  PAGE_BOTTOM,
  PAGE_TITLE,
  ROW_Y,
  SAVE_BUTTON,
  VALUE_BUTTON,
  WEEKDAY_BTN
} from './index.page.r.layout'
import { WEEKDAY_LABELS } from './../../utils/constants'
import { parseQuery } from './../../utils/index'
import {
  createReminder,
  deleteReminder,
  formatTime,
  getReminderById,
  isWeekDaySelected,
  toggleWeekDay,
  upsertReminder
} from './../../utils/reminders'
import { cancelReminderAlarm, scheduleReminderAlarm } from './../../utils/alarm'

const logger = Logger.getLogger('reminders-edit')

const DAY_SHORT = {
  Mon: 'M',
  Tue: 'T',
  Wed: 'W',
  Thu: 'T',
  Fri: 'F',
  Sat: 'S',
  Sun: 'S'
}

Page({
  state: {
    reminder: null,
    isNew: true,
    titleBtn: null,
    textBtn: null,
    timeBtn: null,
    dayButtons: {},
    timeEditorOpen: false,
    timeEditorWidgets: [],
    timeDisplay: null
  },
  onInit(params) {
    logger.log(`edit onInit ${params}`)
    const query = parseQuery(params || '')
    if (query.id) {
      const existing = getReminderById(query.id)
      if (existing) {
        this.state.reminder = {
          ...existing,
          title: existing.title || existing.text || ''
        }
        this.state.isNew = false
        return
      }
    }
    this.state.reminder = createReminder()
    this.state.isNew = true
  },
  build() {
    const { reminder, isNew } = this.state

    setScrollLock({ lock: false })
    setScrollMode({
      mode: SCROLL_MODE_FREE
    })

    hmUI.createWidget(hmUI.widget.TEXT, {
      ...PAGE_TITLE,
      text: getText(isNew ? 'newReminder' : 'editReminder')
    })

    // Title
    hmUI.createWidget(hmUI.widget.TEXT, {
      ...LABEL_STYLE,
      y: ROW_Y.title - px(28),
      text: getText('title')
    })
    this.state.titleBtn = hmUI.createWidget(hmUI.widget.BUTTON, {
      ...VALUE_BUTTON,
      y: ROW_Y.title,
      text: reminder.title || getText('tapToEdit'),
      click_func: () => this.openTitleKeyboard()
    })

    // Description
    hmUI.createWidget(hmUI.widget.TEXT, {
      ...LABEL_STYLE,
      y: ROW_Y.text - px(28),
      text: getText('description')
    })
    this.state.textBtn = hmUI.createWidget(hmUI.widget.BUTTON, {
      ...VALUE_BUTTON,
      y: ROW_Y.text,
      text: reminder.text || getText('tapToEdit'),
      click_func: () => this.openTextKeyboard()
    })

    // Time
    hmUI.createWidget(hmUI.widget.TEXT, {
      ...LABEL_STYLE,
      y: ROW_Y.time - px(28),
      text: getText('time')
    })
    this.state.timeBtn = hmUI.createWidget(hmUI.widget.BUTTON, {
      ...VALUE_BUTTON,
      y: ROW_Y.time,
      text: formatTime(reminder.hour, reminder.minute),
      click_func: () => this.openTimePicker()
    })

    // Weekdays
    hmUI.createWidget(hmUI.widget.TEXT, {
      ...LABEL_STYLE,
      y: ROW_Y.days - px(28),
      text: getText('days')
    })
    this.buildWeekdayButtons()

    hmUI.createWidget(hmUI.widget.BUTTON, {
      ...SAVE_BUTTON,
      text: getText('save'),
      click_func: () => this.save()
    })

    if (!isNew) {
      hmUI.createWidget(hmUI.widget.BUTTON, {
        ...DELETE_BUTTON,
        text: getText('delete'),
        click_func: () => this.remove()
      })
    }

    // Invisible spacer so free-scroll content height exceeds one screen
    hmUI.createWidget(hmUI.widget.FILL_RECT, {
      x: 0,
      y: PAGE_BOTTOM,
      w: 1,
      h: 1,
      color: 0x000000
    })
  },
  buildWeekdayButtons() {
    const gap = px(8)
    const btnW = WEEKDAY_BTN.w
    const totalW = WEEKDAY_LABELS.length * btnW + (WEEKDAY_LABELS.length - 1) * gap
    const startX = Math.floor((DEVICE_WIDTH - totalW) / 2)
    WEEKDAY_LABELS.forEach((label, i) => {
      const selected = isWeekDaySelected(this.state.reminder.weekDays, label)
      const btn = hmUI.createWidget(hmUI.widget.BUTTON, {
        x: startX + i * (btnW + gap),
        y: ROW_Y.days,
        ...WEEKDAY_BTN,
        normal_color: selected ? 0x3d7eff : 0x333333,
        press_color: selected ? 0x5a92ff : 0x444444,
        color: 0xffffff,
        text: DAY_SHORT[label],
        click_func: () => this.onToggleDay(label)
      })
      this.state.dayButtons[label] = btn
    })
  },
  refreshWeekdayButtons() {
    // BUTTON normal_color/press_color cannot be changed via setProperty;
    // recreate widgets so the selected state is visible.
    Object.keys(this.state.dayButtons).forEach((label) => {
      const btn = this.state.dayButtons[label]
      if (btn) {
        hmUI.deleteWidget(btn)
      }
    })
    this.state.dayButtons = {}
    this.buildWeekdayButtons()
  },
  onToggleDay(label) {
    this.state.reminder.weekDays = toggleWeekDay(this.state.reminder.weekDays, label)
    this.refreshWeekdayButtons()
  },
  openTitleKeyboard() {
    createKeyboard({
      inputType: inputType.CHAR,
      text: this.state.reminder.title || '',
      onComplete: (_kb, result) => {
        const value = ((result && result.data) || '').trim()
        this.state.reminder.title = value
        this.state.titleBtn.setProperty(
          hmUI.prop.TEXT,
          value || getText('tapToEdit')
        )
        deleteKeyboard()
      },
      onCancel: () => {
        deleteKeyboard()
      }
    })
  },
  openTextKeyboard() {
    createKeyboard({
      inputType: inputType.CHAR,
      text: this.state.reminder.text || '',
      onComplete: (_kb, result) => {
        const value = ((result && result.data) || '').trim()
        this.state.reminder.text = value
        this.state.textBtn.setProperty(
          hmUI.prop.TEXT,
          value || getText('tapToEdit')
        )
        deleteKeyboard()
      },
      onCancel: () => {
        deleteKeyboard()
      }
    })
  },
  syncTimeButton() {
    if (!this.state.timeBtn) {
      return
    }
    this.state.timeBtn.setProperty(
      hmUI.prop.TEXT,
      formatTime(this.state.reminder.hour, this.state.reminder.minute)
    )
  },
  clearTimeEditor() {
    const widgets = this.state.timeEditorWidgets || []
    widgets.forEach((w) => {
      try {
        hmUI.deleteWidget(w)
      } catch (e) {
        // ignore
      }
    })
    this.state.timeEditorWidgets = []
    this.state.timeEditorOpen = false
    this.state.timeDisplay = null
  },
  bumpTime(field, delta) {
    if (field === 'hour') {
      this.state.reminder.hour = (this.state.reminder.hour + delta + 24) % 24
    } else {
      this.state.reminder.minute = (this.state.reminder.minute + delta + 60) % 60
    }
    if (this.state.timeDisplay) {
      this.state.timeDisplay.setProperty(
        hmUI.prop.TEXT,
        formatTime(this.state.reminder.hour, this.state.reminder.minute)
      )
    }
    this.syncTimeButton()
  },
  openTimePicker() {
    if (this.state.timeEditorOpen) {
      return
    }
    scrollTo({ y: 0 })
    this.state.timeEditorOpen = true
    this.state.timeEditorWidgets = []

    const add = (w) => {
      this.state.timeEditorWidgets.push(w)
      return w
    }

    add(
      hmUI.createWidget(hmUI.widget.FILL_RECT, {
        x: 0,
        y: 0,
        w: DEVICE_WIDTH,
        h: DEVICE_HEIGHT,
        color: 0x000000
      })
    )

    add(
      hmUI.createWidget(hmUI.widget.TEXT, {
        x: px(40),
        y: px(50),
        w: DEVICE_WIDTH - px(80),
        h: px(40),
        color: 0xffffff,
        text_size: px(30),
        align_h: hmUI.align.CENTER_H,
        text: getText('time')
      })
    )

    this.state.timeDisplay = add(
      hmUI.createWidget(hmUI.widget.TEXT, {
        x: px(40),
        y: px(120),
        w: DEVICE_WIDTH - px(80),
        h: px(70),
        color: 0xffffff,
        text_size: px(56),
        align_h: hmUI.align.CENTER_H,
        text: formatTime(this.state.reminder.hour, this.state.reminder.minute)
      })
    )

    const btnW = px(80)
    const btnH = px(64)
    const centerX = Math.floor(DEVICE_WIDTH / 2)

    const mkAdjustRow = (y, field, label) => {
      add(
        hmUI.createWidget(hmUI.widget.TEXT, {
          x: px(40),
          y: y - px(28),
          w: DEVICE_WIDTH - px(80),
          h: px(24),
          color: 0x888888,
          text_size: px(20),
          align_h: hmUI.align.CENTER_H,
          text: label
        })
      )
      add(
        hmUI.createWidget(hmUI.widget.BUTTON, {
          x: centerX - btnW - px(50),
          y,
          w: btnW,
          h: btnH,
          radius: px(32),
          normal_color: 0x333333,
          press_color: 0x444444,
          color: 0xffffff,
          text_size: px(34),
          text: '-',
          click_func: () => this.bumpTime(field, -1)
        })
      )
      add(
        hmUI.createWidget(hmUI.widget.BUTTON, {
          x: centerX + px(50),
          y,
          w: btnW,
          h: btnH,
          radius: px(32),
          normal_color: 0x333333,
          press_color: 0x444444,
          color: 0xffffff,
          text_size: px(34),
          text: '+',
          click_func: () => this.bumpTime(field, 1)
        })
      )
    }

    mkAdjustRow(px(210), 'hour', getText('hour'))
    mkAdjustRow(px(300), 'minute', getText('minute'))

    add(
      hmUI.createWidget(hmUI.widget.BUTTON, {
        x: px(40),
        y: px(390),
        w: DEVICE_WIDTH - px(80),
        h: px(56),
        radius: px(28),
        normal_color: 0x3d7eff,
        press_color: 0x5a92ff,
        color: 0xffffff,
        text_size: px(28),
        text: getText('done'),
        click_func: () => {
          this.syncTimeButton()
          this.clearTimeEditor()
        }
      })
    )
  },
  save() {
    const { reminder } = this.state
    if (!reminder.title || !reminder.title.trim()) {
      hmUI.showToast({ text: getText('textRequired') })
      return
    }
    if (!reminder.weekDays) {
      hmUI.showToast({ text: getText('daysRequired') })
      return
    }
    reminder.title = reminder.title.trim()
    delete reminder.emoji
    reminder.enabled = true
    reminder.alarmId = scheduleReminderAlarm(reminder)
    upsertReminder(reminder)
    if (!reminder.alarmId) {
      hmUI.showToast({ text: getText('alarmFailure') })
    } else {
      hmUI.showToast({ text: getText('saveSuccess') })
    }
    back()
  },
  remove() {
    const { reminder } = this.state
    cancelReminderAlarm(reminder)
    deleteReminder(reminder.id)
    hmUI.showToast({ text: getText('deleteSuccess') })
    back()
  }
})
