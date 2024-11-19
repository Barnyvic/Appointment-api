import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IUser } from 'src/interfaces';

export const User = createParamDecorator<any, any, IUser>((_, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const { user } = request;

  return user as IUser;
});
