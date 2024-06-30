import { PartialType } from '@nestjs/mapped-types';
import { CreateCorrectExamDto } from './create-correct_exam.dto';

export class UpdateCorrectExamDto extends PartialType(CreateCorrectExamDto) {}
