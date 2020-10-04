import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as helmet from 'helmet'
import * as rateLimit from 'express-rate-limit'


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const swaggerOptions = new DocumentBuilder()
    .setTitle("국세청 사업자 휴폐업조회")
    .setDescription("국세청에서 사업자의 휴폐업 상태를 조회합니다")
    .setVersion("0.1")
    .build()

  const document = SwaggerModule.createDocument(app, swaggerOptions)
  SwaggerModule.setup('apis', app, document)

  app.use(helmet())
  app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  }))
  app.enableCors()
  await app.listen(3000);
}
bootstrap();
