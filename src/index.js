import { detect } from './utils/detect'
import TadaWithIntersectionObserver from './intersection-observer'
import TadaWithLegacy from './legacy'

const tada = {
  setup (config) {
    const defaults = {
      attribute: 'data-src',
      delay: 50,
      threshold: '20%'
    }
    this.config = { ...defaults, config }
    this.useIntersectionObserver = detect()

    if (this.useIntersectionObserver) {
      this.instance = new TadaWithIntersectionObserver(this.config)
    } else {
      this.instance = new TadaWithLegacy(this.config)
    }
  },
  check () {
    if (!this.instance) {
      this.setup()
    }
  },
  add (element) {
    this.check()
    this.instance.add(element)
  },
  addContainer (element) {
    this.check()
    !this.useIntersectionObserver && this.instance.addContainer(element)
  },
  run () {
    this.check()
    !this.useIntersectionObserver && this.instance.run()
  }
}

export default tada
