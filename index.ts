
// @ts-nocheck

class Emitter {
  constructor() {
    this.events = new Map()
  }

  getEvents = () => this.events

  on = (type, fn) => {
    const handler = this.events.get(type)
    if (!handler) {
      this.events.set(type, fn)
    } else if (handler && typeof handler === 'function') {
      this.events.set(type, [handler, fn])
    } else {
      handler.push(fn)
    }
  }

  emit = (type, ...args) => {
    const handler = this.events.get(type)
    if (!handler) return
    if (Array.isArray(handler)) {
      for (let i = 0; i < handler.length; i += 1) {
        if (args.length > 0) {
          handler[i].apply(this, args)
        } else {
          handler[i].call(this)
        }
      }
    } else if (args.length > 0) {
      handler.apply(this, args)
    } else {
      handler.call(this)
    }
    return true
  }

  removeAll = () => {
    this.events = new Map()
  }

  remove = (type, fn) => {
    const handler = this.events.get(type)
    if (!handler) return
    if (typeof handler === 'function') {
      this.events.delete(type)
    } else if (Array.isArray(handler)) {
      let pos
      for (let i = 0; i < handler.length; i += 1) {
        if (handler[i] === fn) {
          pos = i
        } else {
          pos = -1
        }
      }
      if (pos !== -1) {
        handler.splice(pos, 1)
        if (handler.length === 1) {
          this.events.set(type, handler[0])
        }
      }
    }
  }
}

/**
 * 事件订阅发布
 * EventBus.instance.xx()单例
 */
Emitter.instance = (() => {
  let instance = null
  if (!instance) {
    instance = new Emitter()
  }
  return instance
})()

export { Emitter }

export default Emitter
