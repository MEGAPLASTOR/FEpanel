import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AgentService {
  private get agentUrl() {
    return process.env.AGENT_URL || 'http://localhost:5000';
  }

  private get headers() {
    return {
      'Authorization': `Bearer ${process.env.AGENT_SECRET_KEY}`,
      'Content-Type': 'application/json',
    };
  }

  private async request(method: string, endpoint: string, data?: any) {
    try {
      const response = await axios({
        method,
        url: `${this.agentUrl}${endpoint}`,
        headers: this.headers,
        data,
      });
      return response.data;
    } catch (error: any) {
      const status = error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
      const message = error.response?.data?.message || error.message;
      throw new HttpException(`Agent Error: ${message}`, status);
    }
  }

  async createContainer(slotId: string, config: any) {
    return this.request('POST', `/api/containers`, { slotId, ...config });
  }

  async startContainer(slotId: string) {
    return this.request('POST', `/api/containers/${slotId}/start`);
  }

  async stopContainer(slotId: string) {
    return this.request('POST', `/api/containers/${slotId}/stop`);
  }

  async restartContainer(slotId: string) {
    return this.request('POST', `/api/containers/${slotId}/restart`);
  }

  async deleteContainer(slotId: string) {
    return this.request('DELETE', `/api/containers/${slotId}`);
  }

  async getContainerStats(slotId: string) {
    return this.request('GET', `/api/containers/${slotId}/stats`);
  }

  async getContainerLogs(slotId: string) {
    return this.request('GET', `/api/containers/${slotId}/logs`);
  }

  async uploadFile(slotId: string, path: string, formData: any, fileHeaders: any) {
    // Requires special handling for multipart/form-data
    try {
      const response = await axios.post(`${this.agentUrl}/api/files/${slotId}/upload?path=${encodeURIComponent(path)}`, formData, {
        headers: {
          'Authorization': `Bearer ${process.env.AGENT_SECRET_KEY}`,
          ...fileHeaders,
        },
      });
      return response.data;
    } catch (error: any) {
      throw new HttpException(`Agent File Upload Error: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async listFiles(slotId: string, path: string = '/') {
    return this.request('GET', `/api/files/${slotId}?path=${encodeURIComponent(path)}`);
  }

  async deleteFile(slotId: string, path: string) {
    return this.request('DELETE', `/api/files/${slotId}?path=${encodeURIComponent(path)}`);
  }

  async createStreamSession(slotId: string) {
    return this.request('POST', `/api/stream/${slotId}`);
  }
}
