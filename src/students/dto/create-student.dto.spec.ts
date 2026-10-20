// DTO test: class-transformer cleans the data, class-validator checks it.
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateStudentDto } from './create-student.dto';

const good = {
  name: '  Zara Ali ', rollNumber: 'bscs-099', email: ' Zara@Example.com ',
  department: 'Data Science', semester: 3, cgpa: 3.25,
};

const check = (plain: object) =>
  validate(plainToInstance(CreateStudentDto, plain),
    { whitelist: true, forbidNonWhitelisted: true });

describe('CreateStudentDto', () => {
  it('cleans the data (trim, upper-case, lower-case)', () => {
    const dto = plainToInstance(CreateStudentDto, good);
    expect(dto.name).toBe('Zara Ali');
    expect(dto.rollNumber).toBe('BSCS-099');
    expect(dto.email).toBe('zara@example.com');
  });

  it('accepts valid data', async () => {
    expect(await check(good)).toHaveLength(0);
  });

  it('reports every invalid field', async () => {
    const errors = await check({
      name: 'Al', rollNumber: 'X1', email: 'nope',
      department: 'Art', semester: 12, cgpa: 9,
    });
    expect(errors.map((e) => e.property).sort()).toEqual(
      ['cgpa', 'department', 'email', 'name', 'rollNumber', 'semester']);
  });

  it('rejects a number sent as text', async () => {
    const errors = await check({ ...good, semester: '3' });
    expect(errors.map((e) => e.property)).toContain('semester');
  });

  it('rejects unknown properties', async () => {
    const errors = await check({ ...good, isAdmin: true });
    expect(errors.map((e) => e.property)).toContain('isAdmin');
  });
});
