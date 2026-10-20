// core/core.module.ts - providers that the WHOLE application shares
import { Global, Module } from '@nestjs/common';
import { APP_CONFIG, appConfig } from './app-config';
import {
  AppLogger, ConsoleAppLogger, FileAppLogger,
} from '../common/logger/app-logger';

@Global() // exported providers are available everywhere without importing
@Module({
  providers: [
    // useValue: provide a ready-made value
    { provide: APP_CONFIG, useValue: appConfig },

    // useClass: the token is the abstract class, the implementation is chosen here
    {
      provide: AppLogger,
      useClass: process.env.LOG_TO_FILE === 'true' ? FileAppLogger : ConsoleAppLogger,
    },
  ],
  exports: [APP_CONFIG, AppLogger],
})
export class CoreModule {}
