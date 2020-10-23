
import { Button } from 'antd'
import { withRouter } from 'next/router'
import Link from 'next/link'
import dynamic from "next/dynamic";
import styled from "styled-components"
import React from "react";
// import moment from 'moment'

const Title = styled.h1`
  color: yellow;
  font-size: px;
`

const Comp = dynamic(import('../components/comp'))

const A = ({ router, name, time }) => {
  //console.log(router.query.id)
  return (
    <>
      <Title>{time}</Title>
      <Comp />
      <Link href="#aaa">
        <a>
          A { router.query.id }
          {name}
        </a>
      </Link>
    </>
  )
}

// 只有在pages下面的才会调用getInitialProps
A.getInitialProps = async () => {
  const moment = await import('moment')
  const promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        name: 'joy',
        time: moment.default(Date.now() - 60 * 1000).fromNow()
      })
    }, 1000)
  })

  return await promise
}

export default withRouter(A)