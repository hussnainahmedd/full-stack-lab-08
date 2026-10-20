// courses/dto/update-course.dto.ts
// Mapped types build new DTOs from an existing one, keeping all its rules.
import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateCourseDto } from './create-course.dto';

// PUT: every field except code (the code comes from the URL)
export class ReplaceCourseDto
  extends OmitType(CreateCourseDto, ['code'] as const) {}

// PATCH: the same fields, but all of them optional
export class UpdateCourseDto extends PartialType(ReplaceCourseDto) {}
