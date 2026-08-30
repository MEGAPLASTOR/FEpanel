import { Injectable } from '@nestjs/common';
import { AgentService } from '../agent/agent.service';

@Injectable()
export class FilesService {
  constructor(private readonly agentService: AgentService) {}

  async listFiles(slotId: string, path: string) {
    return this.agentService.listFiles(slotId, path);
  }

  async uploadFile(slotId: string, path: string, formData: any, headers: any) {
    return this.agentService.uploadFile(slotId, path, formData, headers);
  }

  async deleteFile(slotId: string, path: string) {
    return this.agentService.deleteFile(slotId, path);
  }

  async createFolder(slotId: string, path: string) {
    // Placeholder for folder creation via agent
    // return this.agentService.createFolder(slotId, path);
    return { success: true, message: 'Not implemented yet' };
  }
}
