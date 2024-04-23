import { Injectable } from '@nestjs/common';
import { WsException, WsResponse } from '@nestjs/websockets';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class SocketService {
  private Map: Record<string, string> = {};

  constructor(private readonly authService: AuthService) {}

  register(client: any) {
    const jwt: any = this.authService.validateClient(
      client.handshake.headers.authorization,
    );

    this.Map[jwt.userId] = client.id;
    client.decoded = jwt;
  }

  unRegister(client: any) {
    const userId: string = client.decoded.userId;
    if (!(userId in this.Map)) {
      throw new WsException('user is not registered');
    }

    delete this.Map[userId];
  }

  ping(): WsResponse {
    const event = 'pong';
    const respData = Object.keys(this.Map);
    return {
      event,
      data: respData,
    };
  }
}
