import { HttpService, Inject, Injectable } from '@nestjs/common';
import { checker } from 'src/checker.interface';
import Axios, { AxiosInstance } from 'axios'

@Injectable()
export class CompanyNumberService implements checker {
    constructor(
        @Inject("HTTP") protected readonly http: AxiosInstance
    ) { }

    async check(input: number): Promise<any> {
        let payload = ``
        payload += `<map id="ATTABZAA001R08">`
        payload += `<pubcUserNo/>`
        payload += `<mobYn>N</mobYn>`
        payload += `<inqrTrgtClCd>1</inqrTrgtClCd>`
        payload += `<txprDscmNo>${input}</txprDscmNo>`
        payload += `<dongCode>${input.toString().slice(3,4)}</dongCode>`
        payload += `<psbSearch>Y</psbSearch>`
        payload += `<map id="userReqInfoVO"/></map>`
        payload += `<nts<nts>nts>59Tlkq16T5UT5vmp6rd1Fmp1qHPy3ObOjYy7GT5xMA48`
        return (await this.http.post("", payload)).data
    }
}
