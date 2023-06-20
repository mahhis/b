import {getModelForClass, modelOptions, prop, Ref} from "@typegoose/typegoose";
import {User, UserModel} from "@/models/User";
import {Card, getCard} from "@/models/Card";

@modelOptions({ schemaOptions: { timestamps: true } })
export class Order{

    @prop({ index: true, ref: () => User })
    user?: Ref<User>

    @prop({ index: true})
    cardNumberSender!: string
    @prop({ index: true})
    nameBankSender?: string

    @prop({ index: true })
    cardNumberGetter!: string
    @prop({ index: true})
    nameBankGetter?: string

    @prop({ index: true})
    amount!: number
    @prop({index: true })
    isComplete?: boolean
}
export const OrderModel = getModelForClass(Order);

export async function createOrder(/*user?:User,*/ cardNumberSender:string, cardNumberGetter:string, amount:number){
   let cardSender = await getCard(cardNumberSender);
   let cardGetter =await getCard(cardNumberGetter);




 let order = OrderModel.create({cardNumberSender:cardNumberSender, cardNumberGetter:cardNumberGetter, amount:amount})

}