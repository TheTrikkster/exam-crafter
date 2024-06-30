import { Module } from '@nestjs/common';
import { CorrectExamService } from './correct_exam.service';
import { CorrectExamController } from './correct_exam.controller';

@Module({
  controllers: [CorrectExamController],
  providers: [CorrectExamService],
})
export class CorrectExamModule {}
