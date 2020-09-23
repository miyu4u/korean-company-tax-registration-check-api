export class CompanyStatus {
    nts_status: boolean
    status: "사업" | "휴업" | "폐업" | ""
    type: "일반" | "간이" | "면세"
    changed_date?: string
    closed_date?: string
    raw: {
        status: string
        description: string
        message: string
    }
    queriedAt: Date | String
}