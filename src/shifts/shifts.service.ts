import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';
import { Shift } from './entities/shift.entity';

@Injectable()
export class ShiftsService {
  constructor(
    @InjectModel(Shift)
    private readonly shiftModel: typeof Shift,
  ) {}

  async create(createShiftDto: CreateShiftDto): Promise<Shift> {
    return await this.shiftModel.create({
      startTime: createShiftDto.startTime,
      endTime: createShiftDto.endTime,
      location: createShiftDto.location,
    });
  }

  async findAll(): Promise<Shift[]> {
    return this.shiftModel.findAll();
  }

  async findOne(id: number): Promise<Shift | null> {
    return this.shiftModel.findByPk(id);
  }

  async update(id: number, updateShiftDto: UpdateShiftDto): Promise<Shift> {
    await this.shiftModel.update(updateShiftDto, {
      where: { id },
    });
    const updatedShift = await this.findOne(id);
    if (!updatedShift) {
      throw new Error(`Shift with id ${id} not found`);
    }
    return updatedShift;
  }

  async remove(id: number): Promise<void> {
    await this.shiftModel.destroy({
      where: { id },
    });
  }
}
