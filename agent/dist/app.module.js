"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const metrics_controller_1 = require("./metrics/metrics.controller");
const metrics_service_1 = require("./metrics/metrics.service");
const slots_controller_1 = require("./slots/slots.controller");
const slots_service_1 = require("./slots/slots.service");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [],
        controllers: [metrics_controller_1.MetricsController, slots_controller_1.SlotsController],
        providers: [metrics_service_1.MetricsService, slots_service_1.SlotsService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map