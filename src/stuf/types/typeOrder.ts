import {IsNumber, IsString} from "amala";

export default class typeOrder {

    @IsString()
    userId!: string

    @IsString()
    cardNumberSender!: string

    @IsString()
    cardNumberGetter!: string

    @IsNumber()
    amount!: number
}
