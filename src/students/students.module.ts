// students/students.module.ts - wires the providers together
import { Module } from '@nestjs/common';
import { AppLogger } from '../common/logger/app-logger';
import { APP_CONFIG, AppConfig } from '../core/app-config';
import { GradeService } from './grade.service';
import { SEED_STUDENTS } from './students.seed';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';
import {
  InMemoryStudentStore, JsonFileStudentStore, STUDENT_STORE, StudentStore,
} from './store/student-store';

@Module({
  controllers: [StudentsController],
  providers: [
    // Short form: { provide: StudentsService, useClass: StudentsService }
    StudentsService,
    GradeService,

    // useFactory: run a function to decide what to provide.
    // "inject" lists what the function receives, in the same order.
    {
      provide: STUDENT_STORE,
      useFactory: (config: AppConfig, logger: AppLogger): StudentStore => {
        logger.log(`Using ${config.storage} storage`);
        return config.storage === 'memory'
          ? new InMemoryStudentStore(SEED_STUDENTS)
          : new JsonFileStudentStore(config.dataFile);
      },
      inject: [APP_CONFIG, AppLogger],
    },
  ],
  exports: [StudentsService], // other modules that import this one may use it
})
export class StudentsModule {}
