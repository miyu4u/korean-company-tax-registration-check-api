import { CacheModule, HttpModule, Module } from '@nestjs/common';
import { CompanyNumberController } from './company-number.controller';
import { CompanyNumberService } from './company-number.service';
import { HttpProvider } from './http.provider';
import { NTSParserService } from './nts-parser.service';

@Module({
  imports: [],
  controllers: [CompanyNumberController],
  providers: [NTSParserService, CompanyNumberService, HttpProvider]
})
export class CompanyNumberModule { }
