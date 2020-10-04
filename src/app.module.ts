import { Module } from '@nestjs/common';
import { CompanyNumberModule } from './company-number/company-number.module';
import { HealthModule } from './health/health.module';
@Module({
  imports: [
    CompanyNumberModule,
    HealthModule
  ],
})
export class AppModule { }
