class Tada {
  constructor (config) {
    this.config = config
    this.init()
  }

  init () {
    this.observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(this.execute.bind(this))
    }, {
      rootMargin: this.config.threshold
    })
  }

  add (element) {
    if (typeof element === 'string') {
      let nodes = document.querySelectorAll(element)

      for (let i = 0, length = nodes.length; i < length; ++i) {
        this.observer.observe(nodes[i])
      }
    } else {
      this.observer.observe(element)
    }
  }

  execute (entry) {
    if (!entry.isIntersecting) {
      return
    }

    const target = entry.target
    const tagName = target.tagName
    const src = target.getAttribute(this.config.attribute)

    if (tagName === 'IMG') {
      target.setAttribute('src', src)
    } else {
      target.style.backgroundImage = `url(${src})`
    }

    target.removeAttribute(this.config.attribute)
    this.observer.unobserve(target)

    if (typeof this.config.callback === 'function') {
      this.config.callback(target)
    }
  }
}

export default Tada
