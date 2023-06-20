import { IsEmail, IsString } from 'amala'

export default class typeLogin {
  @IsEmail()
  email!: string

  @IsString()
  password!: string
}
