import { Module } from '@nestjs/common';
import { CompanyNumberController } from './company-number.controller';
import { CompanyNumberService } from './company-number.service';
import { HttpProvider } from './http.provider';
import { InMemoryStoreService } from './in-memory-store.service';
import { NTSParserService } from './nts-parser.service';

@Module({
  imports: [],
  controllers: [CompanyNumberController],
  providers: [
    NTSParserService,
    CompanyNumberService,
    HttpProvider,
    { provide: "STORE", useClass: InMemoryStoreService }
  ]
})
export class CompanyNumberModule { }
