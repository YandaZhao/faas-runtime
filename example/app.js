const App = require('..')('egg', function (ctx, next) {
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
