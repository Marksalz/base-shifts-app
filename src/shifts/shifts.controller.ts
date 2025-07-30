import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { ShiftsService } from './shifts.service';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';
import { AuthGuard } from '../auth/auth.guard';
import { AuthenticatedRequest } from '../types/request.types'

@Controller('shifts')
@UseGuards(AuthGuard)
export class ShiftsController {
  constructor(private readonly shiftsService: ShiftsService) { }

  @Post('create')
  create(@Body() createShiftDto: CreateShiftDto, @Req() req: AuthenticatedRequest) {
    if (req.user.role !== 'commander') {
      throw new ForbiddenException('Only commanders can create shifts');
    }
    return this.shiftsService.create(createShiftDto);
  }

  @Get('read')
  findAll(@Req() req: AuthenticatedRequest) {
    const { role } = req.user;

    if (role === 'commander') {
      return this.shiftsService.findAll();
    } else if (role === 'soldier') {
      throw new ForbiddenException('Only commanders can view all shifts');
    } else {
      throw new ForbiddenException('Access denied');
    }
  }

  @Get('read:id')
  findOne(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    const { role } = req.user;

    if (role === 'commander') {
      return this.shiftsService.findOne(+id);
    } else if (role === 'soldier') {
      throw new ForbiddenException('Only commanders can view individual shifts');
    } else {
      throw new ForbiddenException('Access denied');
    }
  }

  @Patch('update:id')
  update(@Param('id') id: string, @Body() updateShiftDto: UpdateShiftDto, @Req() req: AuthenticatedRequest) {
    if (req.user.role !== 'commander') {
      throw new ForbiddenException('Only commanders can update shifts');
    }
    return this.shiftsService.update(+id, updateShiftDto);
  }

  @Delete('delete:id')
  remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    if (req.user.role !== 'commander') {
      throw new ForbiddenException('Only commanders can delete shifts');
    }
    return this.shiftsService.remove(+id);
  }
}
