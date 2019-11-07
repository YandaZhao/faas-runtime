const userInfo = {
  1: '用户1',
  2: '用户2'
}

function handler (ctx, next) {
  ctx.body = userInfo[ctx.params.id]
}

module.exports = {
  handler
}
