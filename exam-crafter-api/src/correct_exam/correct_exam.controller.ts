import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { CorrectExamService } from './correct_exam.service';
import { CreateCorrectExamDto } from './dto/create-correct_exam.dto';
import { UpdateCorrectExamDto } from './dto/update-correct_exam.dto';
import { TimeoutInterceptor } from 'src/TimeoutInterceptor';

@Controller('correct-exam')
@UseInterceptors(TimeoutInterceptor)
export class CorrectExamController {
  constructor(private readonly correctExamService: CorrectExamService) {}

  @Post()
  create(@Body() createCorrectExamDto: CreateCorrectExamDto) {
    return this.correctExamService.create(createCorrectExamDto);
  }

  @Get()
  findAll() {
    return this.correctExamService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.correctExamService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCorrectExamDto: UpdateCorrectExamDto,
  ) {
    return this.correctExamService.update(+id, updateCorrectExamDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.correctExamService.remove(+id);
  }
}
