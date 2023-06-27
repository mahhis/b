import {IsEmail, IsString} from "amala";

export default class typeAuth{
    @IsEmail()
    email!: string
    @IsString()
    code!: string
}