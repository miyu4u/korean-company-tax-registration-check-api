import { Test, TestingModule } from '@nestjs/testing';
import { CompanyNumberService } from './company-number.service';
import { CompanyStatus } from './dto/company-status.dto';
import { NTSParserService } from './nts-parser.service';

describe('CompanyNumberService', () => {
  let service: CompanyNumberService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        CompanyNumberService,
        { provide: 'HTTP', useValue: {} },
        NTSParserService
      ],
    }).compile();

    service = module.get<CompanyNumberService>(CompanyNumberService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

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
