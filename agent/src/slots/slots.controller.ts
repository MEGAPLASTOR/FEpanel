import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { SlotsService, SlotConfig } from './slots.service';
import { SecretKeyGuard } from '../auth/secret.guard';

@Controller('containers')
@UseGuards(SecretKeyGuard)
export class SlotsController {
  constructor(private readonly slotsService: SlotsService) {}

  @Post('create')
  createSlot(@Body() body: { slotId: string; config?: SlotConfig }) {
    return this.slotsService.createSlot(body.slotId, body.config || { version: '1.20.4', username: 'Player' });
  }

  @Post(':id/start')
  startSlot(@Param('id') id: string) {
    return this.slotsService.startSlot(id);
  }

  @Post(':id/stop')
  stopSlot(@Param('id') id: string) {
    return this.slotsService.stopSlot(id);
  }

  @Post(':id/restart')
  restartSlot(@Param('id') id: string) {
    return this.slotsService.restartSlot(id);
  }

  @Delete(':id')
  deleteSlot(@Param('id') id: string) {
    return this.slotsService.deleteSlot(id);
  }

  @Get(':id/logs')
  getLogs(@Param('id') id: string) {
    return this.slotsService.getSlotLogs(id);
  }

  @Post(':id/command')
  sendCommand(@Param('id') id: string, @Body() body: { command: string }) {
    return this.slotsService.sendCommand(id, body.command);
  }
}
