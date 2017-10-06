import viewHtml from './view.html'

const Doc = document

const cover = createCoverElement(Doc)
Doc.body.appendChild(cover)

cover.addEventListener('click', (e) => {
  cover.style.display = 'none'
  const target = Doc.elementFromPoint(e.clientX, e.clientY)
  target.style.border = '1px solid red'
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

function addRecord() {
  cover.style.display = 'block'
}

(function initView() {
  const fragment = Doc.createElement('div')
  fragment.innerHTML = viewHtml
  Doc.body.insertBefore(fragment, Doc.body.firstChild)
  Doc.querySelector('.add-track').addEventListener('click', () => {
    addRecord()
  })
})()
