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
import { CreateExamService } from './create_exam.service';
import { CreateCreateExamDto } from './dto/create-create_exam.dto';
import { UpdateCreateExamDto } from './dto/update-create_exam.dto';
import { TimeoutInterceptor } from 'src/TimeoutInterceptor';

@Controller('create-exam')
@UseInterceptors(TimeoutInterceptor)
export class CreateExamController {
  constructor(private readonly createExamService: CreateExamService) {}

  @Post()
  async create(@Body() createCreateExamDto: any) {
    return await this.createExamService
      .create(createCreateExamDto)
      .catch(console.error);
  }

  @Get()
  findAll() {
    return this.createExamService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.createExamService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateCreateExamDto: UpdateCreateExamDto,
  // ) {
  //   return this.createExamService.update(+id, updateCreateExamDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.createExamService.remove(+id);
  // }
}
