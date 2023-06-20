import * as nodemailer from 'nodemailer';
import env from '@/stuf/env'
import SMTPTransport from "nodemailer/lib/smtp-transport";
import {Transporter} from "nodemailer";
import * as crypto from "crypto";

class MailService {
    public transporter: Transporter<SMTPTransport.SentMessageInfo>;
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: env.SMTP_HOST,
            port: env.SMPT_PORT,
            secure: false,
            auth: {
                user: env.SMPT_USER,
                pass: env.SMPT_PASSWORD
            }
        })
    }async sendActivationMail(to:string, verifyCode:string){

       try {
           await this.transporter.sendMail({
               from: env.SMPT_USER,
               to,
               subject: 'Confirm your email address ' + env.API_URL,
               html:
                   `<div>
                        <h1>Yuor verify code:</h1>
                        <h1>${verifyCode}</a>
                   </div>`
           })
       }catch (e){
           console.log(e)
       }
    }

    generateVerificationCode() {
        const codeLength = 6;
        const bytes = crypto.randomBytes(codeLength);
        const verificationCode = parseInt(bytes.toString('hex'), 16) % (Math.pow(10, codeLength));
        return verificationCode.toString().padStart(codeLength, '0');
    }
}

module.exports = new MailService();
