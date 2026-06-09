import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger documentation
  const config = new DocumentBuilder()
  .setTitle('Twister backend documentation')
  .setDescription('This services provides the necessary endpoints for twister\'s clients')
  .setVersion('1.0')
  .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document)
  app.close();  
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
