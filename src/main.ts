
import { version } from '../package.json'

const global = typeof window === 'object' ? window : this
if (!global.HTMLElement) console.warn('share-localstorage is meant to run on browsers main thread')

let _src = 'https://joehecn.github.io/sso/page2.html?version=v10'
let _iframe = null

// 事件总线对象
const _jEvent = {
  eventMap: {},
  // 触发事件
  emit (event, params) {
    const callback = this.eventMap[event]
    if (callback) {
      callback(params)
      delete this.eventMap[event]
    }
  },
  // 注册一次性事件
  once (event, callback) {
    this.eventMap[event] = callback
  },
  // 移除事件
  off (event?) {
    if (event) {
      this.eventMap[event] && delete this.eventMap[event]
      return
    }

    // 移除所有事件
    this.eventMap = {}
  },
}

const _uuid = () => {
  return Number(Math.random().toString().substr(3, 4) + Date.now()).toString(36)
}

const _onMessage = e => {
  const data = JSON.parse(e.data)

  if (data.id) {
    _jEvent.emit(data.id, data)
  }
}

const _method = (method, keyName, keyValue?) => {
  return new Promise((resolve, reject) => {
    const id = _uuid()

    if (_iframe === null) {
      reject({ id, code: 1000, message: 'iframe is not ready!' })
      return
    }

    _jEvent.once(id, data => {
      data.message ?
        reject(data):
        resolve(data)
    })

    const channel = new MessageChannel()
    channel.port1.onmessage = _onMessage

    _iframe.contentWindow.postMessage(JSON.stringify({
      id, method, keyName, keyValue
    }), '*', [channel.port2])
  })
}

const init = (src?) => {
  console.log('--- 1')
  return new Promise(resolve => {
    if (typeof src === 'string') _src = src

    const iframe = document.createElement('iframe')

    iframe.addEventListener('load', () => {
      iframe['loaded'] = true
      console.log('--- 3')
      resolve(undefined)
    }, { once: true })

    iframe.hidden = true
    iframe.src = _src
    iframe.name = 'iframe-share-localstorage'
    iframe['loaded'] = false
    iframe['isIframe'] = true
    document.body.appendChild(iframe)

    _iframe = iframe

    console.log('--- 2', _iframe)
  })
}

const destory = () => {
  _jEvent.off()

  document.body.removeChild(_iframe)
  _iframe = null
}

const getItem = keyName => {
  return _method('getItem', keyName)
}

const setItem = (keyName, keyValue) => {
  return _method('setItem', keyName, keyValue)
}

const removeItem = keyName => {
  return _method('removeItem', keyName)
}

export default {
  version,
  init,
  destory,
  getItem,
  setItem,
  removeItem
}
