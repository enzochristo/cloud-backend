import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = Number(process.env.PORT ?? 3000);
  const host = process.env.HOST ?? '0.0.0.0';

  app.use('/health', (_req: any, res: any) => {
    res.status(200).json({ status: 'ok' });
  });

  const config = new DocumentBuilder()
    .setTitle('Demay Bank API')
    .setDescription('The core financial engine for Demay Bank')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port, host);
}
void bootstrap();
