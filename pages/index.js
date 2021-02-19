import axios from 'axios'
import { Button, Tabs } from 'antd'
import { useEffect } from 'react'
import getConfig from 'next/config'
import { connect } from 'react-redux'
import Router, { withRouter } from 'next/router'
import { StarTwoTone, MailFilled } from '@ant-design/icons'
import Repo from '../components/Repo'
import LRU from 'lru-cache'
import {cacheArray} from '../lib/repo-basic-cache'
const { publicRuntimeConfig } = getConfig()

let cacheUserRepos, cacheUserStaredRepos

const isServer = typeof window === 'undefined'

const cache = new LRU({
  maxAge: 1000 * 10,
})

const api = require('../lib/api')
function Index({ userRepo, userStartt, user, router }) {
  console.log(userRepo, userStartt, user)
  const tabKey = router.query.key || '1'

  const handleChange = (activeKey) => {
    Router.push(`/?key=${activeKey}`)
  }
  // 缓存更新
  useEffect(() => {
    if (!isServer) {
      // cacheUserRepos = userRepo
      // cacheUserStaredRepos = userStartt
      if (userRepo) {
        cache.set('userRepo', userRepo)
      }
      if (userStartt) {
        cache.set('userStartt', userStartt)
      }
    }
  }, [userRepo, userStartt])

  useEffect(() => {
    if (!isServer) {
      cacheArray(userRepo)
      cacheArray(userStartt)
    }
  })

  if (!user || !user.id) {
    return (
      <div className='root'>
        <p>亲, 请先登录</p>
        <Button type='primary' href={publicRuntimeConfig.OAUTH_URL}>
          点击登录
        </Button>
        <style jsx>
          {`
            .root {
              height: 400px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
            }
          `}
        </style>
      </div>
    )
  }
  return (
    <div className='root'>
      <div className='user-info'>
        <img src={user.avatar_url} alt='user avator' className='avatorName' />
        <span className='login'>{user.login}</span>
        <span className='name'>{user.name}</span>
        <span className='bio'>{user.bio}</span>
        <p className='email'>
          <MailFilled style={{ marginRight: 10 }} />
          <a href={`mailto:${user.email}`}>{user.email}</a>
        </p>
      </div>
      <div className='user-repos'>
        <Tabs activeKey={tabKey} onChange={handleChange} animated={false}>
          <Tabs.TabPane tab='你的仓库' key={1}>
            {userRepo.map((repo) => (
              <Repo repo={repo} key={repo.id} />
            ))}
          </Tabs.TabPane>
          <Tabs.TabPane tab='你所关注的仓库' key={2}>
            {userStartt.map((repo) => (
              <Repo repo={repo} key={repo.id} />
            ))}
          </Tabs.TabPane>
        </Tabs>
      </div>
      <style jsx>
        {`
          .root {
            display: flex;
            align-items: flex-start;
            padding: 20px 0;
          }
          .user-info {
            width: 200px;
            margin-right: 40px;
            display: flex;
            flex-shrink: 0;
            flex-direction: column;
          }
          .user-info img {
            height: 200px;
            border-radius: 50%;
          }
          .login {
            font-weight: 800;
            font-size: 20px;
            margin-top: 20px;
          }
          .name {
            font-size: 16px;
            color: #777;
          }
          .bio {
            margin-top: 20px;
            color: #333;
          }
        `}
      </style>
    </div>
  )
}

// 必须要是在不是服务端时才可以缓存, 不应该缓存在服务端中
Index.getInitialProps = async ({ ctx, reduxStore }) => {
  // const result = await axios.get('/github/search/repositories?q=react')
  //   .then(res => console.log(res)) // 这里建议不要直接用github原网站地址

  const user = reduxStore.getState().user
  if (!user || !user.id) {
    return {
      isLogin: false,
    }
  }

  if (!isServer) {
    if (cache.get('userRepo') && cache.get('userStartt')) {
      return {
        isLogin: true,
        userRepo: cache.get('userRepo'),
        userStartt: cache.get('userStartt'),
      }
    }
  }
  //console.log(user)
  const userRepos = await api.request(
    {
      url: '/user/repos', // 获取仓库
    },
    ctx.req,
    ctx.res
  )

  const userStartted = await api.request(
    {
      url: '/user/starred', // 获取关注仓库
    },
    ctx.req,
    ctx.res
  )

  return {
    isLogin: true,
    userRepo: userRepos.data,
    userStartt: userStartted.data,
  }
}

export default withRouter(
  connect(function mapStateToProps(state) {
    return {
      user: state.user,
    }
  })(Index)
)
