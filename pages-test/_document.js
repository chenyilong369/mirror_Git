import Document, {Html, Head, Main, NextScript} from 'next/document'
import React from "react";
import {ServerStyleSheet} from 'styled-components'

class MyDocument extends Document {

  // static async getInitialProps(ctx) {
  //   const originalRenderPage = ctx.renderPage
  //   const sheet = new ServerStyleSheet()
  //   try {
  //     ctx.renderPage = () => {
  //       originalRenderPage({
  //         enhanceApp: App => (props) => sheet.collectStyles(<App {...props}/>)
  //       })
  //     }
  //     const props = await Document.getInitialProps(ctx)
  //     return {
  //       ...props,
  //       styles: (
  //         <div>
  //           {props.styles}
  //           {sheet.getStyleElement()}
  //         </div>
  //       ),
  //     }
  //   } finally {
  //     sheet.seal()
  //   }
  // }
  render() {
    return (
      <Html>
        <Head>
        </Head>
        <body className = "test">
          <Main/>
          <NextScript/>
        </body>
      </Html>
    )
  }
}

export default MyDocument
