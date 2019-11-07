const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const cwd = process.cwd()

let content

module.exports = function bindRouters (app, folder) {
  const yamlFile = path.join(cwd, folder, './f.yml')
  content = getYamlConfig(app, yamlFile)
  app.framework === 'egg' ? bindEggRouter(app, folder) : bindKoaRouter(app, folder)
}

function bindEggRouter (app, folder) {
  const { router } = app
  for (const k in content.functions) {
    const func = content.functions[k]
    bindRouterHandler(app, folder, func, router)
  }
}

function bindKoaRouter (app, folder) {
  const Router = require('koa-router')
  const router = new Router()
  for (const k in content.functions) {
    const func = content.functions[k]
    bindRouterHandler(app, folder, func, router)
  }
  app
    .use(router.routes())
    .use(router.allowedMethods())
}

function bindRouterHandler (app, folder, func, router) {
  // handler = api.user.handler
  const http = func.events[0].http
  const handlerArr = func.handler.split('.')
  const handerFunc = handlerArr.pop()
  const handlerPath = path.join(cwd, folder, handlerArr.join('/'))
  const handler = app.faasConfig.globalRouter ? app.faasConfig.globalRouter : require(handlerPath)[handerFunc]
  http.method.forEach(element => {
    console.log(`\x1B[32m 绑定路由: ${element.toLowerCase()} ${http.path} \x1B[39m`)
    router[element.toLowerCase()](http.path, app.runtime, handler)
  })
}

function getYamlConfig (app, yamlFile) {
  // Get document, or throw exception on error
  try {
    const content = yaml.safeLoad(fs.readFileSync(yamlFile, 'utf8'))
    const routes = getRoutesAndFuncMappingObject(content)
    app.use(async (ctx, next) => {
      ctx.routes = routes
      await next()
    })
    return content
  } catch (e) {
    console.log('getYamlConfig error' + e)
  }
}
function getRoutesAndFuncMappingObject (content) {
  const obj = {}
  for (const functionName in content.functions) {
    const func = content.functions[functionName]
    const http = func.events[0].http

    obj[http.path] = {
      name: functionName,
      method: http.method
    }
  }
  return obj
}
