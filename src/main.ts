import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const swaggerOptions = new DocumentBuilder()
    .setTitle("국세청 사업자 휴폐업조회")
    .setDescription("국세청에서 사업자의 휴폐업 상태를 조회합니다")
    .setVersion("0.1")
    .build()

  const document = SwaggerModule.createDocument(app, swaggerOptions)
  SwaggerModule.setup('apis', app, document)

  await app.listen(3000);
}
bootstrap();
