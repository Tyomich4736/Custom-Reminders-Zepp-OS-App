export function getScrollListDataConfig(length) {
  return [
    {
      start: 0,
      end: length,
      type_id: 1
    }
  ]
}

export function parseQuery(query = '') {
  const result = {}
  String(query)
    .split('&')
    .forEach((pair) => {
      const [key, value] = pair.split('=')
      if (key) {
        result[key] = value === undefined ? '' : value
      }
    })
  return result
}
