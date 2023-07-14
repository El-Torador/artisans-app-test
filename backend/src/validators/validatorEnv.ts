import { cleanEnv, port, str } from 'envalid'

export default cleanEnv(process.env, { 
  DB_URI: str(),
  PORT: port(),
  SECRET_KEY: str(),
})