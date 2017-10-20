/**
 * @param {String} HTML representing a single element
 * @return {Element}
 */
export function htmlToElement (html) {
  var template = document.createElement('template')
  template.innerHTML = html
  return template.content.firstChild
}

/**
 * 递归获取节点的XPath  XPath由id、标签名、索引构成
 * @param  {Element} element element
 * @return {string}         element XPath表达式
 */
export function getElementXPath (element) {
  if (!element) return null

  if (element.id) {
    return `//*[@id=${element.id}]`
  } else if (element.tagName === 'BODY') {
    return '/html/body'
  } else {
    const sameTagSiblings = Array.from(element.parentNode.childNodes)
      .filter(e => e.nodeName === element.nodeName)
    const idx = sameTagSiblings.indexOf(element)

    return getElementXPath(element.parentNode) +
      '/' +
      element.tagName.toLowerCase() +
      (sameTagSiblings.length > 1 ? `[${idx + 1}]` : '')
  }
}

/**
 * 通过xpath获取dom元素
 * @param  {string} xpath path
 * @return {Array}       所有匹配的dom元素
 */
export function getElementOfXPath (xpath) {
  const rs = []
  const headings = document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null)
  let thisHeading = headings.iterateNext()
  while (thisHeading) {
    rs.push(thisHeading)
    thisHeading = headings.iterateNext()
  }
  return rs
}

/**
 * 元素是否在可见区域中
 * @param  {Element} el dom元素
 * @return {boolean}
 */
export function elementInViewport (el) {
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
