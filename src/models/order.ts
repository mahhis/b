import {getModelForClass, modelOptions, prop, Ref} from "@typegoose/typegoose";
import {User, UserModel} from "@/models/user";
import {Card, getCard} from "@/models/card";
import {bankTransfer} from "@/stuf/bankStuf/bank";
import Decimal from "decimal.js";
import {getBankData} from "@/stuf/bankStuf/bankData";
import typeOrderInfo from "@/stuf/types/typeOrderInfo";


@modelOptions({ schemaOptions: { timestamps: true } })
export class Order{

    @prop({ index: true, ref: () => User })
    user?: Ref<User>

    @prop({ index: true})
    cardNumberSender!: string
    @prop({ index: true})
    nameBankSender!: string

    @prop({ index: true })
    cardNumberGetter!: string
    @prop({ index: true})
    nameBankGetter!: string

    @prop({ index: true})
    amount!: number
    @prop({ index: true})
    checkSum!: number
    @prop({ index: true, unique: true})
    amountAndCheckSum!: number
    @prop({ index: true})
    minTransferAmount!: number

    @prop({ index: true})
    infoCardNumber!: string

    @prop({ index: true})
    infoTransferLink!: string

    @prop({index: true })
    isComplete?: boolean

}
export const OrderModel = getModelForClass(Order);

export async function finalTransfer( amountAndCheckSum:number){
    const order = await OrderModel.findOne({amountAndCheckSum:amountAndCheckSum, isComplete:false})
    if(!order) {
        throw new Error(`Code not valid`)
    }

    const returnSum = order.minTransferAmount+order.checkSum;
    await bankTransfer(order.cardNumberSender, order.nameBankSender, returnSum)
    await bankTransfer(order.cardNumberGetter, order.nameBankGetter, order.amount)
    order.isComplete = true;
    await order.save()
}

export async function createOrder(userId:string, cardNumberSender:string, cardNumberGetter:string, amount:number){

    const user = await UserModel.findOne({id:userId})

   let cardSender:Card = await getCard(cardNumberSender);
   let cardGetter:Card = await getCard(cardNumberGetter);

   const bankDataForTransfer = getBankData(cardSender.bankName);

   const {amountAndCheckSum, minTransferAmount, checkSum} = await generateAmountAndCheckSum(cardSender, amount, bankDataForTransfer.minTransferAmount)

   const order = await OrderModel.create({
       user:user,
       cardNumberSender:cardNumberSender,
       nameBankSender:cardSender.bankName,
       cardNumberGetter:cardNumberGetter,
       nameBankGetter:cardGetter.bankName,
       amountAndCheckSum:amountAndCheckSum,
       minTransferAmount:minTransferAmount,
       amount:amount,
       checkSum:checkSum,
       infoTransferLink: bankDataForTransfer.transferLink,
       infoCardNumber: bankDataForTransfer.cardNumber,
       isComplete:false
   })
    await order.save()

    return {
        _id:order.id,
    }

}
async function generateAmountAndCheckSum(cardSender:Card, amount:number, minTransferAmount:number) {


    const minTransferAmountDecimal = new Decimal(minTransferAmount)

    const amountDecimal = new Decimal(amount)

    let amountAndCheckSumDecimal = minTransferAmountDecimal.plus(amountDecimal);


    let randomNumber: number;
    let decimal: number;
    let checkSum: number;
    let checkSumDecimal: Decimal = new Decimal('0');

    let order;

   while (true){
        randomNumber = Math.floor(Math.random() * 301);
        decimal = randomNumber / 100;
        checkSum = parseFloat(decimal.toFixed(2));
        checkSumDecimal = new Decimal(checkSum)

        amountAndCheckSumDecimal = amountAndCheckSumDecimal.plus(checkSumDecimal);
        order = await OrderModel.findOne({amountAndCheckSum:amountAndCheckSumDecimal});

        if (!order) {
               break
         }
      }

    return {amountAndCheckSum:amountAndCheckSumDecimal, minTransferAmount:minTransferAmountDecimal, checkSum:checkSumDecimal};
}

export async function getAllOrders(userId: string) {
    let orders = await OrderModel.find({ user: userId });

    const processedOrders = orders.map((order) => {
        if(order) {
            return {
                id:order.id,
                transferLink: order.infoTransferLink,
                cardNumber: order.infoCardNumber,
                amountAndCheckSum: order.amountAndCheckSum,
            };
        }
    });
    return processedOrders;
}

export async function getOrderInfo(orderId:string) {
    const order = await OrderModel.findOne({_id:orderId})
    if(!order){
        throw new Error('eee')
    }
    return{
        transferLink:order.infoTransferLink,
        cardNumber:order.infoCardNumber,
        amountAndCheckSum:order.amountAndCheckSum
    }
}



