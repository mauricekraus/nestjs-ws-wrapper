import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { ChatGateway } from './chat.socket';

@Module({
  providers: [ChatGateway],
  imports: [
    UserModule,
    JwtModule.register({
      secret: 'secret',
    }),
  ],
  exports: [ChatGateway],
})
export class ChatModule {}
