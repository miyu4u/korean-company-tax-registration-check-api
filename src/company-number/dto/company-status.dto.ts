import { ApiProperty } from "@nestjs/swagger"
import { companyRunInStatus, companyTaxType } from "../company-number.type"
import { NTSQueryResult } from "./nts-query-result.dto"

export class CompanyStatus {

    @ApiProperty({
        description: "해당 사업자의 세금 혜택 상태",
        examples: ["일반", "간이", "면세", ""],
        example: "일반",
    })
    type: companyTaxType
    @ApiProperty({
        description: "해당 사업체의 운영 여부",
        example: "사업",
        examples: ["사업", "휴업", "폐업", ""]
    })
    status: companyRunInStatus
    @ApiProperty({
        type: Boolean,
        example: true,
        description: "국세청에 해당 사업체가 등록되어있는지 유무"
    })
    nts_status: boolean
    @ApiProperty({
        example: "2020-01-01",
        description: "면세 사업자에서 과세 사업자로 변경된 경우, 해당 변경 일시"
    })
    changed_date?: string
    @ApiProperty({
        example: "2020-01-01",
        description: "폐업을 한 사업자인 경우, 폐업한 날짜. ! 휴업자는 해당 값이 출력되지 않음."
    })
    closed_date?: string
    @ApiProperty({
        description: "조회 일시",
        example: new Date().toLocaleString()
    })
    queriedAt: Date | string
    @ApiProperty({
        type:NTSQueryResult,
        description:"국세청 질의값 원문"
    })
    raw: NTSQueryResult
    constructor(part?: Partial<CompanyStatus>) { if (part) Object.assign(this, part) }
}