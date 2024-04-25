import { Injectable } from '@nestjs/common';
import { WsException, WsResponse } from '@nestjs/websockets';
import { AuthService } from 'src/auth/auth.service';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class SocketService {
  private Map: Record<string, string> = {};

  constructor(
    private readonly authService: AuthService,
    private readonly redisService: RedisService,
  ) {}

  register(client: any) {
    const jwt: any = this.authService.validateClient(
      client.handshake.headers.authorization,
    );

    this.redisService.set(jwt.userId, { ...jwt, socketId: client.id });
    client.decoded = jwt;
  }

  unRegister(client: any) {
    const userId: string = client.decoded.userId;
    if (!(userId in this.Map)) {
      throw new WsException('user is not registered');
    }

    this.redisService.remove(userId);
  }

  ping(): WsResponse {
    const event = 'pong';
    const respData = 'Hello World';
    return {
      event,
      data: respData,
    };
  }
}
