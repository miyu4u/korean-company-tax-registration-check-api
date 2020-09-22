export class QueryResult {
    registed: boolean
    status: "사업" | "휴업" | "폐업"
    taxType: "일반" | "간이" | "면세"
    closeDate: string
}