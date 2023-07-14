import { Server, Socket } from 'socket.io';
import type { ProductCreatedEvent, ProductUpdatedEvent, ProductDeletedEvent } from '../events/ProductEvents';

export class SocketService {
  private io: Server;

  constructor() {
    this.io = new Server();
    this.io.on('connection', this.handleConnection);
  }

  public emitEvent(eventName: string, eventData: ProductCreatedEvent | ProductUpdatedEvent | ProductDeletedEvent): void {
    this.io.emit(eventName, eventData);
  }

  private handleConnection(socket: Socket): void {
    console.log('Socket connected:', socket.id);

    socket.on('disconnect', () => {
      console.log('Socket disconnected:', socket.id);
    });
  }
}
