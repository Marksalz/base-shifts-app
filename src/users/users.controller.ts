import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard, Roles } from '../auth/roles.guard';
import { AuthenticatedRequest } from '../types/request.types';

@Controller('users')
@UseGuards(AuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('create')
  @Roles('commander')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('read')
  @Roles('commander')
  findAll() {
    return this.usersService.findAll();
  }

  @Get('read/:id')
  @Roles('commander', 'soldier')
  findOne(@Param('id') id: number, @Req() req: AuthenticatedRequest) {
    const { role, id: userId } = req.user;

    if (role === 'soldier' && id !== userId) {
      throw new ForbiddenException('You can only view your own profile');
    }

    return this.usersService.findOne(id);
  }

  @Patch('update/:id')
  @Roles('commander')
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto, @Req() req: AuthenticatedRequest) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete('delete/:id')
  @Roles('commander')
  remove(@Param('id') id: number) {
    return this.usersService.remove(id);
  }
}
