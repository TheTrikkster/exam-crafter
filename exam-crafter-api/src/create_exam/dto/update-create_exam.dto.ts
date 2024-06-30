import { PartialType } from '@nestjs/mapped-types';
import { CreateCreateExamDto } from './create-create_exam.dto';

export class UpdateCreateExamDto extends PartialType(CreateCreateExamDto) {}
