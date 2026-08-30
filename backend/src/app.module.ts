import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { FirebaseAdminModule } from './firebase/firebase-admin.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SlotsModule } from './slots/slots.module';
import { FilesModule } from './files/files.module';
import { ConsoleModule } from './console/console.module';
import { StreamingModule } from './streaming/streaming.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { DiscordModule } from './discord/discord.module';
import { AgentModule } from './agent/agent.module';
import { NodesModule } from './nodes/nodes.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
    FirebaseAdminModule.forRoot(),
    AuthModule,
    UsersModule,
    NodesModule,
    SlotsModule,
    FilesModule,
    ConsoleModule,
    StreamingModule,
    SubscriptionsModule,
    DiscordModule,
    AgentModule,
  ],
})
export class AppModule {}
