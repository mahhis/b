import env from "@/stuf/env";
import typeFullCardInfo from "@/stuf/types/typeFullCardInfo";
import {AxiosRequestConfig} from "axios";
const fetch = require('node-fetch');
export class Card {
    cardNumber:string;
    bankName:string;
    country:string;
    currency:string;
    constructor(cardNumber?: string, bankName?: string, country?: string, currency?: string) {
        this.cardNumber = cardNumber || '';
        this.bankName = bankName || '';
        this.country = country || '';
        this.currency = currency || '';
    }
}

export async function getCard(cardNumber:string):Promise<Card>{

    let cardBin = cardNumber.slice(0,6)

    const url = `${env.BIN_CHEKER_API_URL}?bin=${cardBin}`;
    const options = {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'X-RapidAPI-Key': env.BIN_CHEKER_API_KEY,
            'X-RapidAPI-Host': 'bin-ip-checker.p.rapidapi.com'
        },
        body: {bin: `${cardBin}`}
    };

    let card:Card = new Card(cardNumber);

    try {
        const response = await fetch(url, options);
        const data:typeFullCardInfo = await response.json();

        card.bankName = data.BIN.issuer.name
        card.country = data.BIN.country.name
        card.currency = data.BIN.currency
        return card;
    } catch (error) {
        console.error(error);
    }
    return card;
}
