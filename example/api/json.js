function handler (ctx, next) {
  ctx.body = {
    foo: 'bar'
  }
}

module.exports = {
  handler
}
