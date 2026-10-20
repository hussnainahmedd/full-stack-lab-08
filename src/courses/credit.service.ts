// courses/credit.service.ts - a small provider with no dependencies
import { Injectable } from '@nestjs/common';
import { Course } from './course.entity';

@Injectable()
export class CreditService {
  totalCredits(courses: Course[]): number {
    return courses.reduce((sum, c) => sum + c.creditHours, 0);
  }

  // A semester load above 18 credit hours is overloaded
  isOverloaded(total: number): boolean {
    return total > 18;
  }
}
