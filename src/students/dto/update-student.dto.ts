// students/dto/update-student.dto.ts
// Mapped types build new DTOs from an existing one, keeping all its rules.
import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateStudentDto } from './create-student.dto';

// PUT: every field except rollNumber (the roll number comes from the URL)
export class ReplaceStudentDto
  extends OmitType(CreateStudentDto, ['rollNumber'] as const) {}

// PATCH: the same fields, but all of them optional
export class UpdateStudentDto extends PartialType(ReplaceStudentDto) {}
