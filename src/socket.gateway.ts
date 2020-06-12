import { OnModuleInit, Injectable } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import * as WebSocket from 'ws';
import { isConstructor, isFunction } from '@nestjs/common/utils/shared.utils';
import { Metakeys } from './decorators';
import { KeyedCollection } from './utils';
import { JwtService } from '@nestjs/jwt';
import { IncomingMessage } from 'http';
import { Socket } from 'net';

@Injectable()
export abstract class SocketGateway implements OnModuleInit {
  private connectedClients: Map<string, WebSocket>;
  get clients(): Map<string, WebSocket> {
    return this.connectedClients;
  }

  constructor(private readonly adapter: HttpAdapterHost, private jwtService: JwtService) {
    this.connectedClients = new Map();
  }

  onModuleInit() {
    this.initGateway();
  }

  public closeConnection(userId: string) {
    const ws = this.connectedClients.get(userId);
    if (!ws) {
      return;
    }
    ws.close();
  }

  protected authenticate = (req: IncomingMessage) => {
    const cookies = this.parseCookie(req.headers.cookie);
    try {
      if (cookies?.jwt === undefined) {
        return false;
      }
      this.jwtService.verify(cookies.jwt);
      return true;
    } catch {
      return false;
    }
  };

  protected sendMessageTo(clientId: string, data: object) {
    const client: WebSocket | undefined = this.clients.get(clientId);
    if (client) {
      client.send(JSON.stringify(data));
    } else {
      console.error('socket with id ' + clientId + ' is not reachable');
    }
  }

  private parseCookie = (str?: string): object & { jwt?: string } =>
    (str?.length ?? 0) > 0
      ? str!
          .split(';')
          .map((v) => v.split('='))
          .reduce((acc: any, v) => {
            acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
            return acc;
          }, {})
      : {};

  private initGateway() {
    const server = this.adapter.httpAdapter.getHttpServer();
    // const path: string | undefined = Reflect.getMetadata('path', gateway);
    const wss = new WebSocket.Server({
      clientTracking: false,
      noServer: true,
      //  path,
    });
    const prototype = Object.getPrototypeOf(this);

    const methodNames = Object.getOwnPropertyNames(prototype);

    const methods = new KeyedCollection<any>();

    methodNames.forEach((methodName) => {
      const method = prototype[methodName];
      if (!isConstructor(method) && isFunction(method)) {
        if (Reflect.getMetadata(Metakeys.ConnectionInit, method)) {
          methods.add(Metakeys.ConnectionInit, method);
        } else if (Reflect.getMetadata(Metakeys.MessageHandlerMapping, method)) {
          const messagePattern = Reflect.getMetadata(Metakeys.MesssageMetadata, method);

          methods.add(messagePattern, method);
        }
      }
    });

    server.on('upgrade', (request: IncomingMessage, socket: Socket, head: any) => {
      const init = methods.item(Metakeys.ConnectionInit).bind(this);
      if (init(request) === false) {
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        socket.destroy();
        return;
      }

      wss.handleUpgrade(request, socket, head, function done(ws) {
        wss.emit('connection', ws, request);
      });
    });

    wss.on('connection', (ws, request: IncomingMessage) => {
      const cookies = this.parseCookie(request.headers.cookie);
      const userId = this.jwtService.verify(cookies!.jwt!).sub;

      this.connectedClients.set(userId, ws);

      ws.on('message', (data: string) => {
        const message: { event: string; data: any } = JSON.parse(data);
        const method = methods.item(message.event).bind(this);
        method(ws, userId, message.data);
      });

      ws.on('close', () => {
        this.connectedClients.delete(userId);
      });
    });
  }
}
