import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class DiscordService {
  private readonly logger = new Logger(DiscordService.name);
  private get webhookUrl() {
    return process.env.DISCORD_WEBHOOK_URL;
  }

  async sendNotification(message: string) {
    if (!this.webhookUrl) {
      this.logger.warn('Discord webhook URL not configured');
      return;
    }

    try {
      await axios.post(this.webhookUrl, {
        content: message,
      });
    } catch (error: any) {
      this.logger.error(`Failed to send Discord notification: ${error.message}`);
    }
  }
}
