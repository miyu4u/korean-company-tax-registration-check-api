import { CacheInterceptor, Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CompanyNumberValidationPipe } from '../pipes/company-number-validation.pipe';
import { CommentGET } from './company-number.comment';
import { CompanyNumberService } from './company-number.service';

@ApiTags("company-number")
@Controller('company-number')
export class CompanyNumberController {

    constructor(
        protected service: CompanyNumberService
    ) { }

    @CommentGET()
    @Get(":num")
    async test(@Param("num", CompanyNumberValidationPipe) num: number) {
        return await this.service.check(num)
    }
}
