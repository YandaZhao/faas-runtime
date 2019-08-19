# faas-runtime


- 支持koa（https://github.com/pillarjs/path-to-regexp）
- 支持egg（https://eggjs.org/zh-cn/advanced/loader.html#%E6%89%A9%E5%B1%95-loader）


## Install

```
$ npm i --save faas-runtime
```

## Examples

app.js

```
const App = require('faas-runtime')('egg', function (ctx, next) {
  ctx.rpc = function () {
    console.log('rpc')
  }

  console.log('before')
  return next().then(function () {
    console.log('next')
  })
})

const app = new App('./faas/app')

app.listen(3000)
```

