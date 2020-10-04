import 'reflect-metadata'
import { InMemoryStoreService } from './in-memory-store.service'

describe('in memory store', () => {
    let store: InMemoryStoreService
    beforeEach(async () => {
        store = new InMemoryStoreService()
    })

    it(`defined`, async () => {
        expect(store).toBeDefined()
    })

    it(`save`, async () => {
        await store.save("TEST", { type: "일반", queriedAt: new Date() } as any)
        const result = await store.find("TEST")
        expect(result?.type).toBe("일반")
    })


    describe('find', () => {
        it(`값이 없는 경우 undefined 반환`, async () => {
            expect(store.find("1")).resolves.toBeUndefined()
        })
        it(`queryDate가 하루 지난 경우에는 undefined 반환`, async () => {
            const previousDateTime = new Date().getTime() - 60 * 60 * 24 - 1
            await store.save("2", { type: "2", queriedAt: new Date(previousDateTime) } as any)
            expect(store.find("2")).resolves.toBeUndefined()
        })
    })
})