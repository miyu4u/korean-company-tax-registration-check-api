import { companyRunInStatus, companyTaxType } from "./company-number.type"

export class CompanyStatus {
    nts_status: boolean
    status: companyRunInStatus
    type: companyTaxType
    changed_date?: string
    closed_date?: string
    raw: {
        status: string
        description: string
        message: string
    }
    queriedAt: Date | String
}