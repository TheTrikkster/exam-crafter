import { Test, TestingModule } from '@nestjs/testing';
import { CorrectExamController } from './correct_exam.controller';
import { CorrectExamService } from './correct_exam.service';

describe('CorrectExamController', () => {
  let controller: CorrectExamController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CorrectExamController],
      providers: [CorrectExamService],
    }).compile();

    controller = module.get<CorrectExamController>(CorrectExamController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
