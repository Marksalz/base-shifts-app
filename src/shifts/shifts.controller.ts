import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ShiftsService } from './shifts.service';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';

@Controller('shifts')
export class ShiftsController {
  constructor(private readonly shiftsService: ShiftsService) { }

  @Post('create')
  create(@Body() createShiftDto: CreateShiftDto) {
    return this.shiftsService.create(createShiftDto);
  }

  @Get('read')
  findAll() {
    return this.shiftsService.findAll();
  }

  @Get('read:id')
  findOne(@Param('id') id: string) {
    return this.shiftsService.findOne(+id);
  }

  @Patch('update:id')
  update(@Param('id') id: string, @Body() updateShiftDto: UpdateShiftDto) {
    return this.shiftsService.update(+id, updateShiftDto);
  }

  @Delete('delete:id')
  remove(@Param('id') id: string) {
    return this.shiftsService.remove(+id);
  }
}
