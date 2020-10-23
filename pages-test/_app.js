import '../styles/globals.css'
import App, {Container} from 'next/app'
import  'antd/dist/antd.css'
import Layout from '../components/Layout.jsx'
import React from "react";


// 自定义APP
class MyApp extends App {
  // 这里必须写一个静态方法,以代表全局发送了getInitialProps
  static async getInitialProps({Component, ctx}) {
    console.log('app init')
    let pageProps
    if(Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }
    return {
      pageProps
    }
  }
  render() {
    const {Component, pageProps} = this.props
    console.log(Component);
    // Component指的是pages下面的所有页面的总和
    return (
      <Container> 
        {/*发送给子组件*/}
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Container>
    )
  }
}

export default MyApp
