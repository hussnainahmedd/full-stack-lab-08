// students/dto/roll-number-param.dto.ts - validates the :rollNumber in the URL
import { Transform } from 'class-transformer';
import { Matches } from 'class-validator';

export class RollNumberParamDto {
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toUpperCase() : value)
  @Matches(/^BSCS-\d{3}$/, { message: 'rollNumber must look like BSCS-001' })
  rollNumber: string;
}
