// End-to-end test: starts the real app, but swaps the file store for a memory store.
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { createValidationPipe } from '../src/common/pipes/app-validation.pipe';
import { InMemoryStudentStore, STUDENT_STORE } from '../src/students/store/student-store';
import { SEED_STUDENTS } from '../src/students/students.seed';

describe('Students API (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(STUDENT_STORE)
      .useValue(new InMemoryStudentStore(SEED_STUDENTS))
      .compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(createValidationPipe());
    await app.init();
  });

  afterEach(() => app.close());

  const good = {
    name: ' Zara Ali ', rollNumber: 'bscs-099', email: 'zara@example.com',
    department: 'Data Science', semester: 3, cgpa: 3.25,
  };

  it('GET /api/students returns 6 students', async () => {
    const res = await request(app.getHttpServer()).get('/api/students').expect(200);
    expect(res.body).toHaveLength(6);
  });

  it('GET /api/students/stats comes before :rollNumber', async () => {
    const res = await request(app.getHttpServer()).get('/api/students/stats').expect(200);
    expect(res.body.totalStudents).toBe(6);
  });

  it('GET /api/students/bscs-023 accepts lower case', async () => {
    const res = await request(app.getHttpServer()).get('/api/students/bscs-023').expect(200);
    expect(res.body.name).toBe('Sara Ahmed');
  });

  it('POST cleans the data and returns 201', async () => {
    const res = await request(app.getHttpServer()).post('/api/students').send(good).expect(201);
    expect(res.body.name).toBe('Zara Ali');
    expect(res.body.rollNumber).toBe('BSCS-099');
  });

  it('POST twice returns 409', async () => {
    await request(app.getHttpServer()).post('/api/students').send(good).expect(201);
    await request(app.getHttpServer()).post('/api/students').send(good).expect(409);
  });

  it('POST with invalid data returns 400 and a list of details', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/students').send({ name: 'Al', semester: '3' }).expect(400);
    expect(res.body.error).toBe('Validation failed');
    expect(res.body.details.length).toBeGreaterThan(3);
  });

  it('POST with an extra property returns 400', async () => {
    await request(app.getHttpServer())
      .post('/api/students').send({ ...good, isAdmin: true }).expect(400);
  });

  it('GET with a bad query returns 400', async () => {
    await request(app.getHttpServer()).get('/api/students?minCgpa=abc').expect(400);
    await request(app.getHttpServer()).get('/api/students?sort=name').expect(400);
  });

  it('PATCH changes only the CGPA', async () => {
    const res = await request(app.getHttpServer())
      .patch('/api/students/BSCS-014').send({ cgpa: 2.6 }).expect(200);
    expect(res.body.cgpa).toBe(2.6);
    expect(res.body.name).toBe('Ayesha Noor');
  });

  it('DELETE returns 204, then 404', async () => {
    await request(app.getHttpServer()).delete('/api/students/BSCS-001').expect(204);
    await request(app.getHttpServer()).get('/api/students/BSCS-001').expect(404);
  });
});
