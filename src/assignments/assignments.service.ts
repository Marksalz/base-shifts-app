import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { Assignment } from './entities/assignment.entity';

@Injectable()
export class AssignmentsService {
  constructor(
    @InjectModel(Assignment)
    private assignmentModel: typeof Assignment,
  ) {}

  async create(createAssignmentDto: CreateAssignmentDto) {
    return await this.assignmentModel.create({
      shiftId: createAssignmentDto.shiftId,
      userId: createAssignmentDto.userId
    });
  }

  async findAll(): Promise<Assignment[]> {
    return this.assignmentModel.findAll();
  }

  async findOne(id: number): Promise<Assignment | null> {
    return this.assignmentModel.findByPk(id);
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