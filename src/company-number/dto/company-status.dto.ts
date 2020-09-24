import { companyRunInStatus, companyTaxType } from "../company-number.type"
import { NTSQueryResult } from "./nts-query-result.dto"

export class CompanyStatus {
    nts_status: boolean
    status: companyRunInStatus
    type: companyTaxType
    changed_date?: string
    closed_date?: string
    raw: NTSQueryResult
    queriedAt: Date | String
    constructor(part?: Partial<CompanyStatus>) { if (part) Object.assign(this, part) }
}