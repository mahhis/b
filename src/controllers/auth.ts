import { Body, Controller, Ctx, Get, Post } from 'amala'
import { Context } from 'koa'
import { auth, refresh, checkEmail } from '@/models/user'
import typeAuth from '@/stuf/types/typeAuth'
import { badRequest } from '@hapi/boom'
import typeEmail from "@/stuf/types/typeEmail";

@Controller('auth')
export default class UserController {

    @Post('/')
    async auth(@Ctx() ctx: Context, @Body({ required: true }) {email, code} : typeAuth){
        try {
            const { user , accessToken}  = await auth(email, code);
            ctx.cookies.set('refreshToken', user.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly:true});
            return {
                user: user.strippedAndFilled({ withExtra: true }),
                accessToken
            }
        }catch (e){
            ctx.throw(badRequest())
        }

    }
    @Get('/refresh')
    async refresh(@Ctx() ctx: Context){
        try {
            const refreshToken = ctx.cookies.get('refreshToken')!
            const { user, accessToken}  = await refresh(refreshToken);
            ctx.cookies.set('refreshToken', user.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly:true});
            return {
                user: user.strippedAndFilled({ withExtra: true }),
                accessToken
            }
        }catch (e){
            ctx.throw(badRequest())
        }
    }
    @Post('/email')
    async checkEmail(@Ctx() ctx: Context, @Body({ required: true }) {email} : typeEmail){
        try {
            await checkEmail(email);
        }catch (e){
            ctx.throw(badRequest())
        }
    }
}

