import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { SlotsService } from './slots.service';
import { FirebaseAuthGuard } from '../auth/guards/firebase-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { CreateSlotDto } from './dto/create-slot.dto';
import { UpdateSlotDto } from './dto/update-slot.dto';

@Controller('api/slots')
@UseGuards(FirebaseAuthGuard)
export class SlotsController {
  constructor(private readonly slotsService: SlotsService) {}

  @Get()
  getSlots(@CurrentUser() user: AuthenticatedUser) {
    if (user.role === 'ADMIN') {
      // For phase 2 brevity: Admin could see all, but let's stick to spec.
      // Usually would query all, but if we need just owner's slots:
    }
    return this.slotsService.getSlotsByOwner(user.uid);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  createSlot(@Body() data: CreateSlotDto) {
    return this.slotsService.createSlot(data);
  }

  @Get(':slotId')
  async getSlot(@Param('slotId') slotId: string, @CurrentUser() user: AuthenticatedUser) {
    await this.slotsService.verifyOwnership(slotId, user.uid, true, user.role);
    return this.slotsService.getSlot(slotId);
  }

  @Put(':slotId')
  async updateSlot(
    @Param('slotId') slotId: string,
    @Body() data: UpdateSlotDto,
    @CurrentUser() user: AuthenticatedUser
  ) {
    await this.slotsService.verifyOwnership(slotId, user.uid, true, user.role);
    return this.slotsService.updateSlot(slotId, data);
  }

  @Delete(':slotId')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  deleteSlot(@Param('slotId') slotId: string) {
    return this.slotsService.deleteSlot(slotId);
  }

  @Post(':slotId/start')
  async startSlot(@Param('slotId') slotId: string, @CurrentUser() user: AuthenticatedUser) {
    await this.slotsService.verifyOwnership(slotId, user.uid, true, user.role);
    return this.slotsService.startSlot(slotId);
  }

  @Post(':slotId/stop')
  async stopSlot(@Param('slotId') slotId: string, @CurrentUser() user: AuthenticatedUser) {
    await this.slotsService.verifyOwnership(slotId, user.uid, true, user.role);
    return this.slotsService.stopSlot(slotId);
  }

  @Post(':slotId/restart')
  async restartSlot(@Param('slotId') slotId: string, @CurrentUser() user: AuthenticatedUser) {
    await this.slotsService.verifyOwnership(slotId, user.uid, true, user.role);
    return this.slotsService.restartSlot(slotId);
  }

  @Get(':slotId/logs')
  async getSlotLogs(@Param('slotId') slotId: string, @CurrentUser() user: AuthenticatedUser) {
    await this.slotsService.verifyOwnership(slotId, user.uid, true, user.role);
    return this.slotsService.getSlotLogs(slotId);
  }
}
