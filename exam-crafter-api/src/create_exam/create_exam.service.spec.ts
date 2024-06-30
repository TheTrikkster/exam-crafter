import { Test, TestingModule } from '@nestjs/testing';
import { CreateExamService } from './create_exam.service';

describe('CreateExamService', () => {
  let service: CreateExamService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateExamService],
    }).compile();

    service = module.get<CreateExamService>(CreateExamService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
