import { Injectable } from '@nestjs/common';
import { WsException, WsResponse } from '@nestjs/websockets';
import { AuthService } from 'src/auth/auth.service';
import { RedisService } from 'src/redis/redis.service';
import { Events } from 'src/utils/enums/events.enum';
import { Fields } from 'src/utils/enums/fields.enum';

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

    this.redisService.set(jwt.userId, {[Fields.JWT]: jwt, [Fields.SOCKET_ID]: client.id});
    client.decoded = jwt;
  }

  unRegister(client: any) {
    const userId: string = client.decoded.userId;
    this.redisService.remove(userId);
  }

  async ping(client: any): Promise<WsResponse> {
    const data = (await this.redisService.get(client.decoded.userId))[
      Fields.SOCKET_ID
    ];
    return {
      event: Events.Pong,
      data,
    };
  }
}
