import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { MetricsService } from './metrics/metrics.service';
import { SlotsService } from './slots/slots.service';
import axios from 'axios';

async function bootstrap() {
  const logger = new Logger('Windows10-VPS-Agent');
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const port = process.env.AGENT_PORT || 4001;
  await app.listen(port);

  const metricsService = app.get(MetricsService);
  const slotsService = app.get(SlotsService);

  logger.log(`=======================================================`);
  logger.log(`🚀 MINECRAFT CLOUD PANEL - WINDOWS 10 AGENT RUNNING!`);
  logger.log(`📡 Listening on Port: ${port}`);
  logger.log(`🔑 Secret Key: ${process.env.AGENT_SECRET_KEY || 'agent_secret_key_123'}`);
  logger.log(`💓 Auto-Heartbeat: ACTIVE (Khong can mo Port Modem!)`);
  logger.log(`=======================================================`);

  // Auto-send metrics outward to Backend / Cloud Panel every 5 seconds
  const backendUrl = process.env.BACKEND_URL || 'https://frontend-megaplastor1.vercel.app/api';
  const localBackend = 'http://localhost:4000/nodes/heartbeat';

  const sendHeartbeat = async () => {
    try {
      const activeSlots = slotsService.getActiveSlotsCount();
      const metrics = metricsService.getSystemMetrics(activeSlots);

      // Try sending to local backend
      try {
        await axios.post(localBackend, {
          nodeId: 'vps-win10-01',
          metrics,
          secretKey: 'agent_secret_key_123',
        }, { timeout: 3000 });
      } catch (e) {}

      // Try sending to cloud panel API
      try {
        await axios.post(`${backendUrl}/nodes/heartbeat`, {
          nodeId: 'vps-win10-01',
          metrics,
          secretKey: 'agent_secret_key_123',
        }, { timeout: 3000 });
      } catch (e) {}
    } catch (err) {}
  };

  sendHeartbeat();
  setInterval(sendHeartbeat, 5000);
}
bootstrap();
