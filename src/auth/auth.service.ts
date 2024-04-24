import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  validateClient(authorizationHeader: string): any {
    if (!authorizationHeader || authorizationHeader.trim() === '') {
      throw new WsException("No JWT Token");
    }
    const token = authorizationHeader.replace(/bearer/, '').trim();

    const jwt = this.jwtService.verify(token, {
      secret: this.configService.get<string>('JWT_SECRET_KEY'),
    });
    if (!jwt) {
      throw new WsException("Unauthorized user");
    }

    return jwt;
  }
}
