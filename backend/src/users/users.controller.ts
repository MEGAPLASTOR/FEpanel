import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { FirebaseAuthGuard } from '../auth/guards/firebase-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('api/users')
@UseGuards(FirebaseAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getMe(@CurrentUser() user: AuthenticatedUser) {
    return this.usersService.getUser(user.uid);
  }

  @Put('me')
  updateMe(@CurrentUser() user: AuthenticatedUser, @Body() data: UpdateUserDto) {
    // Users can only update their own display name
    const updateData = new UpdateUserDto();
    updateData.displayName = data.displayName;
    return this.usersService.updateUser(user.uid, updateData);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  listUsers() {
    return this.usersService.listUsers();
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  createUser(@Body() data: CreateUserDto) {
    return this.usersService.createUser(data);
  }

  @Get(':uid')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  getUser(@Param('uid') uid: string) {
    return this.usersService.getUser(uid);
  }

  @Put(':uid')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  updateUser(@Param('uid') uid: string, @Body() data: UpdateUserDto) {
    return this.usersService.updateUser(uid, data);
  }

  @Delete(':uid')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  deleteUser(@Param('uid') uid: string) {
    return this.usersService.deleteUser(uid);
  }
}
