import { Test, TestingModule } from '@nestjs/testing';
import { CompanyNumberController } from './company-number.controller';
import { CompanyNumberService } from './company-number.service';

describe('CompanyNumberController', () => {
  let controller: CompanyNumberController;
  let service: CompanyNumberService
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyNumberController],
      providers: [
        { provide: CompanyNumberService, useValue: { check: jest.fn() } }
      ]
    }).compile();

    controller = module.get<CompanyNumberController>(CompanyNumberController);
    service = module.get<CompanyNumberService>(CompanyNumberService)
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it(`service call`, async () => {
    const spy = jest.spyOn(service, "check")
    await controller.test(12345)
    expect(spy).toHaveBeenCalledWith(12345)
  })
});
