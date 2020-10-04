import { Module } from '@nestjs/common';
import { CompanyNumberModule } from './company-number/company-number.module';
@Module({
  imports: [
    CompanyNumberModule
  ],
})
export class AppModule { }
