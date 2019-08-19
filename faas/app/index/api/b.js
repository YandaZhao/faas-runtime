module.exports = function (ctx, next) {
  console.log('bbb')
  ctx.body = {
    json: 'bbbb'
  }
}
