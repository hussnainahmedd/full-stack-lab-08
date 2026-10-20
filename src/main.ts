// main.ts - the entry point: creates the app and turns validation on globally
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appConfig } from './core/app-config';
import { createValidationPipe } from './common/pipes/app-validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Every @Body(), @Query() and @Param() that uses a DTO class is now
  // transformed and validated automatically.
  app.useGlobalPipes(createValidationPipe());

  await app.listen(appConfig.port);
  console.log(`${appConfig.appName} running at http://localhost:${appConfig.port}`);
}
bootstrap();
