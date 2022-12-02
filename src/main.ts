import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { loggerInstance } from '@plugins';
import { writeFile } from 'fs';
import path from 'path';
import { AppModule } from './app.module';
import { appConfig } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = loggerInstance.getLogger('main');
  const url = `http://127.0.0.1:${appConfig.port}`;
  const config = new DocumentBuilder()
    .setTitle('nest-api')
    .setDescription('Generated with `@nest/swagger`')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'apiKey',
        scheme: 'bearer',
        in: 'header',
        name: 'Authorization',
      },
      'authorization',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  writeFile(path.resolve(__dirname, '../public/openapi.json'), JSON.stringify(document), (error) => {
    if (error) {
      logger.warn(error);
    }
  });
  SwaggerModule.setup('api-docs', app, document);
  await app.listen(appConfig.port);
  logger.info(`Server is running at ${url}`);
  logger.info(`Try ${url}/ping`);
  logger.info(AppModule.jwtToken);
}
bootstrap();
