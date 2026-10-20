// fees/fees.service.ts - business logic; receives everything by injection
import { Inject, Injectable } from '@nestjs/common';
import { StudentsService } from '../students/students.service';
import { FEE_POLICY, FEE_RATE, FeePolicy } from './fee-policy';

@Injectable()
export class FeesService {
  constructor(
    // Both fee providers use tokens, so @Inject is required
    @Inject(FEE_POLICY) private readonly policy: FeePolicy,
    @Inject(FEE_RATE) private readonly rate: number,
    // StudentsService is exported by StudentsModule, which FeesModule imports
    private readonly studentsService: StudentsService,
  ) {}

  async feeFor(rollNumber: string, creditHours: number) {
    // findOne throws NotFoundException itself when the student is unknown
    const student = await this.studentsService.findOne(rollNumber);
    return {
      rollNumber: student.rollNumber,
      name: student.name,
      cgpa: student.cgpa,
      creditHours,
      policy: this.policy.name,
      ratePerCreditHour: this.rate,
      total: this.policy.calculate(creditHours, student.cgpa, this.rate),
    };
  }

  info() {
    return { policy: this.policy.name, ratePerCreditHour: this.rate };
  }
}
