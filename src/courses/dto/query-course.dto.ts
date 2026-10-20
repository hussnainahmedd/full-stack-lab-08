// courses/dto/query-course.dto.ts - validates the ?search=...&limit=... part
// Query values always arrive as TEXT, so @Type converts them to numbers first.
import { Transform, Type } from 'class-transformer';
import { IsEnum, IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Department } from '../../students/student.entity';

export class QueryCourseDto {
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(Department, { message: 'department must be a valid department name' })
  department?: Department;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'minCredits must be a whole number' })
  @Min(1, { message: 'minCredits must be at least 1' })
  @Max(4, { message: 'minCredits must be at most 4' })
  minCredits?: number;

  @IsOptional()
  @IsIn(['creditHours'], { message: 'sort can only be "creditHours"' })
  sort?: 'creditHours';

  @IsOptional()
  @IsIn(['asc', 'desc'], { message: 'order must be "asc" or "desc"' })
  order?: 'asc' | 'desc';

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'limit must be a whole number' })
  @Min(1, { message: 'limit must be at least 1' })
  @Max(50, { message: 'limit must be at most 50' })
  limit?: number;
}
