import 'dotenv/config'
import express, { Request, Response, NextFunction } from 'express';
import createHttpError, { isHttpError } from 'http-errors'
import MongoStore from 'connect-mongo'
import cors from 'cors'
import { createServer } from 'http';

import { generateURI } from './config/db'
import productRoutes from './routes/product';
import userRoutes from './routes/user';
import session from 'express-session';
import configEnv from './config/configEnv';
import { authenticateSession } from './middlewares/auth';
import { SocketService } from './services/SocketService';


const app = express()
const server = createServer(app);
const socketService = new SocketService(server)
const eventEmitter = {
  emit: socketService.emitEvent
};



const allowedOrigins = ['http://localhost:5173']

const options: cors.CorsOptions = {
  origin: allowedOrigins,
  methods: ['GET', 'PUT', 'POST', 'DELETE'],
  credentials: true,
}

app.use(cors(options));
app.use(express.json())


app.use(session({
  secret: configEnv.app.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 60 * 60 * 1000
  },
  rolling: true,
  store: MongoStore.create({
    mongoUrl: generateURI()
  })
}))

app.use('/api/v1/products', authenticateSession, productRoutes)
app.use('/api/v1/user', userRoutes)


app.use((_req: Request, _res: Response, next: NextFunction) => {
  console.log(_req.url)
  next(createHttpError(404, "Endpoint not found"))
})

app.use((error: unknown, _req: Request, res: Response) => {
  console.error(error)
  let errorMessage = "An unknown error occured."
  let statusCode = 500
  if (isHttpError(error)) {
    statusCode = error.statusCode
    errorMessage = error.message
  }
  res.status(statusCode).json({ error: errorMessage })
})

export { server, eventEmitter }