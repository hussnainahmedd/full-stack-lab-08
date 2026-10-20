// students/grade.service.ts - a small provider with no dependencies
import { Injectable } from '@nestjs/common';

@Injectable()
export class GradeService {
  getStatus(cgpa: number): string {
    return cgpa >= 3.0 ? 'Excellent'
      : cgpa >= 2.5 ? 'Good'
      : cgpa >= 2.0 ? 'Satisfactory'
      : 'Academic Warning';
  }
}
