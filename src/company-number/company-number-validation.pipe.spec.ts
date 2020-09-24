import { BadRequestException } from '@nestjs/common';
import { CompanyNumberValidationPipe } from './company-number-validation.pipe';

describe('CompanyNumberValidator', () => {
  let pipe: CompanyNumberValidationPipe

  beforeEach(async () => {
    pipe = new CompanyNumberValidationPipe()
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  it(`리턴 값 체크`, async () => expect(pipe.transform(1234512345)).toBe(1234512345))

  describe.each([
    '',
    undefined,
    null,
    NaN
  ])(`value가 없는 경우 400 반환`, (input: any) => {
    it(`입력값이 ${input} 인 경우`, async () => {
      try {
        pipe.transform(input)
        fail("에러 출력 안됨")
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException)
      }
    })
  })

  describe.each([
    '123',
    '123451234',
    '12345123455',
    '12345123A5',
    '123451235 ',
    ' 123451235',
    '\t123451235',
    '1234512345\t',
  ])(`value가 올바르지 않은 형태인 경우 400 반환`, (input: any) => {
    it(`입력 값이 ${input}인 경우`, async () => {
      try {
        pipe.transform(input)
        fail("에러 출력 안됨")
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException)
      }
    })
  })
});
