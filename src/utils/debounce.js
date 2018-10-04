export default function debounce (method, delay) {
  if (delay <= 0) {
    return method
  }

  let timer

  return function () {
    if (timer) {
      clearTimeout(timer)
    }

    timer = setTimeout(method, delay)
  }
}
