import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";


@Injectable()
export class CompanyNumberValidationPipe implements PipeTransform<any, any> {
    transform(value: any) {
        if (!value) throw new BadRequestException("사업자 번호를 파리미터에 입력해주세요")
        if (!String(value).match(/(^\d{10}$)|(^\d{3}-\d{2}-\d{5}$)/)) throw new BadRequestException("사업자 번호 양식이 올바르지 않습니다")
        return Number(String(value).replace(/[^0-9]/g,""))
    }

}