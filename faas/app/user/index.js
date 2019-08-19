module.exports = function (ctx, next) {
  ctx.body = {
    json: 'user/' + ctx.params.id
  }
}
