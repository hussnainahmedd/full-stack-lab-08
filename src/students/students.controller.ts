// students/students.controller.ts - routes only; the work is done by the service
import {
  Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Put, Query,
} from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { QueryStudentDto } from './dto/query-student.dto';
import { RollNumberParamDto } from './dto/roll-number-param.dto';
import { ReplaceStudentDto, UpdateStudentDto } from './dto/update-student.dto';
import { StudentsService } from './students.service';

@Controller('api/students')
export class StudentsController {
  // Nest sees the parameter type and injects the StudentsService instance
  constructor(private readonly studentsService: StudentsService) {}

  @Get()
  findAll(@Query() query: QueryStudentDto) {
    return this.studentsService.findAll(query);
  }

  // Must stay ABOVE ":rollNumber", otherwise "stats" is read as a roll number
  @Get('stats')
  stats() {
    return this.studentsService.stats();
  }

  @Get(':rollNumber')
  findOne(@Param() params: RollNumberParamDto) {
    return this.studentsService.findOne(params.rollNumber);
  }

  @Post() // 201 Created is the default status for POST
  create(@Body() dto: CreateStudentDto) {
    return this.studentsService.create(dto);
  }

  @Put(':rollNumber')
  replace(@Param() params: RollNumberParamDto, @Body() dto: ReplaceStudentDto) {
    return this.studentsService.replace(params.rollNumber, dto);
  }

  @Patch(':rollNumber')
  update(@Param() params: RollNumberParamDto, @Body() dto: UpdateStudentDto) {
    return this.studentsService.update(params.rollNumber, dto);
  }

  @Delete(':rollNumber')
  @HttpCode(204)
  remove(@Param() params: RollNumberParamDto) {
    return this.studentsService.remove(params.rollNumber);
  }
}
