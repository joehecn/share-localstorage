/* global chrome location */

;((name, definition) => {
  typeof module !== 'undefined'
    ? module.exports = definition()
    : typeof define === 'function' && typeof define.amd === 'object'
      ? define(definition)
      : this[name] = definition()
})('shareLocalstorage', () => {
  'use strict'

  const global = typeof window === 'object' ? window : this
  if (!global.HTMLElement) console.warn('share-localstorage is meant to run on browsers main thread')

  const shareLocalstorage = {
    version: { full: '1.0.0', major: 1, minor: 0, dot: 0 },
    src: 'https://joehecn.github.io/sso/page2.html?version=1.0.0',
    jEvent: null,
    channel: null,
    iframe: null,
    init,
    destory,
    getItem,
    setItem,
    removeItem
  }

  /**
   * 生成一个不重复的ID
   */
  function uuid(){
    return Number(Math.random().toString().substr(3, 4) + Date.now()).toString(36)
  }

  // Handle messages received on port1
  function onMessage(e) {
    console.log(e.data)
    const data = JSON.parse(e.data)

    if (data.id && shareLocalstorage.jEvent) {
      shareLocalstorage.jEvent.emit(data.id, data)
    }
  }

  /**
   * create a hidden iframe and append it to the DOM (body)
   *
   * @param  {string} src page to load
   * @return {HTMLIFrameElement} page to load
   */
  function init (src) {
    return new Promise(resolve => {
      if (typeof src === 'string') shareLocalstorage.src = src
  
      const channel = new MessageChannel()
      channel.port1.onmessage = onMessage
  
      // 事件总线对象
      const jEvent = {
        eventMap: {},
        // 触发事件
        emit (event, ...params) {
          const fun = this.eventMap[event]
          if (fun) {
            fun(params)
          }
          delete this.eventMap[event]
        },
        // 注册一次性事件
        once (event, callback) {
          this.eventMap[event] = callback
        },
        // 移除事件
        off (event) {
          if (event) {
            delete this.eventMap[event]
            return
          }
  
          // 移除所有事件
          this.eventMap = {}
        },
      }
  
      const iframe = document.createElement('iframe')
      iframe.hidden = true
      iframe.src = shareLocalstorage.src
      iframe.loaded = false
      iframe.name = 'iframe-share-localstorage'
      iframe.isIframe = true
      document.body.appendChild(iframe)
  
      shareLocalstorage.channel = channel
      shareLocalstorage.jEvent = jEvent
      shareLocalstorage.iframe = iframe
  
      iframe.addEventListener('load', () => {
        iframe.loaded = true
        resolve()
      }, { once: true })
    })
  }

  function destory () {
    shareLocalstorage.channel = null

    shareLocalstorage.jEvent.off()
    shareLocalstorage.jEvent = null

    document.body.removeChild(shareLocalstorage.iframe)
    shareLocalstorage.iframe = null
  }

  function getItem (keyName) {
    return new Promise(resolve => {
      const id = uuid()
      shareLocalstorage.jEvent.once(id, resolve)

      shareLocalstorage.iframe.contentWindow.postMessage(JSON.stringify({
        id, method: 'getItem', keyName
      }), '*', [shareLocalstorage.channel.port2])
    })
  }

  function setItem (keyName, keyValue) {
    return new Promise(resolve => {
      const id = uuid()
      shareLocalstorage.jEvent.once(id, resolve)

      shareLocalstorage.iframe.contentWindow.postMessage(JSON.stringify({
        id, method: 'setItem', keyName, keyValue
      }), '*', [shareLocalstorage.channel.port2])
    })
  }

  function removeItem (keyName) {
    return new Promise(resolve => {
      const id = uuid()
      shareLocalstorage.jEvent.once(id, resolve)

      shareLocalstorage.iframe.contentWindow.postMessage(JSON.stringify({
        id, method: 'removeItem', keyName
      }), '*', [shareLocalstorage.channel.port2])
    })
  }

  return shareLocalstorage
})
