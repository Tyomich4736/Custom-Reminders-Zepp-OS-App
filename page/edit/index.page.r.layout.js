import * as hmUI from '@zos/ui'
import { getText } from '@zos/i18n'
import { getDeviceInfo } from '@zos/device'
import { px } from '@zos/utils'

export const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = getDeviceInfo()

export const PAGE_TITLE = {
  x: px(40),
  y: px(40),
  w: DEVICE_WIDTH - px(80),
  h: px(40),
  color: 0xffffff,
  text_size: px(30),
  align_h: hmUI.align.CENTER_H
}

export const ROW_Y = {
  title: px(100),
  text: px(175),
  time: px(250),
  days: px(325),
  actions: px(420)
}

/** Extra space past the last control so free-scroll can move past the fold */
export const PAGE_BOTTOM = ROW_Y.actions + px(66) + px(56) + px(40)

export const LABEL_STYLE = {
  x: px(40),
  w: DEVICE_WIDTH - px(80),
  h: px(28),
  color: 0x888888,
  text_size: px(22),
  align_h: hmUI.align.LEFT
}

export const VALUE_BUTTON = {
  x: px(40),
  w: DEVICE_WIDTH - px(80),
  h: px(52),
  radius: px(26),
  normal_color: 0x333333,
  press_color: 0x444444,
  color: 0xffffff,
  text_size: px(28)
}

export const WEEKDAY_BTN = {
  w: px(52),
  h: px(52),
  radius: px(26),
  text_size: px(20)
}

export const SAVE_BUTTON = {
  x: px(40),
  y: ROW_Y.actions,
  w: DEVICE_WIDTH - px(80),
  h: px(56),
  radius: px(28),
  normal_color: 0x1a7a4c,
  press_color: 0x23965d,
  color: 0xffffff,
  text_size: px(28)
}

export const DELETE_BUTTON = {
  x: px(40),
  y: ROW_Y.actions + px(66),
  w: DEVICE_WIDTH - px(80),
  h: px(56),
  radius: px(28),
  normal_color: 0x8b2e2e,
  press_color: 0xa93838,
  color: 0xffffff,
  text_size: px(28)
}
