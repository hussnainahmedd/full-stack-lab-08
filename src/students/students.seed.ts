// students/students.seed.ts - starting data for the in-memory store
import { Department, Student } from './student.entity';

export const SEED_STUDENTS: Student[] = [
  {
    name: 'Ali Khan', rollNumber: 'BSCS-001', email: 'ali@example.com',
    department: Department.CS, semester: 6, cgpa: 3.45,
  },
  {
    name: 'Sara Ahmed', rollNumber: 'BSCS-023', email: 'sara@example.com',
    department: Department.SE, semester: 5, cgpa: 3.8,
  },
  {
    name: 'Ayesha Noor', rollNumber: 'BSCS-014', email: 'ayesha@example.com',
    department: Department.DS, semester: 4, cgpa: 1.9,
  },
  {
    name: 'Usman Tariq', rollNumber: 'BSCS-031', email: 'usman@example.com',
    department: Department.CS, semester: 3, cgpa: 2.75,
  },
  {
    name: 'Hina Malik', rollNumber: 'BSCS-042', email: 'hina@example.com',
    department: Department.SE, semester: 7, cgpa: 3.1,
  },
  {
    name: 'Bilal Hussain', rollNumber: 'BSCS-050', email: 'bilal@example.com',
    department: Department.DS, semester: 2, cgpa: 3.12,
  },
];
