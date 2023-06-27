import {OrderModel} from "@/models/order";

export const BELINVEST = {
                                login: 'belinlog', password: 'belinpas',
                                cardNumber:'1111 1111 1111 1111', data:'11/11', code3:111,
                                minTransferAmount:3,
                                transferLink:'https://ibank.belinvestbank.by/cards/transfer'};
export const PRIORBANK = {
                                login: 'priorlog', password: 'priorpas',
                                cardNumber:'2222 2222 2222 2222', data:'22/22', code3:222,
                                minTransferAmount:1,
                                transferLink:'https://www.prior.by/web/Cabinet/Transfers/TransferCardNumber/' };
export const BELARUSBANK = {
                                login: 'belbklog', password: 'belbkpas',
                                cardNumber:'3333 3333 3333 3333', data:'33/33', code3:333,
                                minTransferAmount:2.6,
                                transferLink:'1' };
export const ALFABANK = {
                                login: 'alfalog', password: 'alfapas',
                                cardNumber:'4444 4444 4444 4444', data:'44/44', code3:444,
                                minTransferAmount:1,
                                transferLink:'2' };
export const VTBBANK = {
                                login: 'vtblog', password: 'vtbpas',
                                cardNumber:'5555 5555 5555 5555', data:'55/5', code3:555,
                                minTransferAmount:1000,
                                transferLink:'3' };

export default class bankData{
    login!: string
    password!: string

    cardNumber!: string
    data!: string
    code3!: number

    minTransferAmount!:number
    transferLink!:string
}

export function getBankData(bankName:string):bankData{

    switch (bankName){
        case 'BELARUSSIAN BANK OF DEVELOPMENT AND RECONSTRUCTION BELINVESTBANK JSC':
            return BELINVEST
        case 'PRIORBANK JSCB':
            return PRIORBANK
        case 'Alfa Bank':
            return ALFABANK
        case 'VTB Bank':
            return VTBBANK
        case 'Belarus Bank':
            return BELARUSBANK
        default:
            throw new Error(`Invalid bank name: ${bankName}`);
    }

}