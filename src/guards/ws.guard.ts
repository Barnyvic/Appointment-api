import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { IUser } from '../interfaces';

@Injectable()
export class WsGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<any> {
    const client: Socket = context.switchToWs().getClient();

    const authorization = client.handshake.auth.token || client.handshake.headers.authorization;

    const user = this.verifyAccessToken(authorization);

    client.data.user = user;

    return !!user;
  }

  verifyAccessToken(authorization: string): IUser {
    if (!authorization) {
      throw new WsException('Authorization header is missing');
    }

    const [bearer, accessToken] = authorization.split(' ');

    if (bearer !== 'Bearer') {
      throw new WsException('Authorization should be Bearer');
    }

    if (!accessToken) {
      throw new WsException('Access token is missing');
    }

    try {
      const payload = this.jwtService.verify(accessToken);

      const user = payload;

      if (!user) {
        throw new WsException('Unauthorized Exception');
      }

      return user;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new WsException('Token expired');
      }

      throw new WsException(error.message);
    }
  }
}
