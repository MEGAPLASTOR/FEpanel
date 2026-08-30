import { Module } from '@nestjs/common';
import { ConsoleGateway } from './console.gateway';
import { SlotsModule } from '../slots/slots.module';

@Module({
  imports: [SlotsModule],
  providers: [ConsoleGateway],
})
export class ConsoleModule {}
