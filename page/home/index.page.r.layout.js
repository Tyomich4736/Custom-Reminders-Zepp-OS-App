import * as hmUI from '@zos/ui'
import { getText } from '@zos/i18n'
import { getDeviceInfo } from '@zos/device'
import { px } from '@zos/utils'

export const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = getDeviceInfo()

export const TITLE_TEXT_STYLE = {
  text: getText('appTitle'),
  x: px(42),
  y: px(50),
  w: DEVICE_WIDTH - px(42 * 2),
  h: px(46),
  color: 0xffffff,
  text_size: px(34),
  align_h: hmUI.align.CENTER_H,
  text_style: hmUI.text_style.ELLIPSIS
}

export const ADD_BUTTON = {
  x: Math.floor((DEVICE_WIDTH - px(88)) / 2),
  y: DEVICE_HEIGHT - px(100),
  w: px(88),
  h: px(88),
  normal_src: 'add.png',
  press_src: 'add.png'
}

export const TIPS_TEXT_STYLE = {
  text: getText('noData'),
  x: px(30),
  y: px(120),
  w: DEVICE_WIDTH - px(30 * 2),
  h: px(200),
  color: 0x999999,
  text_size: px(28),
  align_h: hmUI.align.CENTER_H,
  align_v: hmUI.align.CENTER_V,
  text_style: hmUI.text_style.WRAP
}

export const SCROLL_LIST = {
  item_height: px(110),
  item_space: px(10),
  item_config: [
    {
      type_id: 1,
      item_bg_color: 0x2a2a2a,
      item_bg_radius: px(20),
      text_view: [
        {
          x: px(20),
          y: px(12),
          w: DEVICE_WIDTH - px(30 * 2) - px(64),
          h: px(48),
          key: 'title',
          color: 0xffffff,
          text_size: px(32),
          align_h: hmUI.align.LEFT
        },
        {
          x: px(20),
          y: px(60),
          w: DEVICE_WIDTH - px(30 * 2) - px(64),
          h: px(36),
          key: 'schedule',
          color: 0xaaaaaa,
          text_size: px(24),
          align_h: hmUI.align.LEFT
        }
      ],
      text_view_count: 2,
      image_view: [
        {
          x: DEVICE_WIDTH - px(30 * 2) - px(52),
          y: px(35),
          w: px(40),
          h: px(40),
          key: 'img_src',
          action: true
        }
      ],
      image_view_count: 1,
      item_height: px(110)
    }
  ],
  item_config_count: 1,
  x: px(30),
  y: px(110),
  h: DEVICE_HEIGHT - px(110) - px(120),
  w: DEVICE_WIDTH - px(30) * 2
}
