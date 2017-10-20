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
      dispatchEvent({})
      console.log('catch click!!!', path)
    }
  }
}

function genViewHandle () {
  const viewItems = config.filter(({ type }) => type === 'view')
  const paths = viewItems.map(({ xpath }) => xpath)
  const viewed = new Set()
  return function (e) {
    paths
      .map(p => getElementOfXPath(p))
      .reduce((els, c) => els.concat(c))
      // 未触发过曝光事件 且 在可视区域内
      .filter(el => !viewed.has(el) && elementInViewport(el))
      .forEach((el) => {
        console.log('catch view!!!', el)
        dispatchEvent({})
        viewed.add(el)
      })
  }
}

;(function init () {
  setConfig(mockCfg)

  const handleClick = genClickHandle()
  document.body.addEventListener('click', handleClick, true)

  const handleView = genViewHandle()
  window.addEventListener('load', handleView)
  window.addEventListener('scroll', handleView)
})()
