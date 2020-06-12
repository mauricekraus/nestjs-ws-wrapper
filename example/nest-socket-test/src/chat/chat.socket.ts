import { IncomingMessage } from 'http';
import { Injectable } from '@nestjs/common';
import {
  SocketInit,
  SocketMessage,
  SocketGateway,
  SocketClose,
  WSGateway,
} from 'nestjs-ws-wrapper';
import * as WebSocket from 'ws';

@WSGateway('test')
@Injectable()
export class ChatGateway extends SocketGateway {
  @SocketInit()
  public initTest(request: IncomingMessage) {
    return this.authenticate(request);
  }

  @SocketMessage('chat')
  public handleTest(
    socket: WebSocket,
    userId: string,
    data: { message: string; target: string },
  ) {
    this.sendMessageTo(data.target, { message: data.message });
  }

  @SocketClose()
  public logout() {
    console.log('logout');
  }
}
