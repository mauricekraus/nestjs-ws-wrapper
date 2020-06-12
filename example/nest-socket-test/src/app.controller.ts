import {
  Controller,
  Post,
  Response,
  Request,
  Query,
  UseGuards,
} from '@nestjs/common';
import { User, UserService } from './user/user.service';
import { JwtService } from '@nestjs/jwt';
import { Response as Res, Request as Req } from 'express';
import { ChatGateway } from './chat/chat.socket';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller()
export class AppController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly chatSocket: ChatGateway,
    private readonly userService: UserService,
  ) {}

  @Post('login')
  login(@Response() res, @Query('userId') userId: string) {
    const user = { name: 'test', id: userId };

    const jwt = this.generateJWT(user);
    this.userService.addUser(user);

    res.cookie('jwt', jwt.token, { httpOnly: true });

    res.send({ result: 'OK', message: 'Session updated' });
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Request() request: Req, @Response() res: Res) {
    const user = request.user as { name: string; id: string };
    res.clearCookie('jwt', { httpOnly: true });
    this.chatSocket.closeConnection(user.id);
    console.log('Destroyed WS');

    res.send({ result: 'OK', message: 'Session destroyed' });
  }

  generateJWT(user: User): { token: string } {
    const payload = { username: user.name, sub: user.id };
    return {
      token: this.jwtService.sign(payload),
    };
  }
}
