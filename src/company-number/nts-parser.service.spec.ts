import { Test } from '@nestjs/testing'
import 'reflect-metadata'
import { NTSParserService } from './nts-parser.service'


describe('---- nts parser ----', () => {
    let service: NTSParserService
    beforeEach(async () => {
        const app = await Test.createTestingModule({
            providers: [
                NTSParserService
            ]
        }).compile()
        service = await app.get(NTSParserService)
    })

    it(`define`, async () => expect(service).toBeDefined())

    describe.each([
        ["부가가치세 일반과세자 입니다.", "일반"],
        ["폐업자 (과세유형: 부가가치세 간이과세자, 폐업일자:2013-12-30) 입니다.", "간이"],
        ["휴업자 (과세유형: 부가가치세 간이과세자) 입니다.", "간이"],
        ["부가가치세 면세사업자 입니다.", "면세"],
        ["부가가치세 일반과세자 입니다.&#xa;* 과세유형 전환된 날짜는 2014년 05월 01일 입니다.", "일반"],
        ["", ""],

    ])(`사업자 세액 타입 검증`, (input: string, expected: string) => {
        it(`입력값이 "${input}" 인 경우 결과값이 "${expected}" 으로 출력되어야함`, () => {
            expect(service.getCompanyType(input)).toBe(expected)
        })
    })

    describe.each([
        ["부가가치세 일반과세자 입니다.", "사업"],
        ["폐업자 (과세유형: 부가가치세 간이과세자, 폐업일자:2013-12-30) 입니다.", "폐업"],
        ["휴업자 (과세유형: 부가가치세 간이과세자) 입니다.", "휴업"],
        ["부가가치세 면세사업자 입니다.", "사업"],
        ["부가가치세 일반과세자 입니다.&#xa;* 과세유형 전환된 날짜는 2014년 05월 01일 입니다.", "사업"],
        ["", ""],
    ])(`사업자 사업 운영 상태 검증`, (input: string, expected: string) => {
        it(`입력값이 "${input}" 인 경우 결과값이 "${expected}" 으로 출력되어야함`, () => {
            expect(service.getCompanyRunInStatus(input)).toBe(expected)
        })
    })

    describe.each([
        ["부가가치세 일반과세자 입니다.", ""],
        ["폐업자 (과세유형: 부가가치세 간이과세자, 폐업일자:2013-12-30) 입니다.", "2013-12-30"],
        ["휴업자 (과세유형: 부가가치세 간이과세자) 입니다.", ""],
        ["부가가치세 면세사업자 입니다.", ""],
        ["부가가치세 일반과세자 입니다.&#xa;* 과세유형 전환된 날짜는 2014년 05월 01일 입니다.", ""],
        ["", ""],
    ])(`폐업일자 획득`, (input: string, expected: string) => {
        it(`입력값이 "${input}" 인 경우 결과값이 "${expected}" 으로 출력되어야함`, () => {
            expect(service.getClosedDate(input)).toBe(expected)
        })
    })

    describe.each([
        ["부가가치세 일반과세자 입니다.&#xa;* 과세유형 전환된 날짜는 2014년 05월 01일 입니다.", "2014-05-01"],
        ["부가가치세 일반과세자 입니다.&#xa;* 과세유형 전환된 날짜는 05월 입니다.", ""],
        ["부가가치세 일반과세자 입니다.&#xa;* 과세유형 전환된 날짜는 05월 01일 입니다.", ""],
        ["부가가치세 일반과세자 입니다.&#xa;* 과세유형 전환된 날짜는 2014년 01일 입니다.", ""],
        ["부가가치세 일반과세자 입니다.&#xa;* 과세유형 전환된 날짜는 01일 입니다.", ""],
        ["", ""],
    ])(`폐업일자 획득`, (input: string, expected: string) => {
        it(`입력값이 "${input}" 인 경우 결과값이 "${expected}" 으로 출력되어야함`, () => {
            expect(service.getChangedDate(input)).toBe(expected)
        })
    })


    describe.each([
        ["<map id='' ><map id='resultMsg' ><detailMsg></detailMsg><msg></msg><code></code><result>S</result></map><trtEndCd>Y</trtEndCd><smpcBmanEnglTrtCntn>The business registration number is registered</smpcBmanEnglTrtCntn><nrgtTxprYn>N</nrgtTxprYn><smpcBmanTrtCntn>등록되어 있는 사업자등록번호 입니다. </smpcBmanTrtCntn><trtCntn>부가가치세 일반과세자 입니다.</trtCntn></map>", "등록되어 있는 사업자등록번호 입니다.", true],
        [`<map id='' ><map id='resultMsg' ><detailMsg></detailMsg><msg></msg><code></code><result>S</result></map><trtEndCd>Y</trtEndCd><smpcBmanEnglTrtCntn>The business registration number is not registered(date of closure: 2013-12-30)</smpcBmanEnglTrtCntn><nrgtTxprYn>N</nrgtTxprYn><smpcBmanTrtCntn>등록되어 있지 않은 사업자등록번호 입니다. (폐업일자: 2013-12-30)</smpcBmanTrtCntn><trtCntn>폐업자 (과세유형: 부가가치세 간이과세자, 폐업일자:2013-12-30) 입니다.</trtCntn></map>`, "등록되어 있지 않은 사업자등록번호 입니다. (폐업일자: 2013-12-30)", false],
        [`<map id='' ><map id='resultMsg' ><detailMsg></detailMsg><msg></msg><code></code><result>S</result></map><trtEndCd>Y</trtEndCd><smpcBmanEnglTrtCntn></smpcBmanEnglTrtCntn><nrgtTxprYn>N</nrgtTxprYn><smpcBmanTrtCntn></smpcBmanTrtCntn><trtCntn>휴업자 (과세유형: 부가가치세 간이과세자) 입니다.</trtCntn></map>`, "", false],
        [`<map id='' ><map id='resultMsg' ><detailMsg></detailMsg><msg></msg><code></code><result>S</result></map><trtEndCd>Y</trtEndCd><smpcBmanEnglTrtCntn>The business registration number is registered</smpcBmanEnglTrtCntn><nrgtTxprYn>N</nrgtTxprYn><smpcBmanTrtCntn>등록되어 있는 사업자등록번호 입니다. </smpcBmanTrtCntn><trtCntn>부가가치세 간이과세자 입니다.</trtCntn></map>`, "등록되어 있는 사업자등록번호 입니다.", true],
        [`<map id='' ><map id='resultMsg' ><detailMsg></detailMsg><msg></msg><code></code><result>S</result></map><trtEndCd>Y</trtEndCd><smpcBmanEnglTrtCntn>The business registration number is registered(Tax-free person number)</smpcBmanEnglTrtCntn><nrgtTxprYn>N</nrgtTxprYn><smpcBmanTrtCntn>등록되어 있는 사업자등록번호 입니다. (면세사업자)</smpcBmanTrtCntn><trtCntn>부가가치세 면세사업자 입니다.</trtCntn></map>`, "등록되어 있는 사업자등록번호 입니다. (면세사업자)", true],
        [`<map id='' ><map id='resultMsg' ><detailMsg></detailMsg><msg></msg><code></code><result>S</result></map><trtEndCd>Y</trtEndCd><smpcBmanEnglTrtCntn>The business registration number is registered</smpcBmanEnglTrtCntn><nrgtTxprYn>N</nrgtTxprYn><smpcBmanTrtCntn>등록되어 있는 사업자등록번호 입니다. </smpcBmanTrtCntn><trtCntn>부가가치세 일반과세자 입니다.&#xa;* 과세유형 전환된 날짜는 2014년 05월 01일 입니다.</trtCntn></map>`, "등록되어 있는 사업자등록번호 입니다.", true],
        ["", "", false]
    ]
    )(`국세청 등록 상태 체크`, (input: string, expected: string, flag: boolean) => {
        let result: any
        beforeEach(async () => {
            result = service.getNTSStatus(input)
        })
        it(`입력값이 "${input}" 인 경우 결과값이 "${expected}" 으로 출력되어야함`, () => {
            expect(result.NTSParseResult).toBe(expected)
        })

        it(`입력값이 "${input}" 인 경우 flag 값은 "${flag}" 으로 출력되어야함`, async () => {
            expect(result.flag).toBe(flag)
        })
    })

    describe.each([
        ["<map id='' ><map id='resultMsg' ><detailMsg></detailMsg><msg></msg><code></code><result>S</result></map><trtEndCd>Y</trtEndCd><smpcBmanEnglTrtCntn>The business registration number is registered</smpcBmanEnglTrtCntn><nrgtTxprYn>N</nrgtTxprYn><smpcBmanTrtCntn>등록되어 있는 사업자등록번호 입니다. </smpcBmanTrtCntn><trtCntn>부가가치세 일반과세자 입니다.</trtCntn></map>", "부가가치세 일반과세자 입니다."],
        [`<map id='' ><map id='resultMsg' ><detailMsg></detailMsg><msg></msg><code></code><result>S</result></map><trtEndCd>Y</trtEndCd><smpcBmanEnglTrtCntn>The business registration number is not registered(date of closure: 2013-12-30)</smpcBmanEnglTrtCntn><nrgtTxprYn>N</nrgtTxprYn><smpcBmanTrtCntn>등록되어 있지 않은 사업자등록번호 입니다. (폐업일자: 2013-12-30)</smpcBmanTrtCntn><trtCntn>폐업자 (과세유형: 부가가치세 간이과세자, 폐업일자:2013-12-30) 입니다.</trtCntn></map>`, "폐업자 (과세유형: 부가가치세 간이과세자, 폐업일자:2013-12-30) 입니다."],
        [`<map id='' ><map id='resultMsg' ><detailMsg></detailMsg><msg></msg><code></code><result>S</result></map><trtEndCd>Y</trtEndCd><smpcBmanEnglTrtCntn></smpcBmanEnglTrtCntn><nrgtTxprYn>N</nrgtTxprYn><smpcBmanTrtCntn></smpcBmanTrtCntn><trtCntn>휴업자 (과세유형: 부가가치세 간이과세자) 입니다.</trtCntn></map>`, "휴업자 (과세유형: 부가가치세 간이과세자) 입니다."],
        [`<map id='' ><map id='resultMsg' ><detailMsg></detailMsg><msg></msg><code></code><result>S</result></map><trtEndCd>Y</trtEndCd><smpcBmanEnglTrtCntn>The business registration number is registered</smpcBmanEnglTrtCntn><nrgtTxprYn>N</nrgtTxprYn><smpcBmanTrtCntn>등록되어 있는 사업자등록번호 입니다. </smpcBmanTrtCntn><trtCntn>부가가치세 간이과세자 입니다.</trtCntn></map>`, "부가가치세 간이과세자 입니다."],
        [`<map id='' ><map id='resultMsg' ><detailMsg></detailMsg><msg></msg><code></code><result>S</result></map><trtEndCd>Y</trtEndCd><smpcBmanEnglTrtCntn>The business registration number is registered(Tax-free person number)</smpcBmanEnglTrtCntn><nrgtTxprYn>N</nrgtTxprYn><smpcBmanTrtCntn>등록되어 있는 사업자등록번호 입니다. (면세사업자)</smpcBmanTrtCntn><trtCntn>부가가치세 면세사업자 입니다.</trtCntn></map>`, "부가가치세 면세사업자 입니다."],
        [`<map id='' ><map id='resultMsg' ><detailMsg></detailMsg><msg></msg><code></code><result>S</result></map><trtEndCd>Y</trtEndCd><smpcBmanEnglTrtCntn>The business registration number is registered</smpcBmanEnglTrtCntn><nrgtTxprYn>N</nrgtTxprYn><smpcBmanTrtCntn>등록되어 있는 사업자등록번호 입니다. </smpcBmanTrtCntn><trtCntn>부가가치세 일반과세자 입니다.&#xa;* 과세유형 전환된 날짜는 2014년 05월 01일 입니다.</trtCntn></map>`, "부가가치세 일반과세자 입니다.&#xa;* 과세유형 전환된 날짜는 2014년 05월 01일 입니다."],
        ["", ""]
    ]
    )(`국세청 등록 상태에 따른 세부 설명`, (input: string, expected: string) => {
        it(`입력값이 "${input}" 인 경우 결과값이 "${expected}" 으로 출력되어야함`, () => {
            expect(service.getDescription(input)).toBe(expected)
        })
    })
})