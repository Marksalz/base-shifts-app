import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ShiftsService } from './shifts.service';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard, Roles } from '../auth/roles.guard';

@Controller('shifts')
@UseGuards(AuthGuard, RolesGuard)
export class ShiftsController {
  constructor(private readonly shiftsService: ShiftsService) { }

  @Post('create')
  @Roles('commander')
  create(@Body() createShiftDto: CreateShiftDto) {
    return this.shiftsService.create(createShiftDto);
  }

  @Get('read')
  @Roles('commander')
  findAll() {
    return this.shiftsService.findAll();
  }

  @Get('read/:id')
  @Roles('commander')
  findOne(@Param('id') id: string) {
    return this.shiftsService.findOne(+id);
  }

  @Patch('update/:id')
  @Roles('commander')
  update(@Param('id') id: string, @Body() updateShiftDto: UpdateShiftDto) {
    return this.shiftsService.update(+id, updateShiftDto);
  }

  @Delete('delete/:id')
  @Roles('commander')
  remove(@Param('id') id: string) {
    return this.shiftsService.remove(+id);
  }
}
