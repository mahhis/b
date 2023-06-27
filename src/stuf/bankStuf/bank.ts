import env from '@/stuf/env'
import axios from "axios";
import bankData, {getBankData} from "@/stuf/bankStuf/bankData";
import {Order} from "@/models/order";

const $apiBank = axios.create({
    withCredentials: true,
    baseURL: env.BANK_API_URL
})


export async function bankTransfer(cardNumberGetter:string, bankName:string, amount:number ){
    try {
        const bankDataForTransfer:bankData = getBankData(bankName)
        const response =  await axios.post(`${env.BANK_API_URL}`, {bankDataForTransfer, cardNumberGetter, amount })
    } catch (e) {
        console.log('Some wrong')
    }
}


