
/**
 * framework: egg（default）| koa | express
 */

const getApp = require('./app')
const bindRouters = require('./router')

module.exports = function (framework, runtimeMiddleware, config = {}) {
  const app = getApp(framework, runtimeMiddleware, config)
  return function (faasFolder) {
    bindRouters(app, faasFolder)
    return app
  }
}
