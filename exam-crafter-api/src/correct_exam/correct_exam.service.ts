import { Injectable } from '@nestjs/common';
import { CreateCorrectExamDto } from './dto/create-correct_exam.dto';
import { UpdateCorrectExamDto } from './dto/update-correct_exam.dto';
import { GeneratedCorrection } from 'src/openaiCorrect';

@Injectable()
export class CorrectExamService {
  async create(createCorrectExamDto: CreateCorrectExamDto) {
    return GeneratedCorrection(createCorrectExamDto);
  }

  findAll() {
    return `This action returns all correctExam`;
  }

  findOne(id: number) {
    return `This action returns a #${id} correctExam`;
  }

  update(id: number, updateCorrectExamDto: UpdateCorrectExamDto) {
    return `This action updates a #${id} correctExam`;
  }

  remove(id: number) {
    return `This action removes a #${id} correctExam`;
  }
}
