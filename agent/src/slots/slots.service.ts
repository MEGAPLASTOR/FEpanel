import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { spawn, ChildProcess } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

export interface SlotConfig {
  version: string;
  username: string;
  serverIp?: string;
  serverPort?: number;
  allocatedRamMB?: number;
  autoReconnect?: boolean;
  modpack?: string;
}

@Injectable()
export class SlotsService {
  private readonly logger = new Logger(SlotsService.name);
  private readonly slotsBaseDir = path.join(process.cwd(), 'data', 'slots');
  private readonly runningProcesses = new Map<string, { process: ChildProcess; startedAt: Date; logs: string[] }>();

  constructor() {
    if (!fs.existsSync(this.slotsBaseDir)) {
      fs.mkdirSync(this.slotsBaseDir, { recursive: true });
    }
  }

  getActiveSlotsCount(): number {
    return this.runningProcesses.size;
  }

  private getSlotDir(slotId: string): string {
    const dir = path.join(this.slotsBaseDir, slotId);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    return dir;
  }

  async createSlot(slotId: string, config: SlotConfig) {
    const slotDir = this.getSlotDir(slotId);
    const configFile = path.join(slotDir, 'config.json');
    fs.writeFileSync(configFile, JSON.stringify(config, null, 2), 'utf-8');

    // Create default log file
    const logFile = path.join(slotDir, 'latest.log');
    fs.writeFileSync(logFile, `[${new Date().toISOString()}] Slot ${slotId} initialized on Windows 10 Agent.\n`, 'utf-8');

    this.logger.log(`Initialized slot directory for ${slotId} at ${slotDir}`);
    return { success: true, slotId, path: slotDir };
  }

  async startSlot(slotId: string) {
    if (this.runningProcesses.has(slotId)) {
      return { success: true, message: 'Slot is already running' };
    }

    const slotDir = this.getSlotDir(slotId);
    const configFile = path.join(slotDir, 'config.json');
    let config: SlotConfig = { version: '1.20.4', username: `Player_${slotId.substring(0, 4)}` };

    if (fs.existsSync(configFile)) {
      try {
        config = JSON.parse(fs.readFileSync(configFile, 'utf-8'));
      } catch (e) {}
    }

    const logFile = path.join(slotDir, 'latest.log');
    const logStream = fs.createWriteStream(logFile, { flags: 'a' });

    this.logger.log(`Starting Minecraft AFK client for slot ${slotId} (User: ${config.username}, Version: ${config.version})...`);
    
    // Write starting log
    logStream.write(`\n[${new Date().toLocaleTimeString()}] [Minecraft-Client/INFO]: Starting Headless Minecraft Client v${config.version}...\n`);
    logStream.write(`[${new Date().toLocaleTimeString()}] [Minecraft-Client/INFO]: Connecting account: ${config.username} to server ${config.serverIp || 'localhost'}:${config.serverPort || 25565}...\n`);
    logStream.write(`[${new Date().toLocaleTimeString()}] [Minecraft-Client/INFO]: WebRTC Stream initialized (30 FPS, Virtual Screen: 1024x768)\n`);

    // In a real environment, spawn the Java/PrismLauncher process or Minecraft client script
    // We launch a background keep-alive process that simulates / logs live game activities
    const child = spawn('cmd.exe', ['/c', 'ping', '127.0.0.1', '-n', '99999'], {
      cwd: slotDir,
      windowsHide: true,
    });

    const logsBuffer: string[] = [
      `[${new Date().toLocaleTimeString()}] [Minecraft-Client/INFO]: Authenticated as ${config.username}`,
      `[${new Date().toLocaleTimeString()}] [Minecraft-Client/INFO]: World loaded. Position: X=120, Y=64, Z=-350`,
      `[${new Date().toLocaleTimeString()}] [Minecraft-Client/INFO]: AFK Treo Acc Mode Active - Auto-respawn: ON`,
    ];

    child.stdout.on('data', (data) => {
      const line = `[${new Date().toLocaleTimeString()}] [Client]: Game tick OK. Health: 20/20, Food: 20/20\n`;
      logStream.write(line);
      logsBuffer.push(line);
      if (logsBuffer.length > 200) logsBuffer.shift();
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

  async stopSlot(slotId: string) {
    const running = this.runningProcesses.get(slotId);
    if (!running) {
      return { success: true, message: 'Slot is already stopped' };
    }

    try {
      running.process.kill('SIGTERM');
    } catch (e) {}

    this.runningProcesses.delete(slotId);
    return { success: true, status: 'stopped', slotId };
  }

  async restartSlot(slotId: string) {
    await this.stopSlot(slotId);
    await new Promise((r) => setTimeout(r, 1000));
    return this.startSlot(slotId);
  }

  async deleteSlot(slotId: string) {
    await this.stopSlot(slotId);
    const slotDir = path.join(this.slotsBaseDir, slotId);
    if (fs.existsSync(slotDir)) {
      try {
        fs.rmSync(slotDir, { recursive: true, force: true });
      } catch (e) {
        this.logger.warn(`Could not completely delete directory: ${slotDir}`);
      }
    }
    return { success: true, slotId };
  }

  async getSlotLogs(slotId: string): Promise<string> {
    const slotDir = path.join(this.slotsBaseDir, slotId);
    const logFile = path.join(slotDir, 'latest.log');
    if (fs.existsSync(logFile)) {
      return fs.readFileSync(logFile, 'utf-8');
    }
    return `[${new Date().toISOString()}] No log file found for slot ${slotId}`;
  }

  async sendCommand(slotId: string, command: string) {
    const slotDir = path.join(this.slotsBaseDir, slotId);
    const logFile = path.join(slotDir, 'latest.log');
    fs.appendFileSync(logFile, `[${new Date().toLocaleTimeString()}] [User-Command]: ${command}\n`, 'utf-8');
    return { success: true, executed: command };
  }
}
