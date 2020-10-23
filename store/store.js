import {createStore, combineReducers, applyMiddleware} from 'redux'
import ReduxThunk from 'redux-thunk'
import axios from 'axios'

const LOGOUT = 'LOGOUT'
const userInitialState = {} 


// 纯粹的方法, 无副作用

function userReducer(state = userInitialState, action) {
  switch (action.type) {
    case LOGOUT: {
      return {}
    }
    default: return state
  }
}

// 整合reducer
const allReducer = combineReducers({
  user : userReducer
})

const store = createStore(allReducer, applyMiddleware(ReduxThunk))
//console.log(store.getState())

//console.log(store.getState())

// 返回最新的变化, 监听store事件
store.subscribe(() => {
  console.log(store.getState())
})

// // 创建action 
// export function add(num) {
//   return {
//     type: ADD,
//     num,
//   }
// }

// // 异步action
// function addAsync(num) {
//   return (dispatch) => {
//     setTimeout(() => {
//       dispatch(add(num))
//     }, 1000)
//   }
// }

export function logout() {
  return dispatch => {
    axios.post('/logout').then(res => {
      if(res.status === 200) {
        dispatch({
          type: LOGOUT
        })
      } else {
        console.log('logout failed',res)
      }
    }).catch(err => {
      console.log('logout failed', err)
    })
  }
}

export default function initializeStore(state) {
  const store = createStore(allReducer,  
    Object.assign({}, {
      user: userInitialState
    },state),
    applyMiddleware(ReduxThunk))
  //console.log(store.getState())
  return store
} 