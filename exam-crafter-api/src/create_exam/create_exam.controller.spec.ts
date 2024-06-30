import { Test, TestingModule } from '@nestjs/testing';
import { CreateExamController } from './create_exam.controller';
import { CreateExamService } from './create_exam.service';

describe('CreateExamController', () => {
  let controller: CreateExamController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreateExamController],
      providers: [CreateExamService],
    }).compile();

    controller = module.get<CreateExamController>(CreateExamController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
