module.exports = function getApp (framework, runtimeMiddleware) {
  const _framework = framework || 'koa'
  let app = null

  switch (_framework) {
    case 'egg':
      app = getEggApp()
      break
    case 'koa':
      app = getKoaApp()
      break
    default:
      app = getKoaApp()
  }
  app.framework = _framework
  app.runtime = runtimeMiddleware

  return app
}

function getKoaApp (config) {
  const Koa = require('koa')
  const app = new Koa()
  return app
}

function getEggApp (config) {
  const Application = require('egg-core').EggCore
  const app = new Application({
    // baseDir: process.cwd() + '/app'
  })

  return app
}
