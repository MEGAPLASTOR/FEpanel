import { MetricsService } from './metrics.service';
import { SlotsService } from '../slots/slots.service';
export declare class MetricsController {
    private readonly metricsService;
    private readonly slotsService;
    constructor(metricsService: MetricsService, slotsService: SlotsService);
    getMetrics(): {
        status: string;
        os: string;
        platform: string;
        hostname: string;
        uptimeSeconds: number;
        cpuPercent: number;
        memoryTotalMB: number;
        memoryUsedMB: number;
        memoryFreeMB: number;
        activeSlotsCount: number;
        timestamp: string;
    };
}
