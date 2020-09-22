import { Test, TestingModule } from '@nestjs/testing';
import { CompanyNumberController } from './company-number.controller';

describe('CompanyNumberController', () => {
  let controller: CompanyNumberController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyNumberController],
    }).compile();

    controller = module.get<CompanyNumberController>(CompanyNumberController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
