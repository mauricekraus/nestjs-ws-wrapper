> A Convenient wrapper around websockets to be used in nestjs

## What it is

This is a websocket wrapper utility package for the use with nestjs.
It builds on [WS](https://github.com/websockets/ws) and wraps it with a convenient API and decorators.
Nestjs already supports websockets and wraps it and socketio, but the current adapter does not support the simple authentication that this package provides. This project tries to prevent a websocket connection from being established if a user is not properly authenticated (before the connection event, but on upgrade). It is written entirely in Typscript and provides a lot of decorators to make your code more readable and less error-prone.

## Content

### Decorators
* @SocketClose
* @SocketConnected
* @SocketInit
* @SocketMessage
* @WSGateway

### Classes
* SocketGateway base class

## Usage
Just inherit from the base class (**SocketGateway**) and if you want to have your sockets authenticated, create an init method and decorate it with **@SocketInit()** and call the authentication method.
```ts
@SocketInit()
  public initTest(request: IncomingMessage) {
    return this.authenticate(request);
  }
```
In order to define socket messages just add the **@SocketMessage** annotation to your methods.
```ts
@SocketMessage('chat')
  public handleTest(
    socket: WebSocket,
    userId: string,
    data: { message: string; target: string },
  ) {
    this.sendMessageTo(data.target, { message: data.message });
  }
```
You will get the userId, the socket or the data injected from the method, but you can leave them out entirely, but it is important when you specify them that you follow this order.

## Example
An Example is available: [Example](https://github.com/mauricekraus/nestjs-ws-wrapper/tree/master/example/nest-socket-test)

## Installation

You can get the latest release using npm: ```yarn add nestjs-ws-wrapper``` or ```npm install nestjs-ws-wrapper```

## Contribution/Issues
If you find any issue please open a new issue or feel free to open a merge request.