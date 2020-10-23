import createStore from '../store/store'
import React from 'react'

const isServer = typeof window === 'undefined'
const __NEXT_REDUX_STORE__ = '__NEXT_REDUX_STORE__'

function getOrCreateStore(initialState) {
  if (isServer) {
    return createStore(initialState)
  }

  if (!window[__NEXT_REDUX_STORE__]) {
    window[__NEXT_REDUX_STORE__] = createStore(initialState)
  }

  return window[__NEXT_REDUX_STORE__]
}

export default (Comp) => {
  class WithRedux extends React.Component {
    constructor(props) {
      super(props)
      this.reduxStore = getOrCreateStore(props.initialReduxState)
    }

    render() {
      const { Component, pageProps, ...rest } = this.props
      console.log(Component, pageProps)

      if (pageProps) {
        pageProps.test = '123'
      }

      return (
        <Comp
          Component={Component}
          pageProps={pageProps}
          {...rest}
          reduxStore={this.reduxStore}
        ></Comp>
      )
      
    }
  }

  // 该组件没有getInitialProps
  WithRedux.getInitialProps = async (ctx) => {
    let reduxStore

    if(isServer) {
      const {req} = ctx.ctx // 服务端渲染才存在
      const session = req.session

      if(session && session.userInfo) {
        reduxStore = getOrCreateStore({
          user: session.userInfo
          // user: {
          //   name: 'jokey',
          //   age: 18
          // }
        })
      } else {
        reduxStore = getOrCreateStore()
      }
    } else {
      reduxStore = getOrCreateStore()
    }

    ctx.reduxStore = reduxStore

    let appProps = {}
    if (typeof Comp.getInitialProps === 'function') {
      appProps = await Comp.getInitialProps(ctx)
    }

    
    return {
      ...appProps,
      initialReduxState: reduxStore.getState(),
    }
  }
  return WithRedux
}

// 接受组件作为参数并返回组件
