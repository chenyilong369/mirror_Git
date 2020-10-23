function Detail() {
  return (
    <span>detail</span>
  )
}

Detail.getInitialProps = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({})
    }, 1000)
  })
}

export default Detail