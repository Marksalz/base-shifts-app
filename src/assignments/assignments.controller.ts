import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard, Roles } from '../auth/roles.guard';
import { AuthenticatedRequest } from '../types/request.types';

@Controller('assignments')
@UseGuards(AuthGuard, RolesGuard)
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) { }

  @Post('create')
  @Roles('commander')
  create(@Body() createAssignmentDto: CreateAssignmentDto) {
    return this.assignmentsService.create(createAssignmentDto);
  }

  @Get('read')
  @Roles('commander')
  findAll() {
    return this.assignmentsService.findAll();
  }

  @Get('read/:userId')
  @Roles('commander', 'soldier')
  findByUserId(@Param('userId') userId: number, @Req() req: AuthenticatedRequest) {
    const { role, id: currentUserId } = req.user;

    if (role === 'soldier' && currentUserId !== userId) {
      throw new ForbiddenException('Soldiers can only access their own assignments');
    }

    return this.assignmentsService.findByUserId(userId);
  }

  @Patch('update/:id')
  @Roles('commander')
  update(@Param('id') id: number, @Body() updateAssignmentDto: UpdateAssignmentDto) {
    return this.assignmentsService.update(id, updateAssignmentDto);
  }

  @Delete('delete/:id')
  @Roles('commander')
  remove(@Param('id') id: number) {
    return this.assignmentsService.remove(id);
  }
}
