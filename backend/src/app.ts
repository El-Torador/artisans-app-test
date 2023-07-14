import 'dotenv/config'
import express, { Request, Response, NextFunction } from 'express';
import createHttpError, { isHttpError } from 'http-errors'
import MongoStore from 'connect-mongo'
import cors from 'cors'
import { createServer } from 'http';
import EventEmitter from 'node:events' 

import { generateURI } from './config/db'
import productRoutes from './routes/product';
import userRoutes from './routes/user';
import session from 'express-session';
import configEnv from './config/configEnv';
import { authenticateSession } from './middlewares/auth';
import { Server, Socket } from 'socket.io';
import type { ProductModel } from './models/Product';


const app = express()
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173']
  }
});

const connectedClients: Socket[] = [];

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

const eventEmitter = new EventEmitter()

io.on('connection', (socket: Socket) => {
  console.log("New socket connexion with id: ", socket.id);
  
  connectedClients.push(socket);

  eventEmitter.on('createProduct', (product: ProductModel) => {
    setTimeout(() => {
      socket.broadcast.emit('productCreated', product);
    }, 200);
  });

  eventEmitter.on('updateProduct', (product: ProductModel) => {
    socket.broadcast.emit('productUpdated', product);
  });

  eventEmitter.on('deleteProduct', (id: string) => {
    socket.broadcast.emit('productDeleted', id);
  });

  socket.on('disconnect', () => {
    const index = connectedClients.indexOf(socket);
    if (index !== -1) {
      connectedClients.splice(index, 1);
    }
  });
});

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