import ctrlNav from './html/ctrl-nav.html'
import ctrlMenu from './html/ctrl-menu.html'
import { htmlToElement } from './utils'
import './html/ctrl.css'

const Doc = document

const cover = createCoverElement(Doc)
Doc.body.appendChild(cover)

cover.addEventListener('click', (e) => {
  e.preventDefault()
  e.stopPropagation()

  cover.style.display = 'none'
  const target = Doc.elementFromPoint(e.clientX, e.clientY)
  target.classList.add('ctrl--selected')

  const { top, left } = target.getBoundingClientRect()
  const menu = createMenu()
  target.appendChild(menu)
  menu.style.top = top
  menu.style.left = left
})

function createCoverElement() {
  const e = Doc.createElement('div')
  e.id = 'cover'
  e.style.display = 'none'
  e.style.position = 'fixed'
  e.style.top = e.style.bottom = e.style.left = e.style.right = 0
  e.style.backgroundColor = 'red'
  e.style.opacity = 0.2
  return e
}

function createMenu() {
  const menu = htmlToElement(ctrlMenu)

  menu.querySelector('#ctrl-menu-remove')
    .addEventListener('click', function() {
      this.parentNode.parentNode.classList.remove('ctrl--selected')
      this.parentNode.remove()

  return menu
}

(function initView() {
  Doc.body.insertAdjacentHTML('afterbegin', ctrlNav)
  Doc.querySelector('.add-track').addEventListener('click', () => {
    cover.style.display = 'block'
  })
})()
