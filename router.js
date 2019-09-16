const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const cwd = process.cwd()
const yamlFile = path.join(cwd, './f.yaml')

module.exports = function bindRouters (app, folder) {
  switch (app.framework) {
    case 'egg':
      // egg
      bindEggRouter(app, folder)
      break
    case 'koa':
      // koa
      bindKoaRouter(app, folder)
      break
    default:
      // 默认
      bindKoaRouter(app, folder)
  }
}

function bindEggRouter (app, folder) {
  const { router } = app
  const content = getYamlConfig(yamlFile)
  for (const k in content.functions) {
    const func = content.functions[k]
    bindRouterHandler(app, folder, func, router)
  }
}

function bindKoaRouter (app, folder) {
  const Router = require('koa-router')
  const router = new Router()
  const content = getYamlConfig(yamlFile)
  for (const k in content.functions) {
    const func = content.functions[k]
    bindRouterHandler(app, folder, func, router)
  }
  app
    .use(router.routes())
    .use(router.allowedMethods())
}

function bindRouterHandler (app, folder, func, router) {
  const http = func.events[0].http
  const handler = path.join(cwd, folder + func.handler.replace('entry.', ''))
  http.method.forEach(element => {
    router[element.toLowerCase()](http.path, app.runtime, require(handler))
  })
}

function getYamlConfig (yamlFile) {
  // Get document, or throw exception on error
  try {
    const doc = yaml.safeLoad(fs.readFileSync(yamlFile, 'utf8'))
    return doc
  } catch (e) {
    console.log('getYamlConfig error' + e)
  }
}
