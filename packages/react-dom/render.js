import { setAttribute } from './dom'
function renderDom(vnode, container) {
  if (vnode === undefined || vnode === null || typeof vnode === 'boolean')
    vnode = ''

  if (typeof vnode === 'number') vnode = String(vnode)

  if (typeof vnode === 'string') {
    const textNode = document.createTextNode(vnode)
    return textNode
  }

  const dom = document.createElement(vnode.tag)

  if (vnode.attrs) {
    Object.keys(vnode.attrs).forEach((key) => {
      const value = vnode.attrs[key]
      setAttribute(dom, key, value)
    })
  }
  // 渲染 children
  if (vnode.children) {
    vnode.children.forEach((child) => render(child, dom))
  }

  return dom
}
// 创建 Component
function createComponent(Component, props) {}
export function renderComponent(Component) {}

export function render(vnode, container) {
  return container.appendChild(renderDom(vnode))
}
