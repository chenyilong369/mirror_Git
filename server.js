const Koa = require('koa')
const next = require('next')
const Router = require('koa-router')
const session = require('koa-session')
const Redis = require('ioredis')
const dev = process.env.NODE_ENV !== 'production' //  是否处于生产模式
const app = next({ dev })
const auth = require('./server/auth')
const koaBody = require('koa-body')

const handle = app.getRequestHandler() // 处理http
// 创建redis client
const redis = new Redis()
const RedisSessionStore = require('./server/sessionStolre')
const api = require('./server/api')
app.prepare().then(() => {
  // 预编译
  const server = new Koa()
  const router = new Router()

  server.keys = ['chen yilong developer']

  server.use(koaBody())
  const SESSION_CONFIG = {
    key : 'jid',
    store : new RedisSessionStore(redis),
  }

  server.use(session(SESSION_CONFIG, server))
  // 配置处理Oauth登录
  auth(server)
  api(server)

  server.use(async (ctx, next) => {
		// console.log(ctx.cookies.get('id'))
		// ctx.session = ctx.session || {}
		// ctx.session.user = {
		// 	'username': 'chen',
		// 	'age': 18
    // }
    
    // if(!ctx.session.user) {
    //   ctx.session.user = {
    //     name: 'chen',
    //     age: 18
    //   }
    // } else {
    console.log('session is:', ctx.session)
		await next()
	})

  router.get('/a/:id', async (ctx) => {
    const id = ctx.params.id
    await handle(ctx.req, ctx.res, {
      pathname: '/a',
      query: { id },
    })
    ctx.respond = false
    // 不再使用koa的默认处理
  })

  router.get('/api/user/info', async (ctx) => {
    // const id = ctx.params.id
    // await handle(ctx.req, ctx.res, {
    //   pathname: '/a',
    //   query: { id },
    // })
    // ctx.respond = false
    // 不再使用koa的默认处理
    const user = ctx.session.userInfo
    if(!user) {
      ctx.status = 401
      ctx.body = 'Need Login'
    } else{
      ctx.body = user
      ctx.set('Content-Type', 'application/json')
    }
  })

  router.get('/set/user', async (ctx) => {
    // ctx.respond = false
    ctx.session.user = {
      name: 'chen',
      age: 18
    }
    ctx.body = 'set session success'
  })

  router.get('/delete/user', async ctx => {
    ctx.session = null
    ctx.body = 'delete session success'
  })

  server.use(router.routes())

  server.use(async (ctx, next) => {
    // ctx.cookies.set('id', 'userid: xxxx')
    ctx.req.session = ctx.session
    await handle(ctx.req, ctx.res)
    ctx.respond = false
  })

  // server.use(async (ctx, next) => {
  //     const path = ctx.path //  获取 koa 的当前路径
  //     ctx.body = `koa middle ${path}`
  //     await next() // 使用await 调用next 来执行下一个 中间件
  // })

  // router.get('/test', (ctx) => {
  //     ctx.body = `<p>test</p>`
  // })

  //
  // server.use(async (ctx, next) => { //   后面的中间件会覆盖前面的中间件内容
  //     const method = ctx.method // 该网站的获取方法
  //     ctx.body = `123456 + ${method}`
  //     await next()
  // })

  server.listen(3000, () => {
    console.log('Koa is start 3000 port')
  })
})
