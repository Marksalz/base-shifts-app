import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { AuthGuard } from '../auth/auth.guard';
import { AuthenticatedRequest } from '../types/request.types'

@Controller('assignments')
@UseGuards(AuthGuard)
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) { }

  @Post('create')
  create(@Body() createAssignmentDto: CreateAssignmentDto, @Req() req: AuthenticatedRequest) {
    if (req.user.role !== 'commander') {
      throw new ForbiddenException('Only commanders can create assignments');
    }
    return this.assignmentsService.create(createAssignmentDto);
  }

  @Get('read')
  findAll(@Req() req: AuthenticatedRequest) {
    const { role } = req.user;

    if (role === 'commander') {
      return this.assignmentsService.findAll();
    } else if (role === 'soldier') {
      throw new ForbiddenException('Only commanders can view all assignments');
    } else {
      throw new ForbiddenException('Access denied');
    }
  }

  @Get('read/:userId')
  findByUserId(@Param('userId') userId: number, @Req() req: AuthenticatedRequest) {
    const { role, id: currentUserId } = req.user;

    if (role === 'commander') {
      return this.assignmentsService.findByUserId(userId);
    } else if (role === 'soldier') {
      if (currentUserId !== userId) {
        throw new ForbiddenException('Soldiers can only access their own assignments');
      }
      return this.assignmentsService.findByUserId(userId);
    } else {
      throw new ForbiddenException('Access denied');
    }
  }

  @Patch('update/:id')
  update(@Param('id') id: number, @Body() updateAssignmentDto: UpdateAssignmentDto, @Req() req: AuthenticatedRequest) {
    if (req.user.role !== 'commander') {
      throw new ForbiddenException('Only commanders can update assignments');
    }
    return this.assignmentsService.update(id, updateAssignmentDto);
  }

  @Delete('delete/:id')
  remove(@Param('id') id: number, @Req() req: AuthenticatedRequest) {
    if (req.user.role !== 'commander') {
      throw new ForbiddenException('Only commanders can delete assignments');
    }
    return this.assignmentsService.remove(id);
  }
}
