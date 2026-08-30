"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
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
    logger.log(`=======================================================`);
    logger.log(`🚀 MINECRAFT CLOUD PANEL - WINDOWS 10 AGENT RUNNING!`);
    logger.log(`📡 Listening on Port: ${port}`);
    logger.log(`🔑 Secret Key: ${process.env.AGENT_SECRET_KEY || 'agent_secret_key_123'}`);
    logger.log(`=======================================================`);
}
bootstrap();
//# sourceMappingURL=main.js.map