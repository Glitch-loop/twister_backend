import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { EventEmitter2 } from '@nestjs/event-emitter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger documentation
  const config = new DocumentBuilder()
  .setTitle('Twister backend documentation')
  .setDescription('This services provides the necessary endpoints for twister\'s clients')
  .setVersion('1.0')
  .build();

  // const eventEmitter = app.get(EventEmitter2);
  // eventEmitter.onAny((event, value) => {
  //   console.log(`[EVENT_DEBUG] Received event: "${event}"`);
  //   console.log(`[EVENT_DEBUG] Payload:`, value);
  // });

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document)
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
