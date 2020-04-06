import './env'
import Koa from 'koa'
import json from 'koa-json'
import logger from 'koa-logger'
import router from './server/routes/config.js'
import path from 'path'
import serve from 'koa-static'
import historyApiFallback from 'koa2-history-api-fallback'
import koaBodyparser from 'koa-bodyparser'
const jwt = require('koa-jwt');
const cors = require('koa2-cors')
const tokenError = require('./server/api/token');
const app = new Koa()

app.use(tokenError());
app.use(koaBodyparser())
app.use(json())
app.use(logger())

app.use(async function (ctx, next) {
  let start = new Date()
  await next()
  let ms = new Date() - start
  console.log('%s %s - %s', ctx.method, ctx.url, ms)
})

app.use(cors({
  origin: function (ctx) {
      return "*"
        // if (ctx.url === '/test') {
        //     return "*"; // 允许来自所有域名请求
        // }
        // return 'http://127.0.0.1:8080'; //这样就能只允许 http://localhost:8080 这个域名的请求了
  },
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  maxAge: 5,
  credentials: true,
  allowMethods: ['GET', 'POST', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}))


app.on('error', function (err, ctx) {
  console.log('server error', err)
})

app.use(router.routes()) // 将路由规则挂载到Koa上。
app.use(historyApiFallback())
app.use(serve(path.resolve('dist'))) // 将webpack打包好的项目目录作为Koa静态文件服务的目录
app.use(serve(path.resolve('public')))

export default app.listen(4000, () => {
  console.log(`Koa is listening in 4000`)
})
