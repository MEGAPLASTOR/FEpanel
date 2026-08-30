import { Injectable } from '@nestjs/common';
import { AgentService } from '../agent/agent.service';

@Injectable()
export class StreamingService {
  constructor(private readonly agentService: AgentService) {}

  async createSession(slotId: string) {
    return this.agentService.createStreamSession(slotId);
  }
}
