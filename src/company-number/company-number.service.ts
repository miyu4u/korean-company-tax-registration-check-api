import { Inject, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { AxiosInstance } from 'axios';
import { checker } from 'src/checker.interface';
import { inputPayload } from './company-number.type';
import { CompanyStatus } from './dto/company-status.dto';

@Injectable()
export class CompanyNumberService implements checker {
    constructor(
        @Inject("HTTP") protected readonly http: AxiosInstance
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
        return this.responseMessageParser(raw)
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

    responseMessageParser(payload: string) {
        const result = new CompanyStatus()
        const ntsStatus = (payload.match(/<smpcBmanTrtCntn>(.*?)<\/smpcBmanTrtCntn>/)[1] as string).trimEnd()
        result.nts_status = ntsStatus.includes("등록되어 있는") ? true : false
        const description = (payload.match(/<trtCntn>(.*?)<\/trtCntn>/)[1] as string).trimEnd()

        const { status, closed_date, changed_date } = this.getCompanyStatus(description)

        result.status = status
        result.closed_date = closed_date
        result.changed_date = changed_date

        result.type = this.getCompanyType(description)
        result.raw = {
            description,
            status: ntsStatus,
            message: payload
        }
        result.queriedAt = new Date().toLocaleString()
        return result
    }

    protected getCompanyType(description: string): "간이" | "면세" | "일반" {
        if (description.includes("간이")) return "간이"
        if (description.includes("면세")) return "면세"
        if (description.includes("일반과세자")) return "일반"
    }

    protected getCompanyStatus(description: string): { status: "휴업" | "폐업" | "사업" | "", closed_date: string | "", changed_date: string | "" } {
        if (description.includes("휴업자")) {
            return { status: "휴업", closed_date: "", changed_date: "" }
        } else if (description.includes("폐업자")) {
            return { status: "폐업", closed_date: description.match(/폐업일자:(.*?)\)/)[1] ?? "", changed_date: "" }
        } else if (description.includes("과세유형")) {
            const changed_date = `${description.match(/날짜는 (.*)년/)[1]}-${description.match(/년 (.*)월/)[1]}-${description.match(/월 (.*)일/)[1]}`
            return { status: "사업", closed_date: "", changed_date }
        } else if (description.includes("과세자")) {
            return { status: "사업", closed_date: "", changed_date: "" }
        } else {
            return { status: "", closed_date: "", changed_date: "" }
        }
    }
}