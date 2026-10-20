// courses/courses.seed.ts - starting data for the in-memory store
import { Department } from '../students/student.entity';
import { Course } from './course.entity';

// 6 courses, 3+3+3+3+3+2 = 17 credit hours in total
export const SEED_COURSES: Course[] = [
  {
    code: 'CS-201', title: 'Data Structures', creditHours: 3,
    instructor: 'Dr. Ayesha Khan', department: Department.CS,
    description: 'Lists, stacks, queues, trees and graphs.',
    tags: ['core', 'theory'],
  },
  {
    code: 'CS-301L', title: 'Full Stack Web Development Lab', creditHours: 3,
    instructor: 'Dr. Hamza Rauf', department: Department.CS,
    description: 'Hands-on lab for the Full Stack Web Development course.',
    tags: ['lab', 'web'],
  },
  {
    code: 'CS-311', title: 'Computer Networks', creditHours: 3,
    instructor: 'Dr. Bilal Ahmed', department: Department.CS,
    description: 'Protocols, routing and the TCP/IP stack.',
    tags: ['networks'],
  },
  {
    code: 'CS-331', title: 'Software Design Patterns', creditHours: 3,
    instructor: 'Dr. Maria Aslam', department: Department.SE,
    description: 'Creational, structural and behavioural patterns.',
    tags: ['design'],
  },
  {
    code: 'CS-341', title: 'Machine Learning', creditHours: 3,
    instructor: 'Dr. Omar Farooq', department: Department.DS,
    description: 'Regression, classification and clustering.',
    tags: ['ai', 'data'],
  },
  {
    code: 'CS-321', title: 'Compiler Construction', creditHours: 2,
    instructor: 'Dr. Hamza Rauf', department: Department.CS,
    description: 'Lexing, parsing and code generation.',
    tags: ['theory'],
  },
];
