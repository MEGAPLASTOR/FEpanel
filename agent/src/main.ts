import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

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
  
  logger.log(`=======================================================`);
  logger.log(`🚀 MINECRAFT CLOUD PANEL - WINDOWS 10 AGENT RUNNING!`);
  logger.log(`📡 Listening on Port: ${port}`);
  logger.log(`🔑 Secret Key: ${process.env.AGENT_SECRET_KEY || 'agent_secret_key_123'}`);
  logger.log(`=======================================================`);
}
bootstrap();
