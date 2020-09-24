export class NTSQueryResult {
    status: string
    description: string
    message: string
    constructor(part?: Partial<NTSQueryResult>) { if (part) Object.assign(this, part) }
}