import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { SlotsModule } from '../slots/slots.module';
import { AgentModule } from '../agent/agent.module';

@Module({
  imports: [SlotsModule, AgentModule],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
