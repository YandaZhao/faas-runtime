# faas-runtime

- 支持koa（https://github.com/pillarjs/path-to-regexp）
- 支持egg（https://eggjs.org/zh-cn/advanced/loader.html#%E6%89%A9%E5%B1%95-loader）

## Install

```
$ npm i --save faas-runtime
```

## yml 文件规范

``` yml
functions:
  json: ## 方法名
    handler: api.json.handler ## 函数名
    events:
      - http:
          path: / ## 请求路径
          method: ## 支持的方法
            - GET
  user:
    handler: api.user.handler
    events:
      - http:
          path: /user/:id
          method:
            - GET
            - POST
```

## 如何使用

```js
const App = require('faas-runtime')('egg', function (ctx, next) {
  ctx.rpc = function () {
    console.log('rpc')
  }
  console.log('before')
  return next().then(function () {
    console.log('next')
  })
})

const app = new App('./')

app.listen(3000, () => {
  console.log('server is listening on http://localhost:3000')
})

```

## Examples

测试用例

```js
$ cd example && node app.js
$ open http://localhost:3000/
$ open http://localhost:3000/user/1
```
