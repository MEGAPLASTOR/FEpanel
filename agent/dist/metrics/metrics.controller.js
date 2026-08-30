"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetricsController = void 0;
const common_1 = require("@nestjs/common");
const metrics_service_1 = require("./metrics.service");
const secret_guard_1 = require("../auth/secret.guard");
const slots_service_1 = require("../slots/slots.service");
let MetricsController = class MetricsController {
    constructor(metricsService, slotsService) {
        this.metricsService = metricsService;
        this.slotsService = slotsService;
    }
    getMetrics() {
        const activeSlots = this.slotsService.getActiveSlotsCount();
        return this.metricsService.getSystemMetrics(activeSlots);
    }
};
exports.MetricsController = MetricsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MetricsController.prototype, "getMetrics", null);
exports.MetricsController = MetricsController = __decorate([
    (0, common_1.Controller)('metrics'),
    (0, common_1.UseGuards)(secret_guard_1.SecretKeyGuard),
    __metadata("design:paramtypes", [metrics_service_1.MetricsService,
        slots_service_1.SlotsService])
], MetricsController);
//# sourceMappingURL=metrics.controller.js.map