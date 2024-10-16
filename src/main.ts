import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 2589;

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Echo Post')
    .setDescription('The Echo Post API description')
    .setVersion('1.0')
    .addTag('echo-post')
    .addBearerAuth()
    .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

  await app.listen(port, () => { console.log(`Server is running on port http://localhost:${port}/api`) });
  
}
bootstrap().catch(err => console.error(`ERRO: ${err}`));
