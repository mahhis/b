import {Body, Controller, Ctx, Post} from "amala";
import {Context} from "koa";
import typeRegistration from "@/stuf/types/typeRegistration";
import {badRequest} from "@hapi/boom";
import typeOrder from "@/stuf/types/typeOrder";
import {createOrder} from "@/models/Order";


@Controller('order')
export default class OrderController {

    @Post('/make')
    async registration(@Ctx() ctx: Context, @Body({required: true}) {
        cardNumberSender,
        cardNumberGetter,
        amount
    }: typeOrder) {
        try {
            console.log(1)
            await createOrder( cardNumberSender, cardNumberGetter, amount)

        } catch (e) {
            ctx.throw(badRequest())
        }

    }
}
