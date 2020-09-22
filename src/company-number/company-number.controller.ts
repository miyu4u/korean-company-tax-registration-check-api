import { Controller, Get } from '@nestjs/common';
import { CompanyNumberService } from './company-number.service';

@Controller('company-number')
export class CompanyNumberController {

    constructor(
        protected service:CompanyNumberService
    ){}
    
    @Get()
    async test() {
        return await this.service.check(1)
    }
}
