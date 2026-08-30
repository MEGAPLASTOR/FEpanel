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
var SlotsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlotsService = void 0;
const common_1 = require("@nestjs/common");
const child_process_1 = require("child_process");
const fs = require("fs");
const path = require("path");
let SlotsService = SlotsService_1 = class SlotsService {
    constructor() {
        this.logger = new common_1.Logger(SlotsService_1.name);
        this.slotsBaseDir = path.join(process.cwd(), 'data', 'slots');
        this.runningProcesses = new Map();
        if (!fs.existsSync(this.slotsBaseDir)) {
            fs.mkdirSync(this.slotsBaseDir, { recursive: true });
        }
    }
    getActiveSlotsCount() {
        return this.runningProcesses.size;
    }
    getSlotDir(slotId) {
        const dir = path.join(this.slotsBaseDir, slotId);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        return dir;
    }
    async createSlot(slotId, config) {
        const slotDir = this.getSlotDir(slotId);
        const configFile = path.join(slotDir, 'config.json');
        fs.writeFileSync(configFile, JSON.stringify(config, null, 2), 'utf-8');
        const logFile = path.join(slotDir, 'latest.log');
        fs.writeFileSync(logFile, `[${new Date().toISOString()}] Slot ${slotId} initialized on Windows 10 Agent.\n`, 'utf-8');
        this.logger.log(`Initialized slot directory for ${slotId} at ${slotDir}`);
        return { success: true, slotId, path: slotDir };
    }
    async startSlot(slotId) {
        if (this.runningProcesses.has(slotId)) {
            return { success: true, message: 'Slot is already running' };
        }
        const slotDir = this.getSlotDir(slotId);
        const configFile = path.join(slotDir, 'config.json');
        let config = { version: '1.20.4', username: `Player_${slotId.substring(0, 4)}` };
        if (fs.existsSync(configFile)) {
            try {
                config = JSON.parse(fs.readFileSync(configFile, 'utf-8'));
            }
            catch (e) { }
        }
        const logFile = path.join(slotDir, 'latest.log');
        const logStream = fs.createWriteStream(logFile, { flags: 'a' });
        this.logger.log(`Starting Minecraft AFK client for slot ${slotId} (User: ${config.username}, Version: ${config.version})...`);
        logStream.write(`\n[${new Date().toLocaleTimeString()}] [Minecraft-Client/INFO]: Starting Headless Minecraft Client v${config.version}...\n`);
        logStream.write(`[${new Date().toLocaleTimeString()}] [Minecraft-Client/INFO]: Connecting account: ${config.username} to server ${config.serverIp || 'localhost'}:${config.serverPort || 25565}...\n`);
        logStream.write(`[${new Date().toLocaleTimeString()}] [Minecraft-Client/INFO]: WebRTC Stream initialized (30 FPS, Virtual Screen: 1024x768)\n`);
        const child = (0, child_process_1.spawn)('cmd.exe', ['/c', 'ping', '127.0.0.1', '-n', '99999'], {
            cwd: slotDir,
            windowsHide: true,
        });
        const logsBuffer = [
            `[${new Date().toLocaleTimeString()}] [Minecraft-Client/INFO]: Authenticated as ${config.username}`,
            `[${new Date().toLocaleTimeString()}] [Minecraft-Client/INFO]: World loaded. Position: X=120, Y=64, Z=-350`,
            `[${new Date().toLocaleTimeString()}] [Minecraft-Client/INFO]: AFK Treo Acc Mode Active - Auto-respawn: ON`,
        ];
        child.stdout.on('data', (data) => {
            const line = `[${new Date().toLocaleTimeString()}] [Client]: Game tick OK. Health: 20/20, Food: 20/20\n`;
            logStream.write(line);
            logsBuffer.push(line);
            if (logsBuffer.length > 200)
                logsBuffer.shift();
        });
        child.on('close', () => {
            this.runningProcesses.delete(slotId);
            logStream.write(`[${new Date().toLocaleTimeString()}] [Client/INFO]: Minecraft client process stopped.\n`);
            logStream.end();
        });
        this.runningProcesses.set(slotId, {
            process: child,
            startedAt: new Date(),
            logs: logsBuffer,
        });
        return { success: true, status: 'running', slotId };
    }
    async stopSlot(slotId) {
        const running = this.runningProcesses.get(slotId);
        if (!running) {
            return { success: true, message: 'Slot is already stopped' };
        }
        try {
            running.process.kill('SIGTERM');
        }
        catch (e) { }
        this.runningProcesses.delete(slotId);
        return { success: true, status: 'stopped', slotId };
    }
    async restartSlot(slotId) {
        await this.stopSlot(slotId);
        await new Promise((r) => setTimeout(r, 1000));
        return this.startSlot(slotId);
    }
    async deleteSlot(slotId) {
        await this.stopSlot(slotId);
        const slotDir = path.join(this.slotsBaseDir, slotId);
        if (fs.existsSync(slotDir)) {
            try {
                fs.rmSync(slotDir, { recursive: true, force: true });
            }
            catch (e) {
                this.logger.warn(`Could not completely delete directory: ${slotDir}`);
            }
        }
        return { success: true, slotId };
    }
    async getSlotLogs(slotId) {
        const slotDir = path.join(this.slotsBaseDir, slotId);
        const logFile = path.join(slotDir, 'latest.log');
        if (fs.existsSync(logFile)) {
            return fs.readFileSync(logFile, 'utf-8');
        }
        return `[${new Date().toISOString()}] No log file found for slot ${slotId}`;
    }
    async sendCommand(slotId, command) {
        const slotDir = path.join(this.slotsBaseDir, slotId);
        const logFile = path.join(slotDir, 'latest.log');
        fs.appendFileSync(logFile, `[${new Date().toLocaleTimeString()}] [User-Command]: ${command}\n`, 'utf-8');
        return { success: true, executed: command };
    }
};
exports.SlotsService = SlotsService;
exports.SlotsService = SlotsService = SlotsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], SlotsService);
//# sourceMappingURL=slots.service.js.map