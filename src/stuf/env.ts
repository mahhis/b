import * as dotenv from 'dotenv'
import { cleanEnv, num, str } from 'envalid'
import { cwd } from 'process'
import { resolve } from 'path'

dotenv.config({ path: resolve(cwd(), '.env') })
export default cleanEnv(process.env, {
  PORT: num({ default: 5000 }),
  JWT_ACCESS_SECRET: str(),
  JWT_REFRESH_SECRET: str(),
  MONGO: str(),
  SMTP_HOST: str(),
  SMPT_PORT: num({ default: 587 }),
  SMPT_USER: str(),
  SMPT_PASSWORD: str(),
  API_URL: str(),
  BIN_CHEKER_API_KEY:str(),
  BIN_CHEKER_API_URL:str(),
  CLIENT_URL: str(),
  BANK_API_URL: str(),
})