// courses/courses.controller.ts - routes only; the work is done by the service
import {
  Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Put, Query,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CodeParamDto } from './dto/code-param.dto';
import { CreateCourseDto } from './dto/create-course.dto';
import { QueryCourseDto } from './dto/query-course.dto';
import { ReplaceCourseDto, UpdateCourseDto } from './dto/update-course.dto';

@Controller('api/courses')
export class CoursesController {
  // Nest sees the parameter type and injects the CoursesService instance
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  findAll(@Query() query: QueryCourseDto) {
    return this.coursesService.findAll(query);
  }

  // Must stay ABOVE ":code", otherwise "stats" is read as a course code
  @Get('stats')
  stats() {
    return this.coursesService.stats();
  }

  @Get(':code')
  findOne(@Param() params: CodeParamDto) {
    return this.coursesService.findOne(params.code);
  }

  @Post() // 201 Created is the default status for POST
  create(@Body() dto: CreateCourseDto) {
    return this.coursesService.create(dto);
  }

  @Put(':code')
  replace(@Param() params: CodeParamDto, @Body() dto: ReplaceCourseDto) {
    return this.coursesService.replace(params.code, dto);
  }

  @Patch(':code')
  update(@Param() params: CodeParamDto, @Body() dto: UpdateCourseDto) {
    return this.coursesService.update(params.code, dto);
  }

  @Delete(':code')
  @HttpCode(204)
  remove(@Param() params: CodeParamDto) {
    return this.coursesService.remove(params.code);
  }
}
