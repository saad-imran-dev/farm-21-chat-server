import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { SocketController } from './socket.controller';
import { Events } from 'src/utils/enums/events.enum';

@WebSocketGateway()
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private controller: SocketController) {}

  handleConnection(client: any, ...args: any[]) {
    this.controller.register(client);
  }

  handleDisconnect(client: any) {
    this.controller.unRegister(client);
  }

  @SubscribeMessage(Events.Ping)
  handleMessage(client: any, data: any) {
    return this.controller.ping(client, data);
  }
}
