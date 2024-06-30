import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Options } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('Options')
    private noteModel: mongoose.Model<Options>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const newNote = await this.noteModel.create(createUserDto);
    return newNote;
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
