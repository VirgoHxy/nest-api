import { appConfig } from '@config';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // 这里header字段要小写
      jwtFromRequest: ExtractJwt.fromHeader('authorization'),
      ignoreExpiration: false,
      secretOrKey: appConfig.jwt.secret,
      algorithms: appConfig.jwt.algorithm,
    });
  }

  async validate(payload: any) {
    return { name: payload.name };
  }
}
