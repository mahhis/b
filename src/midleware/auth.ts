import { Context, Next } from 'koa'
import { UserModel } from '@/models/user'
import { badRequest, notFound } from '@hapi/boom'
import { TokenType, verify } from '@/stuf/jwt'

export default async function authorize(ctx: Context, next: Next) {
  let userToken = ctx.headers.authorization;
  if (!userToken) {
    return ctx.throw(badRequest())
  }
  userToken = userToken.split(' ')[1]
  if (!userToken || typeof userToken !== 'string' || userToken == 'null') {
    return ctx.throw(badRequest())
  }


  let payload;
  try {
    payload = verify(userToken, TokenType.ACCESS)
  } catch (err) {
    return ctx.throw(badRequest())
  }

  const user = await UserModel.findById(payload.id)
  if (!user) {
    return ctx.throw(notFound())
  }
  ctx.state.user = user
  return next()
}