const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const compose = require('koa-compose')
const requireDir = require('require-dir')
const cwd = process.cwd()

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
  const yamlFile = path.join(cwd, './f.yaml')
  const content = getYamlConfig(yamlFile)
  for (const k in content.functions) {
    const func = content.functions[k]
    func.obj = {}
    const http = func.events[0].http
    http.method.forEach(element => {
      router[element.toLowerCase()](http.path, app.runtime, require(path.join(path.join(cwd, folder) + '/', func.handler.replace('entry.', '').replace(/\./g, '/'))))
    })
  }
}

function bindKoaRouter (app, folder) {
  const files = fs.readdirSync(path.join(cwd, folder))
  const Router = require('koa-router')
  const router = new Router()

  for (const idx in files) {
    const file = files[idx]

    if (file.indexOf('.') === -1) {
      const dir = requireDir(path.join(cwd, folder + '/' + file), { recurse: true })
      const yamlFile = path.join(cwd, folder + '/' + file + '/f.yaml')

      const content = getYamlConfig(yamlFile)
      for (const k in content.functions) {
        const func = content.functions[k]
        func.obj = dir
        const http = func.events[0].http

        http.method.forEach(element => {
          router[element.toLowerCase()](http.path, compose([app.runtime, processMiddleware(func)]))
        })
      }
    }
  }

  app
    .use(router.routes())
    .use(router.allowedMethods())
}

function getYamlConfig (yamlFile) {
  // Get document, or throw exception on error
  try {
    const doc = yaml.safeLoad(fs.readFileSync(yamlFile, 'utf8'))
    return doc
  } catch (e) {
    console.log(e)
  }
}

function processMiddleware (func) {
  const key = func.handler.replace('entry.', '')
  const get = require('get-value')

  return get(func.obj, key)
}
