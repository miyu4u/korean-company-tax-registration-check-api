import { Test, TestingModule } from '@nestjs/testing';
import { CompanyNumberService } from './company-number.service';

describe('CompanyNumberService', () => {
  let service: CompanyNumberService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompanyNumberService],
    }).compile();

    service = module.get<CompanyNumberService>(CompanyNumberService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
