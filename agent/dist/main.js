"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const metrics_service_1 = require("./metrics/metrics.service");
const slots_service_1 = require("./slots/slots.service");
const axios_1 = require("axios");
async function bootstrap() {
    const logger = new common_1.Logger('Windows10-VPS-Agent');
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });
    const port = process.env.AGENT_PORT || 4001;
    await app.listen(port);
    const metricsService = app.get(metrics_service_1.MetricsService);
    const slotsService = app.get(slots_service_1.SlotsService);
    logger.log(`=======================================================`);
    logger.log(`🚀 MINECRAFT CLOUD PANEL - WINDOWS 10 AGENT RUNNING!`);
    logger.log(`📡 Listening on Port: ${port}`);
    logger.log(`🔑 Secret Key: ${process.env.AGENT_SECRET_KEY || 'agent_secret_key_123'}`);
    logger.log(`💓 Auto-Heartbeat: ACTIVE (Khong can mo Port Modem!)`);
    logger.log(`=======================================================`);
    const backendUrl = process.env.BACKEND_URL || 'https://frontend-megaplastor1.vercel.app/api';
    const localBackend = 'http://localhost:4000/nodes/heartbeat';
    const sendHeartbeat = async () => {
        try {
            const activeSlots = slotsService.getActiveSlotsCount();
            const metrics = metricsService.getSystemMetrics(activeSlots);
            try {
                await axios_1.default.post(localBackend, {
                    nodeId: 'vps-win10-01',
                    metrics,
                    secretKey: 'agent_secret_key_123',
                }, { timeout: 3000 });
            }
            catch (e) { }
            try {
                await axios_1.default.post(`${backendUrl}/nodes/heartbeat`, {
                    nodeId: 'vps-win10-01',
                    metrics,
                    secretKey: 'agent_secret_key_123',
                }, { timeout: 3000 });
            }
            catch (e) { }
        }
        catch (err) { }
    };
    sendHeartbeat();
    setInterval(sendHeartbeat, 5000);
}
bootstrap();
//# sourceMappingURL=main.js.map