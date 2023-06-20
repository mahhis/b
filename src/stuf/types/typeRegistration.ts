import { IsEmail, IsString } from 'amala'

export default class typeRegistration {
    @IsEmail()
    email!: string

    @IsString()
    password!: string

    @IsString()
    activationCode!: string
}
