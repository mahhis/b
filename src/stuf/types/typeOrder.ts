import {IsNumber, IsString} from "amala";

export default class typeOrder {
    @IsString()
    cardNumberSender!: string

    @IsString()
    cardNumberGetter!: string

    @IsNumber()
    amount!: number
}
