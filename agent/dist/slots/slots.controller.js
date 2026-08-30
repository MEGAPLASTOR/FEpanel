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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlotsController = void 0;
const common_1 = require("@nestjs/common");
const slots_service_1 = require("./slots.service");
const secret_guard_1 = require("../auth/secret.guard");
let SlotsController = class SlotsController {
    constructor(slotsService) {
        this.slotsService = slotsService;
    }
    createSlot(body) {
        return this.slotsService.createSlot(body.slotId, body.config || { version: '1.20.4', username: 'Player' });
    }
    startSlot(id) {
        return this.slotsService.startSlot(id);
    }
    stopSlot(id) {
        return this.slotsService.stopSlot(id);
    }
    restartSlot(id) {
        return this.slotsService.restartSlot(id);
    }
    deleteSlot(id) {
        return this.slotsService.deleteSlot(id);
    }
    getLogs(id) {
        return this.slotsService.getSlotLogs(id);
    }
    sendCommand(id, body) {
        return this.slotsService.sendCommand(id, body.command);
    }
};
exports.SlotsController = SlotsController;
__decorate([
    (0, common_1.Post)('create'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SlotsController.prototype, "createSlot", null);
__decorate([
    (0, common_1.Post)(':id/start'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SlotsController.prototype, "startSlot", null);
__decorate([
    (0, common_1.Post)(':id/stop'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SlotsController.prototype, "stopSlot", null);
__decorate([
    (0, common_1.Post)(':id/restart'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SlotsController.prototype, "restartSlot", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SlotsController.prototype, "deleteSlot", null);
__decorate([
    (0, common_1.Get)(':id/logs'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SlotsController.prototype, "getLogs", null);
__decorate([
    (0, common_1.Post)(':id/command'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], SlotsController.prototype, "sendCommand", null);
exports.SlotsController = SlotsController = __decorate([
    (0, common_1.Controller)('containers'),
    (0, common_1.UseGuards)(secret_guard_1.SecretKeyGuard),
    __metadata("design:paramtypes", [slots_service_1.SlotsService])
], SlotsController);
//# sourceMappingURL=slots.controller.js.map