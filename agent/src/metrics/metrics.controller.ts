import { Controller, Get, UseGuards } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { SecretKeyGuard } from '../auth/secret.guard';
import { SlotsService } from '../slots/slots.service';

@Controller('metrics')
@UseGuards(SecretKeyGuard)
export class MetricsController {
  constructor(
    private readonly metricsService: MetricsService,
    private readonly slotsService: SlotsService,
  ) {}

  @Get()
  getMetrics() {
    const activeSlots = this.slotsService.getActiveSlotsCount();
    return this.metricsService.getSystemMetrics(activeSlots);
  }
}
