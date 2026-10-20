// app.module.ts - the root module: it only imports the feature modules
import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { CoursesModule } from './courses/courses.module';
import { FeesModule } from './fees/fees.module';
import { StudentsModule } from './students/students.module';

@Module({
  imports: [CoreModule, StudentsModule, CoursesModule, FeesModule],
})
export class AppModule {}
