import { statSync, writeFileSync as writeFile, readFileSync as readFile } from '@zos/fs'

import { REMINDERS_FILE_NAME } from './constants'

const fStat = statSync({
  path: this.fileName
})
if (fStat) {
  const resData = readFile({
    path: REMINDERS_FILE_NAME,
    options: {
      encoding: 'utf8'
    }
  })
  return !resData ? [] : JSON.parse(resData)
} else {
  return []
}

export function writeFileSync(data, merge = true) {
  let params = data
  if (merge) {
    params = [...readFile(), ...data]
  }
  writeFile({
    path: REMINDERS_FILE_NAME,
    data: JSON.stringify(params),
    options: {
      encoding: 'utf8'
    }
  })
}
