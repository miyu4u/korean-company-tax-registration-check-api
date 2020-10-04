import { applyDecorators, BadRequestException } from "@nestjs/common";
import { ApiBadRequestResponse, ApiExtraModels, ApiOkResponse, ApiOperation, ApiParam, ApiServiceUnavailableResponse } from "@nestjs/swagger";
import { CompanyStatus } from "./dto/company-status.dto";



export function CommentGET() {
    return applyDecorators(
        ApiExtraModels(CompanyStatus),
        ApiOperation({
            description: "사업자 휴폐업 조회에 대한 endpoint. param 에 대한 형식은 OOO-OO-OOOOO 또는 OOOOOOOOOO 입니다. 그 이외의 모든 값은 전부 400 에러가 발생합니다."
        }),
        ApiParam({
            name: "num",
            description: "국세청에 질의할 사업자 번호",
            example: "123-45-12345",
            type: String
        }),
        ApiBadRequestResponse({
            description: "사업자 번호가 올바르지 않는 경우 반환됩니다. Param에 입력되는 사업자 번호 구성은 OOO-OO-OOOOO 또는 OOOOOOOOO 구성이어야 합니다",
        }),
        ApiServiceUnavailableResponse({
            description: "국세청과 통신이 불가능한 경우 반환됩니다."
        }),
        ApiOkResponse({
            description:"국세청과 통신에 성공하는 경우",
            type:CompanyStatus
        })
    )
}