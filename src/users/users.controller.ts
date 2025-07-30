import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../auth/auth.guard';
import { AuthenticatedRequest } from '../types/request.types'

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('create')
  create(@Body() createUserDto: CreateUserDto, @Req() req: AuthenticatedRequest) {
    console.log(req.user);

    // Only commanders can create users
    if (req.user.role !== 'commander') {
      throw new ForbiddenException('Only commanders can create users');
    }
    return this.usersService.create(createUserDto);
  }

  @Get('read')
  findAll(@Req() req: AuthenticatedRequest) {
    // Only commanders can see all users
    if (req.user.role !== 'commander') {
      throw new ForbiddenException('Only commanders can view all users');
    }
    return this.usersService.findAll();
  }

  @Get('read/:id')
  findOne(@Param('id') id: number, @Req() req: AuthenticatedRequest) {
    const { role, id: userId } = req.user;

    if (role === 'commander') {
      return this.usersService.findOne(+id);
    } else if (role === 'soldier') {
      if (id !== userId) {
        throw new ForbiddenException('You can only view your own profile');
      }
      return this.usersService.findOne(id);
    } else {
      throw new ForbiddenException('Access denied');
    }
  }

  @Patch('update/:id')
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto, @Req() req: AuthenticatedRequest) {
    const { role, id: userId } = req.user;

    if (role === 'commander') {
      return this.usersService.update(id, updateUserDto);
    } else if (role === 'soldier') {
      if (id !== userId) {
        throw new ForbiddenException('You can only update your own profile');
      }
      return this.usersService.update(id, updateUserDto);
    } else {
      throw new ForbiddenException('Access denied');
    }
  }

  @Delete('delete/:id')
  remove(@Param('id') id: number, @Req() req: AuthenticatedRequest) {
    if (req.user.role !== 'commander') {
      throw new ForbiddenException('Only commanders can delete users');
    }
    return this.usersService.remove(id);
  }
}
