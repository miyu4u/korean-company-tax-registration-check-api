import { Injectable } from "@nestjs/common";
import { companyRunInStatus, companyTaxType } from "./company-number.type";

@Injectable()
export class NTSParserService {
    /**
     * 사업자 세금 납부 타입 확인
     * 
     * @param description trtCntn 값
     */
    getCompanyType(description: string): companyTaxType {
        if (description.includes("간이")) return "간이"
        if (description.includes("면세")) return "면세"
        if (description.includes("일반과세자")) return "일반"
        return ""
    }

    /**
     * 사업자 사업 운영 상태 확인
     * 
     * @param description trtCntn 값
     */
    getCompanyRunInStatus(description: string): companyRunInStatus {
        if (description.includes("휴업자")) return "휴업"
        if (description.includes("폐업자")) return "폐업"
        if (description.includes("과세유형") || description.includes("과세자") || description.includes("사업자")) return "사업"
        return ""
    }

    /**
     * 폐업자 폐업일자
     * 
     * @param description trtCntn
     * @example "2020-01-01"
     * @example ""
     */
    getClosedDate(description: string): string {
        return description.match(/폐업일자:(.*?)\)/)?.[1] ?? ""
    }

    /**
     * 과세유형 변경일자
     * 
     * @param description trtCntn
     * @example "2020-01-01"
     * @example ""
     */
    getChangedDate(description: string): string | "" {
        const year = description.match(/날짜는 (.*)년/)?.[1] ?? ""
        const month = description.match(/년 (.*)월/)?.[1] ?? ""
        const day = description.match(/월 (.*)일/)?.[1] ?? ""
        if (!year || !month || !day) return ""
        return `${year}-${month}-${day}`
    }

    /**
     * 사업자 국세청 등록 상태 파싱
     * 
     * @param NTSRawResult 국세청 리턴 결과값 원본
     */
    getNTSStatus(NTSRawResult: string): { NTSParseResult: string, flag: boolean } {
        const statusRegex = /<smpcBmanTrtCntn>(.*?)<\/smpcBmanTrtCntn>/

        const NTSParseResult = (NTSRawResult.match(statusRegex)?.[1] ?? "").trimEnd()
        const flag = NTSParseResult.includes("등록되어 있는") ? true : false
        return { NTSParseResult, flag }
    }

    /**
     * 국세청 등록 상태에 대한 세부 설명 파싱
     * @param NTSRawResult 
     */
    getDescription(NTSRawResult:string):string {
        const descriptionRegex = /<trtCntn>(.*?)<\/trtCntn>/
        const NTSparseResult = (NTSRawResult.match(descriptionRegex)?.[1] ?? "").trimEnd()
        return NTSparseResult
    }
}