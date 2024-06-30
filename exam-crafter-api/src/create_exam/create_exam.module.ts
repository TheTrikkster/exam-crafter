import { Module } from '@nestjs/common';
import { CreateExamService } from './create_exam.service';
import { CreateExamController } from './create_exam.controller';

@Module({
  controllers: [CreateExamController],
  providers: [CreateExamService],
})
export class CreateExamModule {}
