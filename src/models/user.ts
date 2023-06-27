import {getModelForClass, modelOptions, prop} from "@typegoose/typegoose";
import * as bcrypt from 'bcrypt';
import { generateAccessToken, generateRefreshToken,  verify, TokenType } from '@/stuf/jwt'
import { omit } from 'lodash'
const mailService = require('@/stuf/mail')

@modelOptions({ schemaOptions: { timestamps: true } })
export class User{
  @prop({ index: true, lowercase: true, unique: true})
  email?: string
  @prop({ index: true })
  password?: string
  @prop({ index: true, unique: true })
  refreshToken?: string
  @prop({index: true })
  activationCode?: string
  @prop({index: true })
  isEmailConfirmed?: boolean

  strippedAndFilled(
      this:any,
      {
        withExtra = false,
        withToken = true,
      }: { withExtra?: boolean; withToken?: boolean } = {}
  ) {
    const stripFields = ['createdAt', 'updatedAt', '__v', 'password', 'activationCode']
    if (!withExtra) {
      stripFields.push('refreshToken')
      stripFields.push('email')
    }
    if (!withToken) {
      stripFields.push('refreshToken')
    }
    return omit(this.toObject(), stripFields)
  }

}

export const UserModel = getModelForClass(User);

export async function auth(email:string, code:string) {
    const user = await UserModel.findOne({email})
    if (!user || !(user.activationCode)) {
        throw new Error(`User nor found`)
    }
    if(user.activationCode !== code){
        throw new Error('Bed activate code')
    }
    user.refreshToken = generateRefreshToken(user.id);
    user.activationCode =''
    const accessToken = generateAccessToken(user.id)
    await user.save();
    return{
        user,
        accessToken
    }
}



export async function refresh(refreshToken:string){
    if(!refreshToken){
      throw new Error(`Have not refresh token`)
    }
    const payload = verify(refreshToken, TokenType.REFRESH)
    let user = await UserModel.findById(payload.id)

    if(!user || !user.refreshToken){
      throw new Error(`Not auth`)
    }
    user.refreshToken = generateRefreshToken(user.id);
    const accessToken = generateAccessToken(user.id)
    await user.save();

    return{
      user,
      accessToken
    }
}


export async function checkEmail(email:string) {
    const user = await UserModel.findOne({email})
    if(!user){
      const activationCode = mailService.generateVerificationCode();
      const user = await UserModel.create({email, activationCode});
      await mailService.sendActivationMail(email, activationCode)
      await user.save();

    }else {
        const activationCode = mailService.generateVerificationCode();
        await mailService.sendActivationMail(email, activationCode)
        user.activationCode = mailService.generateVerificationCode();
        await user.save();
    }
}









