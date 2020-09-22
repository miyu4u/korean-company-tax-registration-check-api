import { HttpService, Inject, Injectable } from '@nestjs/common';
import { checker } from 'src/checker.interface';
import Axios, { AxiosInstance } from 'axios'

@Injectable()
export class CompanyNumberService implements checker {
    constructor(
        @Inject("HTTP") protected readonly http: AxiosInstance
    ) { }

    async check(input: number): Promise<any> {
        const data = `<map id="ATTABZAA001R08"><pubcUserNo/><mobYn>N</mobYn><inqrTrgtClCd>1</inqrTrgtClCd><txprDscmNo>1234512344</txprDscmNo><dongCode>45</dongCode><psbSearch>Y</psbSearch><map id="userReqInfoVO"/></map><nts<nts>nts>59Tlkq16T5UT5vmp6rd1Fmp1qHPy3ObOjYy7GT5xMA48`
        return (await this.http.post("", data)).data
    }
}
