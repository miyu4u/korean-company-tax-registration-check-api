import { Inject, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { AxiosInstance } from 'axios';
import { checker } from 'src/checker.interface';
import { inputPayload } from './company-number.type';
import { CompanyStatus } from './dto/company-status.dto';
import { NTSParserService } from './nts-parser.service';

@Injectable()
export class CompanyNumberService implements checker {
    constructor(
        @Inject("HTTP") protected readonly http: AxiosInstance,
        protected readonly parser: NTSParserService
    ) { }

    async check(input: number): Promise<any> {
        const payload = this.createPayload(this.parseCompanyNumber(input))
        try {
            return await this.doCheck(payload)
        } catch (error) {
            console.log(error)
            throw new ServiceUnavailableException("현재 국세청과 통신이 불가능합니다.")
        }
    }

    async doCheck(payload: string) {
        const response = await this.http.post("", payload)
        const raw = response.data
        return this.createNTSQueryResult(raw)
    }

    protected parseCompanyNumber(input: number): inputPayload {
        return { num: input, dongCode: Number(input.toString().slice(3, 4)) }
    }

    protected createPayload({ num, dongCode }: inputPayload): string {
        let payload = ``
        payload += `<map id="ATTABZAA001R08">`
        payload += `<pubcUserNo/>`
        payload += `<mobYn>N</mobYn>`
        payload += `<inqrTrgtClCd>1</inqrTrgtClCd>`
        payload += `<txprDscmNo>${num}</txprDscmNo>`
        payload += `<dongCode>${dongCode}</dongCode>`
        payload += `<psbSearch>Y</psbSearch>`
        payload += `<map id="userReqInfoVO"/></map>`
        payload += `<nts<nts>nts>59Tlkq16T5UT5vmp6rd1Fmp1qHPy3ObOjYy7GT5xMA48`
        return payload
    }

    createNTSQueryResult(NTSResponseString: string) {
        const { NTSParseResult, flag } = this.parser.getNTSStatus(NTSResponseString)
        const description = this.parser.getDescription(NTSResponseString)
        const type = this.parser.getCompanyType(description)
        const status = this.parser.getCompanyRunInStatus(description)
        const closed_date = this.parser.getClosedDate(description)
        const changed_date = this.parser.getChangedDate(description)
        return new CompanyStatus({
            type, status,
            nts_status: flag,
            changed_date,
            closed_date,
            raw:{
                description,
                status:NTSParseResult,
                message:NTSResponseString
            },
            queriedAt: new Date().toLocaleString(),
        })
    }
}