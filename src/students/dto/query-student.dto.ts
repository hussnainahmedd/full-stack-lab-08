// students/dto/query-student.dto.ts - validates the ?search=...&limit=... part
// Query values always arrive as TEXT, so @Type converts them to numbers first.
import { Transform, Type } from 'class-transformer';
import {
  IsEnum, IsIn, IsInt, IsNumber, IsOptional, IsString, Max, Min,
} from 'class-validator';
import { Department } from '../student.entity';

export class QueryStudentDto {
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(Department, { message: 'department must be a valid department name' })
  department?: Department;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'minCgpa must be a number' })
  @Min(0)
  @Max(4)
  minCgpa?: number;

  @IsOptional()
  @IsIn(['cgpa'], { message: 'sort can only be "cgpa"' })
  sort?: 'cgpa';

  @IsOptional()
  @IsIn(['asc', 'desc'], { message: 'order must be "asc" or "desc"' })
  order?: 'asc' | 'desc';

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'limit must be a whole number' })
  @Min(1)
  @Max(50)
  limit?: number;
}
