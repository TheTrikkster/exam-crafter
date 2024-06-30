import { Injectable } from '@nestjs/common';
import { CreateCreateExamDto } from './dto/create-create_exam.dto';
import { UpdateCreateExamDto } from './dto/update-create_exam.dto';
import { GeneratedExam } from 'src/openaiCreate';

@Injectable()
export class CreateExamService {
  async create(createCreateExamDto: CreateCreateExamDto) {
    return await GeneratedExam(createCreateExamDto);
  }

  findAll() {
    return `This action returns all createExam`;
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} createExam`;
  // }

  // update(id: number, updateCreateExamDto: UpdateCreateExamDto) {
  //   return `This action updates a #${id} createExam`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} createExam`;
  // }
}
