const App = require('..')('koa', async function (ctx, next) {
  await next()
})

const app = new App('./')

app.listen(3000, () => {
  console.log('server is listening on http://localhost:3000')
})
