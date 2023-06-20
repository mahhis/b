import { Body, Controller, Ctx, Flow, Get, Params, Post } from 'amala'
import { Context } from 'koa'
import { login, logout, registration, refresh, activateUser } from '@/models/User'
import typeLogin from '@/stuf/types/typeLogin'
import authorize from '@/midleware/auth'
import { badRequest } from '@hapi/boom'
import env from '@/stuf/env'
import typeRegistration from "@/stuf/types/typeRegistration";
import typeEmail from "@/stuf/types/typeEmail";


@Controller('auth')
export default class UserController {

    @Post('/registration')
    async registration(@Ctx() ctx: Context, @Body({ required: true }) {email, password, activationCode} : typeRegistration){
        try {
            const { user , accessToken}  = await registration(email, password, activationCode);
            ctx.cookies.set('refreshToken', user.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly:true});
            return {
                user: user.strippedAndFilled({ withExtra: true }),
                accessToken
            }
        }catch (e){
            ctx.throw(badRequest())
        }

    }

    @Post('/login')
    async login(@Ctx() ctx: Context, @Body({ required: true }) {email, password} : typeLogin){
        try {
            console.log(2)
            const { user, accessToken}  = await login(email, password);
            ctx.cookies.set('refreshToken', user.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly:true});
            return {
                user: user.strippedAndFilled({ withExtra: true }),
                accessToken
            }
        }catch (e){
            ctx.throw(badRequest())
        }

    }

    @Post('/logout')
    async logout(@Ctx() ctx: Context){
        try {
            await logout(ctx.cookies.get('refreshToken')!);
            ctx.cookies.set('refreshToken','')
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

  /*  @Get('/all')
    @Flow([authorize])
    async getAll(@Ctx() ctx: Context){
        try {
            const users = getAllUsers();
            return users
        }catch (e){
            ctx.throw(badRequest())
        }
    }*/
    @Post('/activate')
    async activate(@Ctx() ctx: Context, @Body({ required: true }) {email} : typeEmail){
        try {
            await activateUser(email);
        }catch (e){
            ctx.throw(badRequest())
        }
    }
}

