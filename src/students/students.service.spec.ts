// Unit test: DI lets us hand the service a FAKE store and a FAKE logger.
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppLogger } from '../common/logger/app-logger';
import { GradeService } from './grade.service';
import { SEED_STUDENTS } from './students.seed';
import { StudentsService } from './students.service';
import { InMemoryStudentStore, STUDENT_STORE } from './store/student-store';
import { Department } from './student.entity';

describe('StudentsService', () => {
  let service: StudentsService;
  const logger = { log: jest.fn() };

  beforeEach(async () => {
    logger.log.mockClear();
    const moduleRef = await Test.createTestingModule({
      providers: [
        StudentsService,
        GradeService,
        { provide: STUDENT_STORE, useValue: new InMemoryStudentStore(SEED_STUDENTS) },
        { provide: AppLogger, useValue: logger },
      ],
    }).compile();

    service = moduleRef.get(StudentsService);
  });

  it('returns all students with a status', async () => {
    const students = await service.findAll({});
    expect(students).toHaveLength(6);
    expect(students[0]).toHaveProperty('status');
  });

  it('filters by department and sorts by cgpa', async () => {
    const result = await service.findAll({
      department: Department.DS, sort: 'cgpa', order: 'desc',
    });
    expect(result.map((s) => s.rollNumber)).toEqual(['BSCS-050', 'BSCS-014']);
  });

  it('calculates statistics', async () => {
    const stats = await service.stats();
    expect(stats.totalStudents).toBe(6);
    expect(stats.averageCgpa).toBe(3.02);
    expect(stats.highest.name).toBe('Sara Ahmed');
    expect(stats.academicWarnings).toBe(1);
  });

  it('throws NotFoundException for an unknown student', async () => {
    await expect(service.findOne('BSCS-777')).rejects.toThrow(NotFoundException);
  });

  it('creates a student, logs it, and rejects a duplicate', async () => {
    const dto = {
      name: 'Zara Ali', rollNumber: 'BSCS-099', email: 'zara@example.com',
      department: Department.DS, semester: 3, cgpa: 3.25,
    };
    const created = await service.create(dto);
    expect(created.status).toBe('Excellent');
    expect(logger.log).toHaveBeenCalledWith('Created student BSCS-099');
    await expect(service.create(dto)).rejects.toThrow(ConflictException);
  });

  it('updates only the fields that were sent', async () => {
    const updated = await service.update('BSCS-014', { cgpa: 2.6 });
    expect(updated.cgpa).toBe(2.6);
    expect(updated.name).toBe('Ayesha Noor');
    expect(updated.status).toBe('Good');
  });

  it('removes a student', async () => {
    await service.remove('BSCS-001');
    await expect(service.findOne('BSCS-001')).rejects.toThrow(NotFoundException);
  });
});
