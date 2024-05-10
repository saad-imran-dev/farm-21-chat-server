import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Events } from 'src/shared/enums/events.enum';
import { UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { WebsocketExceptionsFilter } from 'src/exceptions/all-wsexceptions.filter';
import { SocketService } from './socket.service';
import { MessageEventSchema } from 'src/shared/schema/message-event.schema';
import { ReceiveEventSchema } from 'src/shared/schema/recieve-event-schema';

@WebSocketGateway()
@UseFilters(WebsocketExceptionsFilter)
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private service: SocketService) {}

  async handleConnection(client: any, ...args: any[]) {
    try {
      await this.service.register(client);
    } catch (error) {
      client.disconnect();
    }
  }

  async handleDisconnect(client: any) {
    await this.service.unRegister(client);
  }

  @SubscribeMessage(Events.Ping)
  handlePing(client: any, data: any) {
    return this.service.ping(client);
  }

  @UsePipes(new ValidationPipe())
  @SubscribeMessage(Events.SendMessage)
  handleSendMessage(client: any, data: MessageEventSchema) {
    return this.service.message(this.server, client, data);
  }

  @SubscribeMessage(Events.UnreceivedMessages)
  handleUnreceivedMessages(client: any, data: any) {
    return this.service.unreceivedMessages(client);
  }

  @UsePipes(new ValidationPipe())
  @SubscribeMessage(Events.ReceiveMessage)
  handleReceiveMessage(client: any, data: ReceiveEventSchema) {
    return this.service.receiveMessage(client, data);
  }

  @SubscribeMessage(Events.AllMessages)
  handleAllMessages(client: any, data: any) {
    return this.service.allMessages(client);
  }
}
