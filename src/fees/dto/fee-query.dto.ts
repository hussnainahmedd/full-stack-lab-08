// fees/dto/fee-query.dto.ts - validates the ?creditHours=... part of the fee URL
// Query values always arrive as TEXT, so @Type converts them to numbers first.
import { Type } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';

export class FeeQueryDto {
  // Required: no @IsOptional, so a missing creditHours fails validation
  @Type(() => Number)
  @IsInt({ message: 'creditHours must be a whole number' })
  @Min(1, { message: 'creditHours must be at least 1' })
  @Max(24, { message: 'creditHours must be at most 24' })
  creditHours: number;
}
