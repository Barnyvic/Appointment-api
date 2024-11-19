import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { RequestHeadersEnum } from 'src/enums';
import { ErrorHelper } from 'src/utils';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const authorization = req.headers[RequestHeadersEnum.Authorization];

    if (!authorization) {
      ErrorHelper.UnauthorizedException('Authorization header is missing');
    }

    const user = await this.verifyAccessToken(authorization);

    req.user = user;

    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }

    return matchRoles(roles, user.role);
  }

  async verifyAccessToken(authorization: string) {
    const [bearer, accessToken] = authorization.split(' ');

    if (bearer !== 'Bearer') {
      ErrorHelper.UnauthorizedException('Authorization should be Bearer');
    }

    if (!accessToken) {
      ErrorHelper.UnauthorizedException('Access token is missing');
    }

    try {
      const payload = this.jwtService.verify(accessToken);

      const user = payload;

      if (!user) {
        ErrorHelper.UnauthorizedException('Unauthorized Exception');
      }

      return user;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        ErrorHelper.UnauthorizedException('Token expired');
      }

      ErrorHelper.UnauthorizedException(error.message);
    }
  }
}

function matchRoles(roles, role: any): boolean {
  return roles.includes(role);
}
