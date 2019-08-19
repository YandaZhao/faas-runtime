
/**
 * framework: egg（default）| koa | express
 */

const getApp = require('./app')
const bindRouters = require('./router')

module.exports = function (framework, runtimeMiddleware) {
  const app = getApp(framework, runtimeMiddleware)

  return function (faasFolder) {
    // mount functions with router
    // faasFolder/f.yaml
    bindRouters(app, faasFolder)

    return app
  }
}
