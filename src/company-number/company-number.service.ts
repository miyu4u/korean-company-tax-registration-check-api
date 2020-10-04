import { Inject, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { AxiosInstance } from 'axios';
import { checker } from 'src/checker.interface';
import { store } from 'src/store.interface';
import { inputPayload } from './company-number.type';
import { CompanyStatus } from './dto/company-status.dto';
import { NTSParserService } from './nts-parser.service';

@Injectable()
export class CompanyNumberService implements checker {
    constructor(
        @Inject("HTTP") protected readonly http: AxiosInstance,
        protected readonly parser: NTSParserService,
        @Inject("STORE") protected readonly store: store<CompanyStatus>
    ) { }

    async check(input: number): Promise<any> {

        const cached = await this.store.find(input.toString())
        if (cached) return cached

        const payload = this.createPayload(this.parseCompanyNumber(input))
        try {
            const result = await this.doCheck(payload)
            this.store.save(input.toString(), result)
            return result
        } catch (error) {
            console.log(error)
            throw new ServiceUnavailableException("현재 국세청과 통신이 불가능합니다.")
        }
    }

    /**
     * 실제 국세청 조회 부분
     *
     * @protected
     * @param {string} payload
     * @return {*}  {Promise<CompanyStatus>}
     * @memberof CompanyNumberService
     */
    protected async doCheck(payload: string): Promise<CompanyStatus> {
        const response = await this.http.post("", payload)
        const raw = response.data
        return this.createNTSQueryResult(raw)
    }

    /**
     * 사업자번호, 동번호 생성
     *
     * @protected
     * @param {number} input
     * @return {*}  {inputPayload}
     * @memberof CompanyNumberService
     */
    protected parseCompanyNumber(input: number): inputPayload {
        return { num: input, dongCode: Number(input.toString().slice(3, 4)) }
    }

    /**
     * 국세청으로 전송할 payload 작성
     * 
     * @param inputPayload 사업자번호, 동번호
     */
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

    /**
     * 사업자 번호 조회 결과에 대한 DTO 생성
     *
     * @param {string} NTSResponseString 국세청 조회 결과 원본 string
     * @memberof CompanyNumberService
     */
    createNTSQueryResult(NTSResponseString: string): CompanyStatus {
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
            raw: {
                description,
                status: NTSParseResult,
                message: NTSResponseString
            },
            queriedAt: new Date().toLocaleString(),
        })
    }
}