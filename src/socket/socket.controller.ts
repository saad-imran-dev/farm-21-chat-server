import { Controller } from '@nestjs/common';
import { SocketService } from './socket.service';
import { WsResponse } from '@nestjs/websockets';

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

  ping(client: any, data: any): WsResponse {
    return this.service.ping();
  }
}
