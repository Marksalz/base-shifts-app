import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { Assignment } from './entities/assignment.entity';
import { Shift } from '../shifts/entities/shift.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AssignmentsService {
  constructor(
    @InjectModel(Assignment)
    private assignmentModel: typeof Assignment,
  ) { }

  async create(createAssignmentDto: CreateAssignmentDto) {
    return await this.assignmentModel.create({
      shiftId: createAssignmentDto.shiftId,
      userId: createAssignmentDto.userId
    });
  }

  async findAll(): Promise<Shift[]> {
    const assignments = await this.assignmentModel.findAll({
      include: [
        {
          model: Shift,
          required: true,
        },
        {
          model: User,
          attributes: ['id', 'username', 'email'],
        }
      ]
    });

    return assignments.map(assignment => {
      const shift = assignment.shift;
      (shift as any).assignmentId = assignment.id;
      (shift as any).assignedUser = assignment.user;
      return shift;
    });
  }

  async findOne(id: number): Promise<Assignment | null> {
    return this.assignmentModel.findByPk(id, {
      include: [
        {
          model: Shift,
          required: true,
        },
        {
          model: User,
          attributes: ['id', 'username', 'email'],
        }
      ]
    });
  }

  async findByUserId(userId: number): Promise<Shift[]> {
    const assignments = await this.assignmentModel.findAll({
      where: { userId: userId },
      include: [
        {
          model: Shift,
          required: true,
        }
      ]
    });

    return assignments.map(assignment => {
      const shift = assignment.shift;
      (shift as any).assignmentId = assignment.id;
      return shift;
    });
  }

  async update(id: number, updateAssignmentDto: UpdateAssignmentDto): Promise<Assignment> {
    await this.assignmentModel.update(updateAssignmentDto, {
      where: { id },
    });
    const updatedAssignment = await this.findOne(id);
    if (!updatedAssignment) {
      throw new Error(`Assignment with id ${id} not found`);
    }
    return updatedAssignment;
  }

  async remove(id: number): Promise<void> {
    await this.assignmentModel.destroy({
      where: { id },
    });
  }
}