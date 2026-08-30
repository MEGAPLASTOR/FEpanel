import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { NodesService } from './nodes.service';
import { CreateNodeDto } from './dto/create-node.dto';
import { UpdateNodeDto } from './dto/update-node.dto';
import { FirebaseAuthGuard } from '../auth/guards/firebase-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('nodes')
@UseGuards(FirebaseAuthGuard, RolesGuard)
export class NodesController {
  constructor(private readonly nodesService: NodesService) {}

  @Post()
  @Roles('ADMIN')
  create(@Body() createNodeDto: CreateNodeDto) {
    return this.nodesService.create(createNodeDto);
  }

  @Get()
  @Roles('ADMIN')
  findAll() {
    return this.nodesService.findAll();
  }

  @Get(':id')
  @Roles('ADMIN')
  findOne(@Param('id') id: string) {
    return this.nodesService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() updateNodeDto: UpdateNodeDto) {
    return this.nodesService.update(id, updateNodeDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.nodesService.remove(id);
  }

  @Post('heartbeat')
  handleHeartbeat(@Body() body: any) {
    return this.nodesService.handleHeartbeat(body);
  }

  @Post(':id/ping')
  @Roles('ADMIN')
  ping(@Param('id') id: string) {
    return this.nodesService.pingNode(id);
  }
}
