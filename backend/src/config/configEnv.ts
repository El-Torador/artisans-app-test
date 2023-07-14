import env from '../validators/validatorEnv'

const configEnv = {
  db: {
    uri: env.DB_URI,
  },
  app: {
    PORT: env.PORT,
    SECRET: env.SECRET_KEY
  }
}

export default configEnv