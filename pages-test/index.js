import store from '../store/store'
import {connect} from 'react-redux'
import {add} from '../store/store'
import getConfig from 'next/config'
import {useEffect} from 'react'
import axios from 'axios'

const {publicRuntimeConfig} = getConfig()
const Index = ({count, username, add, rename}) => {
  useEffect(() => {
    axios.get('/api/user/info').then(res => console.log(res))
  }, [])

  return (
    <div>
      <div>count: {count}</div>
      <div>username: {username}</div>
      <input value={username} onChange={(e) => rename(e.target.value)} />
      <button onClick={() => add(count)} >To Add</button>
      <a href={publicRuntimeConfig.OAUTH_URL}>登录</a>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    count: state.counter.count,
    username: state.user.username
  }
}

Index.getInitialProps = async({reduxStore}) => {
  reduxStore.dispatch(add(3))
}

const mapDispatchToProps = dispatch => {
  return {
    add: (num) => dispatch({type: 'ADD', num}),
    rename: (name) => dispatch({type: 'UPDATE_USERNAME', name})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Index)

