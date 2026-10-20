// courses/dto/code-param.dto.ts - validates the :code in the URL
import { Transform } from 'class-transformer';
import { Matches } from 'class-validator';

export class CodeParamDto {
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toUpperCase() : value)
  @Matches(/^CS-\d{3}L?$/, { message: 'code must look like CS-301 or CS-301L' })
  code: string;
}
