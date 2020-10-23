const axios = require('axios')

const isServer = typeof window === 'undefined'
const base_github = "https://api.github.com"
async function requestGithub (method, url, data, headers) {
  console.log(isServer)
  return await axios({
    method, url : `${base_github}${url}`, data, headers
  })
}



async function request({method = 'GET', url, data = {}}, req, res) {
  if(!url) {
    throw Error('url must provide')
  }

  // 服务端
  if(isServer) {
    const session = req.session
    const githubAuth = session.githubAuth || {}
    const headers = {}
    if (githubAuth.access_token) {
      headers['Authorization'] = `${githubAuth.token_type} ${githubAuth.access_token}`
    }
    return await requestGithub(method, url, data, headers)
  } else {
    return await axios({
      method, 
      url: `/github${url}`,
      data
    })
  }
}

module.exports = {
  request,
  requestGithub
}