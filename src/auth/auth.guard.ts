import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  private apiKey: string;
  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    this.apiKey = this.configService.getOrThrow<string>(`apiKey`);
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const unCheckedApiKey = request.headers[`x-api-key`];
    if (unCheckedApiKey !== this.apiKey) {
      throw new UnauthorizedException('Api key is invalid');
    }
    return true;
  }
}
