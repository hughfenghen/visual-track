import { getNodePath } from './utils'
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
    const elPath = getNodePath(e.target)
    const cfgData = clickItems.find(({ nodePath }) => nodePath === elPath)
    if (cfgData) {
      dispatchEvent({})
      console.log('catch click!!!', elPath)
    }
  }
}

function genViewHandle () {
  const viewItems = config.filter(({ type }) => type === 'view')
  const paths = viewItems.map(({ nodePath }) => nodePath)
  return function (e) {
    paths
      .map(p => [p, document.querySelector(p)])
      .filter(([path, el]) => el && elementInViewport(el))
      .forEach(([path, el]) => {
        dispatchEvent({})
        // 节点曝光后应当删除 避免触发多次曝光事件
        const idx = paths.findIndex(p => p === path)
        paths.splice(idx, 1)
        console.log('catch view!!!', e)
      })
  }
}

function elementInViewport (el) {
  let top = el.offsetTop
  let left = el.offsetLeft
  const width = el.offsetWidth
  const height = el.offsetHeight

  while (el.offsetParent) {
    el = el.offsetParent
    top += el.offsetTop
    left += el.offsetLeft
  }

  return (
    top < window.pageYOffset + window.innerHeight &&
    left < window.pageXOffset + window.innerWidth &&
    top + height > window.pageYOffset &&
    left + width > window.pageXOffset
  )
}

;(function init () {
  setConfig(mockCfg)

  const handleClick = genClickHandle()
  document.body.addEventListener('click', handleClick, true)
  // document.body.addEventListener('touchstart', handleClick, true)

  const handleView = genViewHandle()
  document.addEventListener('load', handleView)
  document.addEventListener('scroll', handleView)
})()
