import { Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { FilesService } from './files.service';
import { SlotsService } from '../slots/slots.service';
import { FirebaseAuthGuard } from '../auth/guards/firebase-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';

@Controller('api/slots/:slotId/files')
@UseGuards(FirebaseAuthGuard)
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly slotsService: SlotsService
  ) {}

  @Get()
  async listFiles(
    @Param('slotId') slotId: string,
    @Query('path') path: string = '/',
    @CurrentUser() user: AuthenticatedUser
  ) {
    await this.slotsService.verifyOwnership(slotId, user.uid, true, user.role);
    return this.filesService.listFiles(slotId, path);
  }

  @Post('upload')
  async uploadFile(
    @Param('slotId') slotId: string,
    @Query('path') path: string = '/',
    @Req() req: any,
    @CurrentUser() user: AuthenticatedUser
  ) {
    await this.slotsService.verifyOwnership(slotId, user.uid, true, user.role);
    // In a real implementation, interceptors like FileInterceptor would be used.
    // For proxying to agent, we might stream the request or pass the form data.
    return { success: true, message: 'Upload proxy placeholder' };
  }

  @Delete()
  async deleteFile(
    @Param('slotId') slotId: string,
    @Query('path') path: string,
    @CurrentUser() user: AuthenticatedUser
  ) {
    await this.slotsService.verifyOwnership(slotId, user.uid, true, user.role);
    return this.filesService.deleteFile(slotId, path);
  }

  @Post('folder')
  async createFolder(
    @Param('slotId') slotId: string,
    @Query('path') path: string,
    @CurrentUser() user: AuthenticatedUser
  ) {
    await this.slotsService.verifyOwnership(slotId, user.uid, true, user.role);
    return this.filesService.createFolder(slotId, path);
  }
}
