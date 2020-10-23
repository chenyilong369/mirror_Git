import React, {useState, useEffect, useReducer} from 'react'

function countReducer(state, action) {
  switch (action.type) {
    case 'add':
      return state + 1
    case 'minis':
      return state - 1
    default:
      return state
  }
}

function MyCountFunc() {
  //const [count, setCount] = useState(0) // 返回一个数组
  const [count, dispatchCount] = useReducer(countReducer, 0)
  useEffect(() => {
    const interval = setInterval(() => {
      //setCount(c => c + 1)
      dispatchCount({type: 'add'})
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return <span>{count}</span>
}

export default MyCountFunc