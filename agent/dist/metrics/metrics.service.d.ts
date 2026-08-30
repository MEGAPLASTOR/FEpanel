export declare class MetricsService {
    getSystemMetrics(activeSlotsCount?: number): {
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
