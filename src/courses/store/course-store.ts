// courses/store/course-store.ts - the storage contract and two implementations
import { readFile, writeFile, mkdir } from 'fs/promises';
import { dirname } from 'path';
import { Course } from '../course.entity';

// A SYMBOL token: unique, so it can never clash with another token
export const COURSE_STORE = Symbol('COURSE_STORE');

export interface CourseStore {
  readAll(): Promise<Course[]>;
  writeAll(courses: Course[]): Promise<void>;
}

// Keeps courses in memory only (data is lost when the server stops)
export class InMemoryCourseStore implements CourseStore {
  private courses: Course[];

  constructor(initial: Course[] = []) {
    this.courses = initial.map((c) => ({ ...c }));
  }

  async readAll(): Promise<Course[]> {
    return this.courses.map((c) => ({ ...c }));
  }

  async writeAll(courses: Course[]): Promise<void> {
    this.courses = courses.map((c) => ({ ...c }));
  }
}

// Keeps courses in data/courses.json (same idea as the student store)
export class JsonFileCourseStore implements CourseStore {
  constructor(private readonly filePath: string) {}

  async readAll(): Promise<Course[]> {
    try {
      return JSON.parse(await readFile(this.filePath, 'utf-8'));
    } catch (error) {
      if (error.code === 'ENOENT') return [];
      throw error;
    }
  }

  async writeAll(courses: Course[]): Promise<void> {
    await mkdir(dirname(this.filePath), { recursive: true });
    await writeFile(this.filePath, JSON.stringify(courses, null, 2));
  }
}
