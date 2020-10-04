import { INestApplication } from "@nestjs/common"
import { Test, TestingModule } from "@nestjs/testing"
import { CompanyStatus } from "../src/company-number/dto/company-status.dto"
import * as supertest from "supertest"
import { CompanyNumberModule } from "../src/company-number/company-number.module"

describe('---- Company Number e2e TEST----', () => {
    let app: INestApplication

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [CompanyNumberModule]
        }).compile()

        app = await moduleFixture.createNestApplication()
        await app.init()
    })

    afterEach(async () => {
        await app.close()
    })

    describe('실패 테스트', () => {
        describe.each([
            ["123451234"],
            ["12345123455"],
            ["123-45-1234"],
        ])(`400`, (input: string) => {
            it(`입력 값이 ${input} 인 경우`, async () => {
                return supertest(app.getHttpServer()).get(`/company-number/${input}`).expect(400)
            })
        })
    })

    describe('성공 테스트', () => {
        it(`미 등록 사업자`, async () => {
            const companyNumber = "123-45-12345"
            return supertest(app.getHttpServer())
                .get(`/company-number/${companyNumber}`)
                .expect(200)
                .expect((res) => {
                    const expected = new CompanyStatus({
                        type: '',
                        status: '',
                        nts_status: false,
                        changed_date: '',
                        closed_date: '',
                    })
                    expect(res.body).toStrictEqual(expect.objectContaining(expected))
                })
        })

        it(`일반 과세자`, async () => {
            const companyNumber = "2148639239" // G 사
            return supertest(app.getHttpServer())
                .get(`/company-number/${companyNumber}`)
                .expect(200)
                .expect((res) => {
                    const expected = new CompanyStatus({
                        "type": "일반",
                        "status": "사업",
                        "nts_status": true,
                        "changed_date": "",
                        "closed_date": "",
                    })
                    expect(res.body).toStrictEqual(expect.objectContaining(expected))
                })
        })
    })
})
