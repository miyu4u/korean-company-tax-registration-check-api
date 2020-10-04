import { Injectable } from "@nestjs/common";
import { store } from "src/contracts/store.interface";
import { CompanyStatus } from "./dto/company-status.dto";

@Injectable()
export class InMemoryStoreService implements store<CompanyStatus> {

    protected store: { [key: string]: CompanyStatus } = {}

    async save(key: string, data: CompanyStatus): Promise<boolean> {
        this.store[key] = data
        return true
    }

    async find(key: string): Promise<CompanyStatus | undefined> {
        const data = this.store[key]
        if(!data) return undefined
        
        const expired_date = new Date(data.queriedAt).getTime() + 60 * 60 * 24
        const now = new Date().getTime()
        if (expired_date < now) {
            delete this.store[key]
            return undefined
        }

        return data
    }

}