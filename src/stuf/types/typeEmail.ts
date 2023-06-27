import {IsEmail} from "amala";

export default class typeEmail{
    @IsEmail()
    email!: string
}