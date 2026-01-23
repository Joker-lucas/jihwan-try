import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isAuthSuccessful = (await super.canActivate(context)) as boolean;

    if (!isAuthSuccessful) {
      return false;
    }

    const request = context.switchToHttp().getRequest();
    await super.logIn(request);

    return isAuthSuccessful;
  }
}
