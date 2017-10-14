export function getNodePath(el) {
  const getAllParent = (node, ps) => {
    ps.push(node.tagName)
    return node.tagName === 'HTML' ? ps : getAllParent(node.parentNode, ps)
  }

  return getAllParent(el, []).reverse().map(tagName => tagName.toLowerCase()).join(' ')
}

/**
 * @param {String} HTML representing a single element
 * @return {Element}
 */
export function htmlToElement(html) {
    var template = document.createElement('template');
    template.innerHTML = html;
    return template.content.firstChild;
}
