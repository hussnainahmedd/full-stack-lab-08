// courses/course.entity.ts - the shape of a stored course
import { Department } from '../students/student.entity';

export interface Course {
  code: string;
  title: string;
  creditHours: number;
  instructor: string;
  department: Department;
  description?: string;
  tags?: string[];
}
