import { template } from 'lodash'
import ctrlNav from './html/ctrl-nav.html'
import ctrlMenu from './html/ctrl-menu.html'
import editModalHtml from './html/edit-modal.html'
import { htmlToElement, getElementXPath } from './utils'
import './html/ctrl.css'

const Doc = document

const cover = createCoverElement(Doc)
Doc.body.appendChild(cover)

cover.addEventListener('click', (e) => {
  e.preventDefault()
  e.stopPropagation()

  cover.style.display = 'none'
  // 新增埋点时，覆盖层拦截点击事件 通过坐标转换成目标元素
  const target = Doc.elementFromPoint(e.clientX, e.clientY)

  pickElement(target)
})

const nav = htmlToElement(ctrlNav)
nav.querySelector('.add-track')
  .addEventListener('click', () => {
    cover.style.display = 'block'
  })
Doc.body.insertBefore(nav, Doc.body.firstChild)

// 创建一个覆盖层元素
function createCoverElement () {
  const e = Doc.createElement('div')
  e.id = 'cover'
  e.style.display = 'none'
  e.style.position = 'fixed'
  e.style.top = e.style.bottom = e.style.left = e.style.right = 0
  e.style.backgroundColor = 'red'
  e.style.opacity = 0.2
  return e
}

// 选择一个元素， 高亮、并绑定相关操作按钮
function pickElement (target) {
  const menu = htmlToElement(ctrlMenu)

  target.classList.add('ctrl-element--selected')

  // 操作按钮添加到body后面，位置与目标元素对应
  const { top, left } = target.getBoundingClientRect()
  Doc.body.appendChild(menu)
  menu.style.top = top
  menu.style.left = left

  menu.querySelector('#ctrl-menu-remove')
    .addEventListener('click', function () {
      target.classList.remove('ctrl-element--selected', 'ctrl-element--actived')
      menu.remove()
    })

  menu.querySelector('#ctrl-menu-add')
    .addEventListener('click', function () {
      const editModal = htmlToElement(
        template(editModalHtml)({ optionalAttr: snifferData(target) })
      )

      editModal.querySelector('input[type=submit]')
        .addEventListener('click', () => { submit(target, editModal) })
      editModal.querySelector('button[name=cancel]')
        .addEventListener('click', () => { editModal.remove() })

      Doc.body.appendChild(editModal)
    })
}

function submit (target, editModal) {
  const form = editModal.querySelector('form')
  const { event_name, event_type, custom } = form.elements

  console.log({
    name: event_name.value,
    xpath: getElementXPath(target),
    type: Array.from(event_type).filter(e => e.checked).map(e => e.value),
    custom: Array.from(custom).filter(e => e.checked).map(e => e.value)
  })

  target.classList.remove('ctrl-element--selected')
  target.classList.add('ctrl-element--actived')
  editModal.remove()
}

function snifferData (el) {
  const rs = {}
  Object.entries(el.dataset)
    .filter(([k]) => k.startsWith('track'))
    .forEach(([k, v]) => {
      // 替换掉track，首字母小写
      let key = k.replace(/^track/, '')
      key = key[0].toLowerCase() + key.slice(1)
      rs[ key ] = v
    })

  // TODO: 为各种标签配置默认属性
  switch (el.tagName) {
    case 'A':
      rs.href = el.getAttribute('href')
      rs.text = el.innerHTML
      break
    case 'SPAN':
    case 'P':
      rs.text = el.innerHTML
      break
    case 'IMG':
      rs.src = el.getAttribute('src')
  }

  return rs
}
