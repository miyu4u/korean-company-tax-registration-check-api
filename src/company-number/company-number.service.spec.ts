import { ServiceUnavailableException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AxiosInstance } from 'axios';
import { CompanyNumberService } from './company-number.service';
import { CompanyStatus } from './dto/company-status.dto';
import { InMemoryStoreService } from './in-memory-store.service';
import { NTSParserService } from './nts-parser.service';

describe('CompanyNumberService', () => {
    let service: CompanyNumberService;
    let store: InMemoryStoreService
    let http: AxiosInstance

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [],
            providers: [
                CompanyNumberService,
                NTSParserService,
                { provide: 'HTTP', useValue: { post: jest.fn() } },
                { provide: 'STORE', useClass: InMemoryStoreService }
            ],
        }).compile();

        service = module.get<CompanyNumberService>(CompanyNumberService);
        store = module.get('STORE')
        http = module.get('HTTP')
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it(`캐시된 데이터가 이미 있는 경우 해당 값을 반환합니다`, async () => {
        const mock = new CompanyStatus({ type: "" })
        await store.save("1234512345", mock)
        expect(service.check(1234512345)).resolves.toBe(mock)
    })

    it(`조회 후 결과 값을 캐시에 저장합니다`, async () => {
        jest.spyOn(http, "post").mockResolvedValue({ status: 200, data: `<map id='' ><map id='resultMsg' ><detailMsg></ddetailMsg><msg></msg><code></code><result>S</result></map><trtEndCd>Y</trtEndCd><smpcBmanEnglTrtCntn>The business registration number is registered</smpcBmanEnglTrtCntn><nrgtTxprYn>N</nrgtTxprYn><smpcBmanTrtCntn>등록되어 있는 사업자등록번호 입니다. </smpcBmanTrtCntn><trtCntn>부가가치세 일반과세자 입니다.</trtCntn></map>` })
        await service.check(1234512345)
        const result = await store.find("1234512345")
        expect(result).toBeDefined()
    })

    describe.each([
        [1234512345, "<map id=\"ATTABZAA001R08\"><pubcUserNo/><mobYn>N</mobYn><inqrTrgtClCd>1</inqrTrgtClCd><txprDscmNo>1234512345</txprDscmNo><dongCode>4</dongCode><psbSearch>Y</psbSearch><map id=\"userReqInfoVO\"/></map><nts<nts>nts>59Tlkq16T5UT5vmp6rd1Fmp1qHPy3ObOjYy7GT5xMA48"],
    ])(`payload 체크`, (num: number, ex: string) => {
        it(`입력된 사업자 번호 값이 ${num} 인 경우`, async () => {
            jest.spyOn(http, "post").mockImplementation((uri: string, data?: any) => {
                expect(data).toBe(ex)
                return { data: "" } as any
            })
            service.check(num)
        })
    })

    describe.each([
        [400],
        [408],
        [500],
        [503],
    ])(`국세청 통신 결과가 200 OK가 아닌 경우 ServiceUnavailableException을 반환합니다`, (status: number) => {
        it(`상태 값이 ${status} 인 경우`, async () => {
            const input = 1234512345
            jest.spyOn(http, "post").mockRejectedValue({ status, data: "" })
            try {
                await service.check(input)
                fail("에러가 발생하지 않았음")
            } catch (error) {
                expect(error).toBeInstanceOf(ServiceUnavailableException)
                expect(error.message).toBe("현재 국세청과 통신이 불가능합니다.")
            }
        })
    })

    describe.each([
        [
            "일반과세자",
            `<map id='' ><map id='resultMsg' ><detailMsg></ddetailMsg><msg></msg><code></code><result>S</result></map><trtEndCd>Y</trtEndCd><smpcBmanEnglTrtCntn>The business registration number is registered</smpcBmanEnglTrtCntn><nrgtTxprYn>N</nrgtTxprYn><smpcBmanTrtCntn>등록되어 있는 사업자등록번호 입니다. </smpcBmanTrtCntn><trtCntn>부가가치세 일반과세자 입니다.</trtCntn></map>`,
            new CompanyStatus({ type: "일반", status: "사업", nts_status: true, changed_date: "", closed_date: "" })
        ],
        [
            "간이과세자 폐업",
            `<map id='' ><map id='resultMsg' ><detailMsg></detailMsg><msg></msg><code></code><result>S</result></map><trtEndCd>Y</trtEndCd><smpcBmanEnglTrtCntn>The business registration number is not registered(date of closure: 2013-12-30)</smpcBmanEnglTrtCntn><nrgtTxprYn>N</nrgtTxprYn><smpcBmanTrtCntn>등록되어 있지 않은 사업자등록번호 입니다. (폐업일자: 2013-12-30)</smpcBmanTrtCntn><trtCntn>폐업자 (과세유형: 부가가치세 간이과세자, 폐업일자:2013-12-30) 입니다.</trtCntn></map>`,
            new CompanyStatus({ type: "간이", status: "폐업", nts_status: false, changed_date: "", closed_date: "2013-12-30" })
        ],
        [
            "간이과세자 휴업",
            `<map id='' ><map id='resultMsg' ><detailMsg></detailMsg><msg></msg><code></code><result>S</result></map><trtEndCd>Y</trtEndCd><smpcBmanEnglTrtCntn></smpcBmanEnglTrtCntn><nrgtTxprYn>N</nrgtTxprYn><smpcBmanTrtCntn></smpcBmanTrtCntn><trtCntn>휴업자 (과세유형: 부가가치세 간이과세자) 입니다.</trtCntn></map>`,
            new CompanyStatus({ type: "간이", status: "휴업", nts_status: false, changed_date: "", closed_date: "" })
        ],
        [
            "간이과세자",
            `<map id='' ><map id='resultMsg' ><detailMsg></detailMsg><msg></msg><code></code><result>S</result></map><trtEndCd>Y</trtEndCd><smpcBmanEnglTrtCntn>The business registration number is registered</smpcBmanEnglTrtCntn><nrgtTxprYn>N</nrgtTxprYn><smpcBmanTrtCntn>등록되어 있는 사업자등록번호 입니다. </smpcBmanTrtCntn><trtCntn>부가가치세 간이과세자 입니다.</trtCntn></map>`,
            new CompanyStatus({ type: "간이", status: "사업", nts_status: true, changed_date: "", closed_date: "" })
        ],
        [
            "면세사업자",
            `<map id='' ><map id='resultMsg' ><detailMsg></detailMsg><msg></msg><code></code><result>S</result></map><trtEndCd>Y</trtEndCd><smpcBmanEnglTrtCntn>The business registration number is registered(Tax-free person number)</smpcBmanEnglTrtCntn><nrgtTxprYn>N</nrgtTxprYn><smpcBmanTrtCntn>등록되어 있는 사업자등록번호 입니다. (면세사업자)</smpcBmanTrtCntn><trtCntn>부가가치세 면세사업자 입니다.</trtCntn></map>`,
            new CompanyStatus({ type: "면세", status: "사업", nts_status: true, changed_date: "", closed_date: "" })
        ],
        [
            "간이->일반 과세 전환자",
            `<map id='' ><map id='resultMsg' ><detailMsg></detailMsg><msg></msg><code></code><result>S</result></map><trtEndCd>Y</trtEndCd><smpcBmanEnglTrtCntn>The business registration number is registered</smpcBmanEnglTrtCntn><nrgtTxprYn>N</nrgtTxprYn><smpcBmanTrtCntn>등록되어 있는 사업자등록번호 입니다. </smpcBmanTrtCntn><trtCntn>부가가치세 일반과세자 입니다.&#xa;* 과세유형 전환된 날짜는 2014년 05월 01일 입니다.</trtCntn></map>`,
            new CompanyStatus({ type: "일반", status: "사업", nts_status: true, changed_date: "2014-05-01", closed_date: "" })
        ]
    ])(`조회 결과를 분석하는 경우`, (category: string, payload: string, expected: Partial<CompanyStatus>) => {
        it(`${category}`, async () => {
            const result = service.createNTSQueryResult(payload)
            expect(result).toStrictEqual(expect.objectContaining(expected))
        })
    })
});
