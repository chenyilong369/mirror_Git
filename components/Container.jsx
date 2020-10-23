import {cloneElement} from 'react'

const style = {
  width : '100%',
  maxWidth : 1200,
  marginLeft : 'auto',
  marginRight : 'auto',
  paddingLeft : 20,
  paddingRight : 20
}

// 用cloneElement来复用组件
export default ({children, renderer = <div/>}) => {
  return cloneElement(renderer, {
    style : Object.assign({}, renderer.props.style, style),
    children
    //<Comp style = {style}>{children}</Comp>
  })
}