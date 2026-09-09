import { statSync, writeFileSync as writeFile, readFileSync as readFile } from '@zos/fs'
import { REMINDERS_FILE_NAME } from './constants'

export function readFileSync() {
  try {
    const fStat = statSync({ path: REMINDERS_FILE_NAME })
    if (!fStat) {
      return []
    }
    const resData = readFile({
      path: REMINDERS_FILE_NAME,
      options: {
        encoding: 'utf8'
      }
    })
    if (!resData) {
      return []
    }
    const parsed = JSON.parse(resData)
    return Array.isArray(parsed) ? parsed : []
  } catch (e) {
    return []
  }
}

export function writeFileSync(data) {
  writeFile({
    path: REMINDERS_FILE_NAME,
    data: JSON.stringify(data || []),
    options: {
      encoding: 'utf8'
    }
  })
}
