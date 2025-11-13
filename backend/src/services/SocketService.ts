import { Server, Socket } from 'socket.io';
import type { Server as HttpServer } from 'http';
import type { ProductCreatedEvent, ProductUpdatedEvent, ProductDeletedEvent } from '../events/ProductEvents';
import EventEmitter from 'events';
import { ProductModel } from '../models/Product';

export class SocketService {
  private io: Server;
  private connectedClients: Socket[] = [];
  private eventEmitter: EventEmitter;

  constructor(server: HttpServer) {
    this.io = new Server(server, {
      cors: {
        origin: ['http://localhost:5173']
      }
    });
    this.eventEmitter = new EventEmitter();
    this.io.on('connection', this.handleConnection.bind(this));
  }

  public emitEvent(eventName: string, eventData: ProductCreatedEvent | ProductUpdatedEvent['product'] | ProductDeletedEvent['productId']): void {
    this.eventEmitter.emit(eventName, eventData);
  }

  private handleConnection(socket: Socket): void {
    this.connectedClients.push(socket);
  
    this.eventEmitter.on('createProduct', (product: ProductModel) => {
      setTimeout(() => {
        socket.broadcast.emit('productCreated', product);
      }, 200);
    });
  
    this.eventEmitter.on('updateProduct', (product: ProductModel) => {
      socket.broadcast.emit('productUpdated', product);
    });
  
    this.eventEmitter.on('deleteProduct', (id: string) => {
      socket.broadcast.emit('productDeleted', id);
    });
  
    socket.on('disconnect', () => {
      const index = this.connectedClients.indexOf(socket);
      if (index !== -1) {
        this.connectedClients.splice(index, 1);
      }
    });
  }
}
