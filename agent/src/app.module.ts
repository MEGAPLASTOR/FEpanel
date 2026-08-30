import { Module } from '@nestjs/common';
import { MetricsController } from './metrics/metrics.controller';
import { MetricsService } from './metrics/metrics.service';
import { SlotsController } from './slots/slots.controller';
import { SlotsService } from './slots/slots.service';

@Module({
  imports: [],
  controllers: [MetricsController, SlotsController],
  providers: [MetricsService, SlotsService],
})
export class AppModule {}
