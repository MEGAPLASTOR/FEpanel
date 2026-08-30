"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecretKeyGuard = void 0;
const common_1 = require("@nestjs/common");
let SecretKeyGuard = class SecretKeyGuard {
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const secret = request.headers['x-agent-secret'] || request.query.secret;
        const expectedSecret = process.env.AGENT_SECRET_KEY || 'agent_secret_key_123';
        if (!secret || secret !== expectedSecret) {
            throw new common_1.UnauthorizedException('Invalid or missing Agent Secret Key');
        }
        return true;
    }
};
exports.SecretKeyGuard = SecretKeyGuard;
exports.SecretKeyGuard = SecretKeyGuard = __decorate([
    (0, common_1.Injectable)()
], SecretKeyGuard);
//# sourceMappingURL=secret.guard.js.map