// courses/courses.service.ts - business logic; receives everything by injection
import {
  ConflictException, Inject, Injectable, NotFoundException,
} from '@nestjs/common';
import { AppLogger } from '../common/logger/app-logger';
import { Course } from './course.entity';
import { CreditService } from './credit.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { QueryCourseDto } from './dto/query-course.dto';
import { ReplaceCourseDto, UpdateCourseDto } from './dto/update-course.dto';
import { COURSE_STORE, CourseStore } from './store/course-store';

@Injectable()
export class CoursesService {
  constructor(
    // The store has a Symbol token, so @Inject is required
    @Inject(COURSE_STORE) private readonly store: CourseStore,
    // CreditService and AppLogger are classes: Nest finds them by their type
    private readonly credits: CreditService,
    private readonly logger: AppLogger,
  ) {}

  private async locate(code: string) {
    const courses = await this.store.readAll();
    const index = courses.findIndex((c) => c.code === code.toUpperCase());
    if (index === -1) {
      throw new NotFoundException(`Course ${code} not found`);
    }
    return { courses, index };
  }

  async findAll(query: QueryCourseDto): Promise<Course[]> {
    let courses = await this.store.readAll();

    if (query.search) {
      const text = query.search.toLowerCase();
      courses = courses.filter((c) =>
        c.title.toLowerCase().includes(text) ||
        c.code.toLowerCase().includes(text));
    }
    if (query.department) {
      courses = courses.filter((c) => c.department === query.department);
    }
    if (query.minCredits !== undefined) {
      courses = courses.filter((c) => c.creditHours >= query.minCredits);
    }
    if (query.sort === 'creditHours') {
      courses.sort((a, b) =>
        query.order === 'desc'
          ? b.creditHours - a.creditHours
          : a.creditHours - b.creditHours);
    }
    if (query.limit) {
      courses = courses.slice(0, query.limit);
    }
    return courses;
  }

  async stats() {
    const courses = await this.store.readAll();
    const totalCredits = this.credits.totalCredits(courses);
    return {
      totalCourses: courses.length,
      totalCredits,
      overloaded: this.credits.isOverloaded(totalCredits),
    };
  }

  async findOne(code: string): Promise<Course> {
    const { courses, index } = await this.locate(code);
    return courses[index];
  }

  async create(dto: CreateCourseDto): Promise<Course> {
    const courses = await this.store.readAll();
    if (courses.some((c) => c.code === dto.code)) {
      throw new ConflictException(`Course ${dto.code} already exists`);
    }
    const course: Course = { ...dto };
    courses.push(course);
    await this.store.writeAll(courses);
    this.logger.log(`Created course ${course.code}`);
    return course;
  }

  async replace(code: string, dto: ReplaceCourseDto): Promise<Course> {
    const { courses, index } = await this.locate(code);
    courses[index] = { ...dto, code: courses[index].code };
    await this.store.writeAll(courses);
    this.logger.log(`Replaced course ${code}`);
    return courses[index];
  }

  async update(code: string, dto: UpdateCourseDto): Promise<Course> {
    const { courses, index } = await this.locate(code);
    // Ignore keys whose value is undefined so they cannot erase stored data
    const changes = Object.fromEntries(
      Object.entries(dto).filter(([, value]) => value !== undefined));
    courses[index] = { ...courses[index], ...changes };
    await this.store.writeAll(courses);
    this.logger.log(`Updated course ${code}`);
    return courses[index];
  }

  async remove(code: string): Promise<void> {
    const { courses, index } = await this.locate(code);
    courses.splice(index, 1);
    await this.store.writeAll(courses);
    this.logger.log(`Deleted course ${code}`);
  }
}
