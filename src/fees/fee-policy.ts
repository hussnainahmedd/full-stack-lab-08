// fees/fee-policy.ts - the fee rule as a replaceable object, chosen by a token
import { Injectable } from '@nestjs/common';

// An interface describes the shape (interfaces vanish at runtime,
// so they can be used as a TYPE but never as a token)
export interface FeePolicy {
  name: string;
  calculate(creditHours: number, cgpa: number, ratePerCreditHour: number): number;
}

// A SYMBOL token: unique, so it can never clash with another token
export const FEE_POLICY = Symbol('FEE_POLICY');

// A STRING token for the ready-made rate value
export const FEE_RATE = 'FEE_RATE';

// The plain rule: every credit hour costs the full rate
@Injectable()
export class StandardFeePolicy implements FeePolicy {
  readonly name = 'standard';

  calculate(creditHours: number, cgpa: number, ratePerCreditHour: number): number {
    return creditHours * ratePerCreditHour;
  }
}

// The merit rule: good grades earn a discount on the same base price
@Injectable()
export class MeritFeePolicy implements FeePolicy {
  readonly name = 'merit';

  calculate(creditHours: number, cgpa: number, ratePerCreditHour: number): number {
    const discount = cgpa >= 3.5 ? 0.5 : cgpa >= 3.0 ? 0.25 : 0;
    return creditHours * ratePerCreditHour * (1 - discount);
  }
}
