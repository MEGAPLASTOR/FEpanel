import { Module } from '@nestjs/common';
import { StreamingController } from './streaming.controller';
import { StreamingService } from './streaming.service';
import { SlotsModule } from '../slots/slots.module';
import { AgentModule } from '../agent/agent.module';

@Module({
  imports: [SlotsModule, AgentModule],
  controllers: [StreamingController],
  providers: [StreamingService],
})
export class StreamingModule {}
