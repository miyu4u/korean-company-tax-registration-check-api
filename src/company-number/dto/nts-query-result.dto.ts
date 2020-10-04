import { ApiProperty } from "@nestjs/swagger"

export class NTSQueryResult {
    @ApiProperty({
        example: "등록되어 있지 않은 사업자등록번호 입니다.",
        description: "국세청에 해당 사업자 등록 상태"
    })
    status: string
    @ApiProperty({
        description: "등록 상태에 대한 세부 정보",
        example: "사업을 하지 않고 있습니다.",
    })
    description: string
    @ApiProperty({
        description: "국세청 수신 본문",
    })
    message: string
    constructor(part?: Partial<NTSQueryResult>) { if (part) Object.assign(this, part) }
}