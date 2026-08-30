"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetricsService = void 0;
const common_1 = require("@nestjs/common");
const os = require("os");
let MetricsService = class MetricsService {
    getSystemMetrics(activeSlotsCount = 0) {
        const totalMem = os.totalmem();
        const freeMem = os.freemem();
        const usedMem = totalMem - freeMem;
        const cpus = os.cpus();
        let totalIdle = 0;
        let totalTick = 0;
        cpus.forEach((cpu) => {
            for (const type in cpu.times) {
                totalTick += cpu.times[type];
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
};
exports.MetricsService = MetricsService;
exports.MetricsService = MetricsService = __decorate([
    (0, common_1.Injectable)()
], MetricsService);
//# sourceMappingURL=metrics.service.js.map