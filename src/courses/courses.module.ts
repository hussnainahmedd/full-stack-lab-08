// courses/courses.module.ts - wires the providers together
import { Module } from '@nestjs/common';
import { dirname, join } from 'path';
import { AppLogger } from '../common/logger/app-logger';
import { APP_CONFIG, AppConfig } from '../core/app-config';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { SEED_COURSES } from './courses.seed';
import { CreditService } from './credit.service';
import {
  COURSE_STORE, CourseStore, InMemoryCourseStore, JsonFileCourseStore,
} from './store/course-store';

@Module({
  controllers: [CoursesController],
  providers: [
    // Short form: { provide: CoursesService, useClass: CoursesService }
    CoursesService,
    CreditService,

    // useFactory: run a function to decide what to provide.
    // "inject" lists what the function receives, in the same order.
    // Courses live next to the students file: data/courses.json.
    {
      provide: COURSE_STORE,
      useFactory: (config: AppConfig, logger: AppLogger): CourseStore => {
        logger.log(`Using ${config.storage} storage`);
        return config.storage === 'memory'
          ? new InMemoryCourseStore(SEED_COURSES)
          : new JsonFileCourseStore(join(dirname(config.dataFile), 'courses.json'));
      },
      inject: [APP_CONFIG, AppLogger],
    },
  ],
  exports: [CoursesService], // other modules that import this one may use it
})
export class CoursesModule {}
