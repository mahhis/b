import {Body, Controller, Ctx, Params, Get, Post} from "amala";
import {Context} from "koa";
import {badRequest} from "@hapi/boom";
import typeOrder from "@/stuf/types/typeOrder";
import {createOrder, finalTransfer, getAllOrders, getOrderInfo} from "@/models/order";


@Controller('order')
export default class OrderController {

    @Post('/create')
    async createOrder(@Ctx() ctx: Context, @Body({required: true}) {
        userId,
        cardNumberSender,
        cardNumberGetter,
        amount
    }: typeOrder) {
        try {
           return  await createOrder(userId, cardNumberSender, cardNumberGetter, amount)
        } catch (e) {
            ctx.throw(badRequest())
        }
    }

    @Get('/orders/:id')
    async getAllOrders(@Params('id') id: string, @Ctx() ctx: Context) {
        try {
            const orders = await getAllOrders(id)
            return  {
                orders: orders
            }
        } catch (e) {
            ctx.throw(badRequest())
        }
    }

    @Get('/info/:id')
    async getOrderInfo(@Params('id') id: any, @Ctx() ctx: Context) {
        try {
            return  await getOrderInfo(id)
        } catch (e) {
            ctx.throw(badRequest())
        }
    }


    @Post('/sms')
    async receiveSMSConfirmation(@Ctx() ctx: Context, @Body({required: true}) {SMS}: any) {
        try {
            const regex = /[0-9]+\.[0-9]+/;
            const match = SMS.match(regex);
            if (match) {
                const amountAndCheckSum = parseFloat(match[0]);
                await finalTransfer(amountAndCheckSum)
            }
        } catch (e) {
            ctx.throw(badRequest())
        }
    }
}
