import { Controller, Param, Post, UseGuards } from '@nestjs/common';
import { StreamingService } from './streaming.service';
import { SlotsService } from '../slots/slots.service';
import { FirebaseAuthGuard } from '../auth/guards/firebase-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';

@Controller('api/slots/:slotId/stream')
@UseGuards(FirebaseAuthGuard)
export class StreamingController {
  constructor(
    private readonly streamingService: StreamingService,
    private readonly slotsService: SlotsService
  ) {}

  @Post()
  async createSession(
    @Param('slotId') slotId: string,
    @CurrentUser() user: AuthenticatedUser
  ) {
    await this.slotsService.verifyOwnership(slotId, user.uid, true, user.role);
    return this.streamingService.createSession(slotId);
  }
}
