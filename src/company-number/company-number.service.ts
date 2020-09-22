import { HttpService, Inject, Injectable } from '@nestjs/common';
import { checker } from 'src/checker.interface';
import Axios, { AxiosInstance } from 'axios'
@Injectable()
export class CompanyNumberService implements checker {
    constructor(
        @Inject("HTTP") protected readonly http: AxiosInstance
    ) { }

    async check(input: number): Promise<any> {
        const payload = this.createPayload(input)
        const response = await this.http.post("", payload)
        const body = response.data
        const status = (body.match(/<smpcBmanTrtCntn>(.*?)<\/smpcBmanTrtCntn>/)[1] as string).trimEnd()
        const description = body.match(/<trtCntn>(.*?)<\/trtCntn>/)[1]
        return { status, description }
    }

    protected createPayload(input: number): string {
        let payload = ``
        payload += `<map id="ATTABZAA001R08">`
        payload += `<pubcUserNo/>`
        payload += `<mobYn>N</mobYn>`
        payload += `<inqrTrgtClCd>1</inqrTrgtClCd>`
        payload += `<txprDscmNo>${input}</txprDscmNo>`
        payload += `<dongCode>${input.toString().slice(3, 4)}</dongCode>`
        payload += `<psbSearch>Y</psbSearch>`
        payload += `<map id="userReqInfoVO"/></map>`
        payload += `<nts<nts>nts>59Tlkq16T5UT5vmp6rd1Fmp1qHPy3ObOjYy7GT5xMA48`
        return payload
    }
}
