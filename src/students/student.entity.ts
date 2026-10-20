// students/student.entity.ts - the shape of a stored student
export enum Department {
  CS = 'Computer Science',
  SE = 'Software Engineering',
  DS = 'Data Science',
}

export interface Student {
  name: string;
  rollNumber: string;
  email: string;
  department: Department;
  semester: number;
  cgpa: number;
}

// What the API returns: a student plus the calculated status
export type StudentView = Student & { status: string };
