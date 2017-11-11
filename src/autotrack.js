import { getElementXPath, getElementOfXPath, elementInViewport } from './utils'
import mockCfg from './mock/track-config'

const subscribers = new Set([])
const config = []

export function setConfig (cfg) {
  config.push(...cfg)
}

export function subscribe (fn) {
  if (typeof fn === 'function') {
    subscribers.add(fn)
    return () => {
      subscribers.delete(fn)
    }
  }
  return () => {}
}

export function dispatchEvent (e) {
  subscribers.forEach(fn => {
    fn(e)
  })
}

function genClickHandle () {
  const clickItems = config.filter(({ type }) => type === 'click')
  return function (e) {
    const path = getElementXPath(e.target)
    const cfgData = clickItems.find(({ xpath }) => xpath === path)
    if (cfgData) {
      dispatchEvent({
        name: cfgData.name,
        type: 'click',
        // index: /[(\d+)]$/.exec(xpath)
        custom: captureCustomData(e.target, cfgData.custom)
      })
      console.log('catch click!!!', cfgData)
    }
  }
}

function genViewHandle () {
  const viewItems = config.filter(({ type }) => type === 'view')
  const viewed = new Set()
  // fixme: 无法捕获在当前页面动态插入dom元素的曝光事件 mock：/html/body/section/ul/li[5]
  return function (e) {
    viewItems.forEach(({ xpath, custom, name }) => {
      getElementOfXPath(xpath)
        .filter(el => !viewed.has(el) && elementInViewport(el))
        .forEach((el) => {
          console.log('catch view!!!', el)
          dispatchEvent({
            name,
            type: 'view',
            // index: /[(\d+)]$/.exec(xpath)
            custom: captureCustomData(el, custom)
          })
          viewed.add(el)
        })
    })
  }
}

// TODO: 采集需要的业务字段
function captureCustomData (el, fields) {

}

;(function init () {
  setConfig(mockCfg)

  const handleClick = genClickHandle()
  document.body.addEventListener('click', handleClick, true)

  const handleView = genViewHandle()
  window.addEventListener('load', handleView)
  window.addEventListener('scroll', handleView)
})()
