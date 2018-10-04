import debounce from '../utils/debounce'

class Tada {
  constructor (config) {
    this.config = config
    this.elements = []
  }

  setup (options) {
    if (this.initialized) {
      throw new Error('"setup" should be called before other methods.')
    }

    for (let key in options || {}) {
      this.config[key] = options[key]
    }
  }

  init () {
    if (this.initialized) {
      return
    }

    this.initialized = true

    this.applyDebounce()
    this.calcViewport()
    this.calcThreshold()
    this.bindEvents()
  }

  applyDebounce () {
    this.run = debounce(this.prepare.bind(this), this.config.delay)
  }

  calcViewport () {
    this.viewportHeight = window.innerHeight || document.documentElement.clientHeight
    this.viewportWidth = window.innerWidth || document.documentElement.clientWidth
  }

  calcThreshold () {
    let matches = this.config.threshold.toString().trim().match(/^(\d+)\s*(px|%)?$/i)

    if (!matches || !matches.length) {
      throw new Error('"threshold" value should be a number or "px" or "%".')
    }

    let value = matches[1]
    let unit = matches[2]

    if (unit === '%') {
      this.thresholdHeight = Math.floor(this.viewportHeight * value / 100)
      this.thresholdWidth = Math.floor(this.viewportWidth * value / 100)
    } else {
      this.thresholdHeight = this.thresholdWidth = value
    }
  }

  bindEvents () {
    window.addEventListener('scroll', this.onScroll.bind(this), false)
    window.addEventListener('resize', this.onResize.bind(this), false)
  }

  onScroll () {
    this.run()
  }

  onResize () {
    this.calcViewport()
    this.calcThreshold()
    this.run()
  }

  add (element) {
    this.init()

    if (typeof element === 'string') {
      let nodes = document.querySelectorAll(element)

      for (let i = 0, length = nodes.length; i < length; ++i) {
        this.addElement(nodes[i])
      }
    } else {
      this.addElement(element)
    }

    this.run()
  }

  addElement (element) {
    if (this.elements.indexOf(element) >= 0) {
      return
    }

    if (this.used(element)) {
      return
    }

    this.elements.push(element)
  }

  used (element) {
    let src = element.getAttribute(this.config.attribute)

    if (element.tagName === 'IMG') {
      if (element.getAttribute('src') === src) {
        return true
      }
    } else {
      if (element.style.backgroundImage === `url(${src})`) {
        return true
      }
    }

    return false
  }

  prepare () {
    let elements = this.elements.slice()

    for (let i = 0, length = elements.length; i < length; ++i) {
      let element = elements[i]

      if (!this.valid(element)) {
        continue
      }

      this.show(element)
    }
  }

  valid (element) {
    if (this.hidden(element)) {
      return false
    }

    let rect = element.getBoundingClientRect()
    let top = rect.top >= -this.thresholdHeight && rect.top <= this.viewportHeight + this.thresholdHeight
    let bottom = rect.bottom >= -this.thresholdHeight && rect.bottom <= this.viewportHeight + this.thresholdHeight
    let left = rect.left >= -this.thresholdWidth && rect.left <= this.viewportWidth + this.thresholdWidth
    let right = rect.right >= -this.thresholdWidth && rect.right <= this.viewportWidth + this.thresholdWidth

    return (top || bottom) && (left || right)
  }

  hidden (element) {
    return window.getComputedStyle(element).display === 'none'
  }

  show (element) {
    let src = element.getAttribute(this.config.attribute)

    if (element.tagName === 'IMG') {
      element.setAttribute('src', src)
    } else {
      element.style.backgroundImage = `url(${src})`
    }

    element.removeAttribute(this.config.attribute)

    this.elements.splice(this.elements.indexOf(element), 1)

    if (typeof this.config.callback === 'function') {
      this.config.callback(element)
    }
  }

  addContainer (selector) {
    if (!this.initialized) {
      this.init()
    }

    document.querySelectorAll(selector).forEach(element => {
      element.addEventListener('scroll', this.run)
    })
  }
}

export default Tada
