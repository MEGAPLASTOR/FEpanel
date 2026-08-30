import { apiClient } from '@/lib/api-client';

export interface Slot {
  id: string;
  name: string;
  status: 'ONLINE' | 'OFFLINE' | 'STARTING' | 'STOPPING' | 'ERROR';
  version: string;
  ramUsage: number;
  maxRam: number;
  cpuUsage: number;
  players: number;
  maxPlayers: number;
  uptime: number;
  port: number;
  ip: string;
}

export const slotService = {
  async getMySlots(): Promise<Slot[]> {
    const response = await apiClient.get('/slots');
    return response.data;
  },

  async getSlot(id: string): Promise<Slot> {
    const response = await apiClient.get(`/slots/${id}`);
    return response.data;
  },

  async startSlot(id: string): Promise<void> {
    await apiClient.post(`/slots/${id}/start`);
  },

  async stopSlot(id: string): Promise<void> {
    await apiClient.post(`/slots/${id}/stop`);
  },

  async restartSlot(id: string): Promise<void> {
    await apiClient.post(`/slots/${id}/restart`);
  },

  async createSlot(data: any): Promise<Slot> {
    const response = await apiClient.post('/slots', data);
    return response.data;
  },

  async deleteSlot(id: string): Promise<void> {
    await apiClient.delete(`/slots/${id}`);
  },

  async updateSlot(id: string, data: any): Promise<Slot> {
    const response = await apiClient.patch(`/slots/${id}`, data);
    return response.data;
  }
};
