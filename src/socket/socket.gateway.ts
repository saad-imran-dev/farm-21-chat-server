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
  handlePing(client: any, data: any) {
    return this.controller.ping(client, data);
  }

  @SubscribeMessage(Events.SendMessage)
  handleSendMessage(client: any, data: any) {
    return this.controller.message(this.server, client, data);
  }

  @SubscribeMessage(Events.UnreceivedMessages)
  handleUnreceivedMessages(client: any, data: any) {
    return this.controller.unreceivedMessages(client, data);
  }

  @SubscribeMessage(Events.ReceiveMessage)
  handleReceiveMessage(client: any, data: any) {
    return this.controller.receiveMessage(client, data);
  }
}
