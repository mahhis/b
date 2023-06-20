import {IsEmail, IsString} from "amala";

export default class typeEmail{
    @IsEmail()
    email!: string
}