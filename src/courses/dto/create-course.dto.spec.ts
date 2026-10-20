// DTO test: class-transformer cleans the data, class-validator checks it.
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateCourseDto } from './create-course.dto';

const good = {
  code: ' cs-420 ', title: '  Compilers ', creditHours: 3,
  instructor: 'Dr. Hamza Rauf', department: 'Computer Science',
  tags: ['Theory', 'CORE'],
};

const check = (plain: object) =>
  validate(plainToInstance(CreateCourseDto, plain),
    { whitelist: true, forbidNonWhitelisted: true });

describe('CreateCourseDto', () => {
  it('cleans the data (trim, upper-case, lower-case tags)', () => {
    const dto = plainToInstance(CreateCourseDto, good);
    expect(dto.code).toBe('CS-420');
    expect(dto.title).toBe('Compilers');
    expect(dto.tags).toEqual(['theory', 'core']);
  });

  it('accepts valid data', async () => {
    expect(await check(good)).toHaveLength(0);
  });

  it('reports every invalid field', async () => {
    const errors = await check({
      code: 'CS3', title: 'AI', creditHours: 9,
      instructor: 'Dr. Hamza', department: 'Data Science',
    });
    expect(errors.map((e) => e.property).sort()).toEqual(
      ['code', 'creditHours', 'title']);
    const messages = errors.flatMap((e) => Object.values(e.constraints ?? {}));
    expect(messages).toContain('code must look like CS-301 or CS-301L');
    expect(messages).toContain('title must be at least 3 characters');
    expect(messages).toContain('creditHours must be at most 4');
  });

  it('rejects a number sent as text', async () => {
    const errors = await check({ ...good, creditHours: '3' });
    expect(errors.map((e) => e.property)).toContain('creditHours');
  });

  it('rejects unknown properties', async () => {
    const errors = await check({ ...good, isAdmin: true });
    expect(errors.map((e) => e.property)).toContain('isAdmin');
  });

  it('rejects more than 5 tags', async () => {
    const errors = await check({ ...good, tags: ['a', 'b', 'c', 'd', 'e', 'f'] });
    expect(errors.map((e) => e.property)).toContain('tags');
  });

  it('rejects a description longer than 200 characters', async () => {
    const errors = await check({ ...good, description: 'x'.repeat(201) });
    expect(errors.map((e) => e.property)).toContain('description');
  });
});
