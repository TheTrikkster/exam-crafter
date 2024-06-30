import { Test, TestingModule } from '@nestjs/testing';
import { CorrectExamService } from './correct_exam.service';

describe('CorrectExamService', () => {
  let service: CorrectExamService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CorrectExamService],
    }).compile();

    service = module.get<CorrectExamService>(CorrectExamService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
