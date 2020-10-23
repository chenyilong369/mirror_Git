import Link from 'next/link'
import { Button, Layout, Input, Avatar, Tooltip, Dropdown, Menu } from 'antd'
import { GithubFilled, UserAddOutlined } from '@ant-design/icons'
import React, { useState, useCallback, cloneElement } from 'react'
import Container from './Container'
import getConfig from 'next/config'
import { connect } from 'react-redux'
import {logout} from '../store/store'
import axios from 'axios'
import {withRouter} from 'next/router'
const { publicRuntimeConfig } = getConfig()


// 集合全部的路由
function LayOut({ children, user, logout, router }) {
  const urlQuery = router.query && router.query.query 
  const [search, setSearch] = useState(urlQuery || '')

  const handleSearchChange = useCallback(
    (e) => {
      setSearch(e.target.value)
    },
    [setSearch]
  )

  const handleOnSearch = useCallback(() => {
    router.push(`search?query=${search}`)
  }, [search])

  const Comp = ({ color, children, style }) => <div style={{ color, ...style }}>{children}</div>

  const githubIconStyle = {
    color: 'white',
    fontSize: 40,
    display: 'block',
    paddingTop: 12,
    marginRight: 20,
  }

  const footerStyle = {
    height: 50,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }

  const handleLogout = useCallback(() => {
    logout()
  }, [logout])

  const handleGoToOauth = useCallback((e) => {
    e.preventDefault() // 取消默认
    axios.get(`/prepare-auth?url=${router.asPath}`)
      .then(res => {
        if(res.status === 200) {
          location.href = publicRuntimeConfig.OAUTH_URL
        } else {
          console.log('failed')
        }
      }).catch (err => {
        console.log(err)
      })
  }, [])

  const { Header, Footer, Content } = Layout
  const userDropDown = (
    <Menu>
      <Menu.Item>
        <a href="javascript:void(0)" onClick={handleLogout}>
          登 出
        </a>
      </Menu.Item>
    </Menu>
  )

  return (
    <Layout>
      <Header>
        <Container renderer={<div className='header-inner' />}>
          <div className='header-left'>
            <div className='logo'>
              <Link href="/">
                <GithubFilled style={githubIconStyle} />
              </Link>
            </div>
            <div>
              <Input.Search
                placeholder='搜索仓库'
                value={search}
                onChange={handleSearchChange}
                onSearch={handleOnSearch}
              /> 
            </div>
          </div>
          <div className='header-right'>
            <div className='user'>
              {user && user.id ? (
                <Dropdown overlay={userDropDown}>
                  <a href='/'>
                    <Avatar size={40} src={user.avatar_url} />
                  </a>
                </Dropdown>
              ) : (
                <Tooltip title='点击进行登录'>
                  <a href={`/prepare-auth?url=${router.asPath}`} > 
                    <Avatar size={40} icon={<UserAddOutlined />} />
                  </a>
                </Tooltip>
              )}
            </div>
          </div>
        </Container>
      </Header>
      <Content>
        <Container>{children}</Container>
      </Content>
      <Footer style={footerStyle}>Develop by jschen</Footer>

      <style jsx>
        {`
          .header-inner {
            display: flex;
            justify-content: space-between;
          }
          .header-left {
            display: flex;
            justify-content: flex-start;
          }
        `}
      </style>
      <style jsx global>{`
        #__next {
          height: 100%;
        }
        .ant-layout {
          min-height: 100%;
        }
        .ant-layout-header {
          padding-left: 0;
          padding-right: 0;
        }
        .ant-layout-content {
          background: #fff;
        }
      `}</style>
    </Layout>
  )
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(logout())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(LayOut))
