const bindRouters = require('./router')

module.exports = function getApp (framework, runtimeMiddleware, config = {}) {
  const app = framework === 'egg' ? getEggApp(config) : getKoaApp(config)

  app.framework = framework
  app.runtime = runtimeMiddleware
  app.faasConfig = config

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
