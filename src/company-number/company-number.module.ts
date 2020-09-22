import { HttpModule, Module } from '@nestjs/common';
import { CompanyNumberController } from './company-number.controller';
import { CompanyNumberService } from './company-number.service';
import { HttpProvider } from './http.provider';

@Module({
  imports:[],
  controllers: [CompanyNumberController],
  providers: [CompanyNumberService,HttpProvider]
})
export class CompanyNumberModule {}
