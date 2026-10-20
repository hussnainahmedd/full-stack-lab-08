// students/students.service.ts - business logic; receives everything by injection
import {
  ConflictException, Inject, Injectable, NotFoundException,
} from '@nestjs/common';
import { AppLogger } from '../common/logger/app-logger';
import { CreateStudentDto } from './dto/create-student.dto';
import { QueryStudentDto } from './dto/query-student.dto';
import { ReplaceStudentDto, UpdateStudentDto } from './dto/update-student.dto';
import { GradeService } from './grade.service';
import { Student, StudentView } from './student.entity';
import { STUDENT_STORE, StudentStore } from './store/student-store';

@Injectable()
export class StudentsService {
  constructor(
    // The store has a Symbol token, so @Inject is required
    @Inject(STUDENT_STORE) private readonly store: StudentStore,
    // GradeService and AppLogger are classes: Nest finds them by their type
    private readonly grades: GradeService,
    private readonly logger: AppLogger,
  ) {}

  private view(student: Student): StudentView {
    return { ...student, status: this.grades.getStatus(student.cgpa) };
  }

  private async locate(rollNumber: string) {
    const students = await this.store.readAll();
    const index = students.findIndex(
      (s) => s.rollNumber === rollNumber.toUpperCase(),
    );
    if (index === -1) {
      throw new NotFoundException(`Student ${rollNumber} not found`);
    }
    return { students, index };
  }

  async findAll(query: QueryStudentDto): Promise<StudentView[]> {
    let students = await this.store.readAll();

    if (query.search) {
      const text = query.search.toLowerCase();
      students = students.filter((s) =>
        s.name.toLowerCase().includes(text) ||
        s.rollNumber.toLowerCase().includes(text));
    }
    if (query.department) {
      students = students.filter((s) => s.department === query.department);
    }
    if (query.minCgpa !== undefined) {
      students = students.filter((s) => s.cgpa >= query.minCgpa);
    }
    if (query.sort === 'cgpa') {
      students.sort((a, b) =>
        query.order === 'asc' ? a.cgpa - b.cgpa : b.cgpa - a.cgpa);
    }
    if (query.limit) {
      students = students.slice(0, query.limit);
    }
    return students.map((s) => this.view(s));
  }

  async stats() {
    const students = await this.store.readAll();
    const total = students.length;
    const sum = students.reduce((result, s) => result + s.cgpa, 0);
    const top = students.reduce<Student | null>(
      (best, s) => (best === null || s.cgpa > best.cgpa ? s : best), null);

    return {
      totalStudents: total,
      averageCgpa: total ? Number((sum / total).toFixed(2)) : 0,
      highest: top ? { name: top.name, cgpa: top.cgpa } : null,
      academicWarnings: students.filter((s) => s.cgpa < 2.0).length,
    };
  }

  async findOne(rollNumber: string): Promise<StudentView> {
    const { students, index } = await this.locate(rollNumber);
    return this.view(students[index]);
  }

  async create(dto: CreateStudentDto): Promise<StudentView> {
    const students = await this.store.readAll();
    if (students.some((s) => s.rollNumber === dto.rollNumber)) {
      throw new ConflictException(`Roll number ${dto.rollNumber} already exists`);
    }
    const student: Student = { ...dto };
    students.push(student);
    await this.store.writeAll(students);
    this.logger.log(`Created student ${student.rollNumber}`);
    return this.view(student);
  }

  async replace(rollNumber: string, dto: ReplaceStudentDto): Promise<StudentView> {
    const { students, index } = await this.locate(rollNumber);
    students[index] = { ...dto, rollNumber: students[index].rollNumber };
    await this.store.writeAll(students);
    this.logger.log(`Replaced student ${rollNumber}`);
    return this.view(students[index]);
  }

  async update(rollNumber: string, dto: UpdateStudentDto): Promise<StudentView> {
    const { students, index } = await this.locate(rollNumber);
    // Ignore keys whose value is undefined so they cannot erase stored data
    const changes = Object.fromEntries(
      Object.entries(dto).filter(([, value]) => value !== undefined));
    students[index] = { ...students[index], ...changes };
    await this.store.writeAll(students);
    this.logger.log(`Updated student ${rollNumber}`);
    return this.view(students[index]);
  }

  async remove(rollNumber: string): Promise<void> {
    const { students, index } = await this.locate(rollNumber);
    students.splice(index, 1);
    await this.store.writeAll(students);
    this.logger.log(`Deleted student ${rollNumber}`);
  }
}
