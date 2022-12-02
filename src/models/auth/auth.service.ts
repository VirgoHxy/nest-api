import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  sign(param?: any): string {
    const payload = param || {};
    return this.jwtService.sign(payload);
  }
}
