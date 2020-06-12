import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

import { UserService, User } from './user/user.service';

const cookieExtractor = (req: any) => {
  let token: null | string = null;
  if (req && req.cookies && req.cookies['jwt']) {
    token = req.cookies['jwt'];
  }

  return token;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        cookieExtractor,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: 'secret',
    });
  }

  validate(payload: {
    exp: number;
    iat: number;
    sub: number;
    username: string;
  }): User {
    return this.userService.findById(payload.sub + '');
  }
}
