// Unit test: DI lets us hand the service a FAKE store and a FAKE logger.
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppLogger } from '../common/logger/app-logger';
import { Department } from '../students/student.entity';
import { SEED_COURSES } from './courses.seed';
import { CoursesService } from './courses.service';
import { CreditService } from './credit.service';
import { COURSE_STORE, InMemoryCourseStore } from './store/course-store';

describe('CoursesService', () => {
  let service: CoursesService;
  const logger = { log: jest.fn() };

  beforeEach(async () => {
    logger.log.mockClear();
    const moduleRef = await Test.createTestingModule({
      providers: [
        CoursesService,
        CreditService,
        { provide: COURSE_STORE, useValue: new InMemoryCourseStore(SEED_COURSES) },
        { provide: AppLogger, useValue: logger },
      ],
    }).compile();

    service = moduleRef.get(CoursesService);
  });

  it('lists all 6 courses', async () => {
    const courses = await service.findAll({});
    expect(courses).toHaveLength(6);
  });

  it('calculates statistics with CreditService', async () => {
    const stats = await service.stats();
    expect(stats).toEqual({ totalCourses: 6, totalCredits: 17, overloaded: false });
  });

  it('finds one course by code', async () => {
    const course = await service.findOne('CS-301L');
    expect(course.title).toBe('Full Stack Web Development Lab');
    expect(course.creditHours).toBe(3);
  });

  it('throws NotFoundException for an unknown course', async () => {
    await expect(service.findOne('CS-999')).rejects.toThrow(NotFoundException);
  });

  it('creates a course and logs it', async () => {
    const created = await service.create({
      code: 'CS-420', title: 'Compilers', creditHours: 3,
      instructor: 'Dr. Hamza Rauf', department: Department.CS,
      tags: ['theory', 'core'],
    });
    expect(created.code).toBe('CS-420');
    expect(logger.log).toHaveBeenCalledWith('Created course CS-420');
    expect(await service.findAll({})).toHaveLength(7);
  });

  it('rejects a duplicate code with ConflictException', async () => {
    await expect(service.create({
      code: 'CS-301L', title: 'Another Lab', creditHours: 3,
      instructor: 'Dr. Hamza Rauf', department: Department.CS,
    })).rejects.toThrow(ConflictException);
  });

  it('removes a course and logs it', async () => {
    await service.remove('CS-321');
    expect(logger.log).toHaveBeenCalledWith('Deleted course CS-321');
    await expect(service.findOne('CS-321')).rejects.toThrow(NotFoundException);
  });
});
