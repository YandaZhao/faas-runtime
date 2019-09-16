module.exports = function getApp (framework, runtimeMiddleware, config = {}) {
  const _framework = framework || 'koa'
  let app = null

  switch (_framework) {
    case 'egg':
      app = getEggApp(config)
      break
    case 'koa':
      app = getKoaApp(config)
      break
    default:
      app = getKoaApp(config)
  }
  app.framework = _framework
  app.runtime = runtimeMiddleware

  return app
}

function getKoaApp (config) {
  const Koa = require('koa')
  const app = new Koa(config)
  return app
}

function getEggApp (config) {
  const Application = require('egg-core').EggCore
  const app = new Application(config)
  return app
}
