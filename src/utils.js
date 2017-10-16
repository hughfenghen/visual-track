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
    return '//*[@id="' + element.id + '"]'
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
