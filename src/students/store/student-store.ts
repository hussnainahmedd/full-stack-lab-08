// students/store/student-store.ts - the storage contract and two implementations
import { readFile, writeFile, mkdir } from 'fs/promises';
import { dirname } from 'path';
import { Student } from '../student.entity';

// A SYMBOL token: unique, so it can never clash with another token
export const STUDENT_STORE = Symbol('STUDENT_STORE');

export interface StudentStore {
  readAll(): Promise<Student[]>;
  writeAll(students: Student[]): Promise<void>;
}

// Keeps students in memory only (data is lost when the server stops)
export class InMemoryStudentStore implements StudentStore {
  private students: Student[];

  constructor(initial: Student[] = []) {
    this.students = initial.map((s) => ({ ...s }));
  }

  async readAll(): Promise<Student[]> {
    return this.students.map((s) => ({ ...s }));
  }

  async writeAll(students: Student[]): Promise<void> {
    this.students = students.map((s) => ({ ...s }));
  }
}

// Keeps students in data/students.json (same idea as Lab 07)
export class JsonFileStudentStore implements StudentStore {
  constructor(private readonly filePath: string) {}

  async readAll(): Promise<Student[]> {
    try {
      return JSON.parse(await readFile(this.filePath, 'utf-8'));
    } catch (error) {
      if (error.code === 'ENOENT') return [];
      throw error;
    }
  }

  async writeAll(students: Student[]): Promise<void> {
    await mkdir(dirname(this.filePath), { recursive: true });
    await writeFile(this.filePath, JSON.stringify(students, null, 2));
  }
}
