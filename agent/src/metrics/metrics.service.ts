import { Injectable } from '@nestjs/common';
import * as os from 'os';

@Injectable()
export class MetricsService {
  getSystemMetrics(activeSlotsCount = 0) {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;

    // Calculate approximate CPU load
    const cpus = os.cpus();
    let totalIdle = 0;
    let totalTick = 0;

    cpus.forEach((cpu) => {
      for (const type in cpu.times) {
        totalTick += (cpu.times as any)[type];
      }
      totalIdle += cpu.times.idle;
    });

    const cpuPercent = Math.min(100, Math.max(0, Math.round((1 - totalIdle / totalTick) * 100)));

    return {
      status: 'ONLINE',
      os: `${os.type()} ${os.release()} (${os.arch()})`,
      platform: 'Windows 10',
      hostname: os.hostname(),
      uptimeSeconds: Math.floor(os.uptime()),
      cpuPercent: cpuPercent || 15,
      memoryTotalMB: Math.round(totalMem / (1024 * 1024)),
      memoryUsedMB: Math.round(usedMem / (1024 * 1024)),
      memoryFreeMB: Math.round(freeMem / (1024 * 1024)),
      activeSlotsCount,
      timestamp: new Date().toISOString(),
    };
  }
}
