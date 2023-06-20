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
    const stripFields = ['createdAt', 'updatedAt', '__v', 'password',]
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

export async function registration(email:string, password:string, activationCode:string){

  const user = await UserModel.findOne({email})
  if(user == null ||  activationCode != user.activationCode){
    throw new Error('Bed activate code')
  }
  const hashPassword:string = await bcrypt.hash(password,3);
  user.password = hashPassword;
  user.isEmailConfirmed = true;
  user.activationCode = '';
  user.refreshToken = generateRefreshToken(user.id);
  const accessToken = generateAccessToken(user.id)
  await user.save();
  return{
    user,
    accessToken
  }
}


export async function login(email:string, password:string){
  const user = await UserModel.findOne({email})

  if(!user){
    throw new Error(`User nor found`)
  }
  const isPasswordEquals = await bcrypt.compare(password, user.password!)
  if(!isPasswordEquals){
    throw new Error('Password not equals')
  }
  user.refreshToken = generateRefreshToken(user.id);
  const accessToken = generateAccessToken(user.id)
  await user.save();
  return{
    user,
    accessToken
  }
}


export async function logout(refreshToken:string){
  const payload = verify(refreshToken, TokenType.REFRESH);
  let user = await UserModel.findById(payload.id)
  if(!user){
    throw new Error(`Something went wrong`)
  }
  user.refreshToken = '';
  await user.save()
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

export async function activateUser(email:string) {
  const user = await UserModel.findOne({email})
  if (user && user.activationCode) {


    const activationCode = mailService.generateVerificationCode();
    user.activationCode = activationCode;
    await mailService.sendActivationMail(email, activationCode);
    user.save();

  } else if(!user){

    const activationCode = mailService.generateVerificationCode();
    const user = await UserModel.create({email, activationCode});
    await mailService.sendActivationMail(email, activationCode)
    await user.save();

  }else {
    throw new Error('User alredy exist')
  }

  setTimeout(async () => {
    const user = await UserModel.findOne({ email });
    if (user && user.activationCode) {
      await UserModel.deleteOne({ email });
    }
  }, 2 * 60 * 1000);
}

