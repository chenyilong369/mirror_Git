const GITHUB_OAUTH_URL = 'https://github.com/login/oauth/authorize'
const SCOPE = 'user'
const client_id = '1f5cb3b67bd2f8adb457'
module.exports = {
  github: {
    request_token_url: 'https://github.com/login/oauth/access_token',
    client_id,
    client_secret: '35501a510b529bf3199e6b3f59fd5c2adebba2b3'
  },
  GITHUB_OAUTH_URL,
  OAUTH_URL: `${GITHUB_OAUTH_URL}?client_id=${client_id}&scope=${SCOPE}`
}