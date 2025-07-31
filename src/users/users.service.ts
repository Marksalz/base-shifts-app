import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds);

    const user = await this.userModel.create({
      username: createUserDto.username,
      email: createUserDto.email,
      password: hashedPassword,
      role: createUserDto.role,
    });

    const { password, ...userWithoutPassword } = user.get({ plain: true });
    return userWithoutPassword as User;
  }

  async findAll(): Promise<User[]> {
    return this.userModel.findAll({
      attributes: { exclude: ['password'] },
    });
  }

  async findOne(id: number): Promise<User | null> {
    return this.userModel.findByPk(id, {
      attributes: { exclude: ['password'] },
    });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({
      where: { username },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    await this.userModel.update(updateUserDto, {
      where: { id },
    });
    const updatedUser = await this.findOne(id);
    if (!updatedUser) {
      throw new Error(`User with id ${id} not found`);
    }
    return updatedUser;
  }

  async remove(id: number): Promise<void> {
    await this.userModel.destroy({
      where: { id },
    });
  }
}
