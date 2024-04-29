import { Controller } from '@nestjs/common';
import { SocketService } from './socket.service';
import { WsResponse } from '@nestjs/websockets';
import { IWsChatResponse } from './interface/IWsChatResponse';
import { Observable } from 'rxjs';
import { Server } from 'socket.io';
import { IWsUnreceivedResponse } from './interface/IWsUnreceivedResponse';

@Controller('socket')
export class SocketController {
  constructor(private readonly service: SocketService) {}

  register(client: any) {
    try {
      this.service.register(client);
    } catch (error) {
      console.error(error);
      client.disconnect();
    }
  }

  unRegister(client: any) {
    this.service.unRegister(client);
  }

  ping(client: any, data: any): Promise<WsResponse> {
    return this.service.ping(client);
  }

  message(server: Server, client: any, data: any): Promise<void> {
    return this.service.message(server, client, data);
  }

  unreceivedMessages(client: any, data: any): Promise<IWsUnreceivedResponse> {
    return this.service.unreceivedMessages(client);
  }

  receiveMessage(client: any, data: any): Promise<void> {
    return this.service.recieveMessage(client, data);
  }
}
