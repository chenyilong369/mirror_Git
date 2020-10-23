import '../styles/globals.css'
import App, { Container } from 'next/app'
import 'antd/dist/antd.css'
import LayOut from '../components/LayOut.jsx'
import React from 'react'
import { Provider } from 'react-redux'
import withRedux from '../lib/with-redux'
import Pageloading from '../components/Pageloading'
import Router from 'next/router'
import Link from 'next/link'
import axios from 'axios'


// 自定义APP
class MyApp extends App {
  // 这里必须写一个静态方法,以代表全局发送了getInitialProps
  static async getInitialProps(ctx) {
    const { Component } = ctx
    console.log('app init')
    let pageProps
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }
    return {
      pageProps,
    }
  }

  state = {
    loading: false,
  }

  startLoading = () => {
    this.setState({
      loading: true,
    })
  }

  stopLoading = () => {
    this.setState({
      loading: false,
    })
  }

  componentDidMount() {
    Router.events.on('routeChangeStart', this.startLoading)
    Router.events.on('routeChangeComplete', this.stopLoading)
    Router.events.on('routeChangeeError', this.stopLoading)

  }

  componentWillUnmount() {
    Router.events.off('routeChangeStart', this.startLoading)
    Router.events.off('routeChangeComplete', this.stopLoading)
    Router.events.off('routeChangeeError', this.stopLoading)
  }
  render() {
    const { Component, pageProps, reduxStore } = this.props
    console.log(Component)
    // Component指的是pages下面的所有页面的总和
    return (
      <Container>
        {/*发送给子组件*/}

        <Provider store={reduxStore}>
          {this.state.loading ? <Pageloading /> : null}
          <LayOut>
            <Component {...pageProps} />
          </LayOut> 
        </Provider>
      </Container>
    )
  }
}

export default withRedux(MyApp)
