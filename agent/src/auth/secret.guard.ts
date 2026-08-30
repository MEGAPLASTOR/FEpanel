import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class SecretKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const secret = request.headers['x-agent-secret'] || request.query.secret;
    const expectedSecret = process.env.AGENT_SECRET_KEY || 'agent_secret_key_123';

    if (!secret || secret !== expectedSecret) {
      throw new UnauthorizedException('Invalid or missing Agent Secret Key');
    }

    return true;
  }
}
