import {IsString} from "amala";

export default class typeOrder {
    @IsString()
    infoTransferLink!: string

    @IsString()
    infoCardNumber!: string
}