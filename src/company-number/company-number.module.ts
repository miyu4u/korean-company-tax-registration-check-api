import { HttpModule, Module } from '@nestjs/common';
import { CompanyNumberController } from './company-number.controller';
import { CompanyNumberService } from './company-number.service';

@Module({
  imports:[HttpModule],
  controllers: [CompanyNumberController],
  providers: [CompanyNumberService]
})
export class CompanyNumberModule {}
