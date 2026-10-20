// End-to-end test: starts the real app, but swaps the file store for a memory store.
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { createValidationPipe } from '../src/common/pipes/app-validation.pipe';
import { SEED_COURSES } from '../src/courses/courses.seed';
import {
  COURSE_STORE, InMemoryCourseStore,
} from '../src/courses/store/course-store';

describe('Courses API (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(COURSE_STORE)
      .useValue(new InMemoryCourseStore(SEED_COURSES))
      .compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(createValidationPipe());
    await app.init();
  });

  afterEach(() => app.close());

  const good = {
    code: ' cs-420 ', title: '  Compilers ', creditHours: 3,
    instructor: 'Dr. Hamza Rauf', department: 'Computer Science',
    tags: ['Theory', 'CORE'],
  };

  it('GET /api/courses returns 6 courses', async () => {
    const res = await request(app.getHttpServer()).get('/api/courses').expect(200);
    expect(res.body).toHaveLength(6);
  });

  it('GET /api/courses/stats comes before :code', async () => {
    const res = await request(app.getHttpServer()).get('/api/courses/stats').expect(200);
    expect(res.body).toEqual({ totalCourses: 6, totalCredits: 17, overloaded: false });
  });

  it('GET /api/courses/CS-301L returns the lab course', async () => {
    const res = await request(app.getHttpServer()).get('/api/courses/CS-301L').expect(200);
    expect(res.body.code).toBe('CS-301L');
    expect(res.body.creditHours).toBe(3);
  });

  it('GET /api/courses/abc returns 400 (pattern, not 404)', async () => {
    const res = await request(app.getHttpServer()).get('/api/courses/abc').expect(400);
    expect(res.body.error).toBe('Validation failed');
    expect(res.body.details).toContain('code must look like CS-301 or CS-301L');
  });

  it('POST cleans the data and returns 201', async () => {
    const res = await request(app.getHttpServer()).post('/api/courses').send(good).expect(201);
    expect(res.body.code).toBe('CS-420');
    expect(res.body.title).toBe('Compilers');
    expect(res.body.tags).toEqual(['theory', 'core']);
  });

  it('POST twice returns 409', async () => {
    await request(app.getHttpServer()).post('/api/courses').send(good).expect(201);
    await request(app.getHttpServer()).post('/api/courses').send(good).expect(409);
  });

  it('POST with invalid data returns 400 and a list of details', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/courses')
      .send({
        code: 'CS3', title: 'AI', creditHours: 9,
        instructor: 'Dr. Hamza', department: 'Data Science',
      })
      .expect(400);
    expect(res.body.error).toBe('Validation failed');
    expect(res.body.details).toEqual([
      'code must look like CS-301 or CS-301L',
      'title must be at least 3 characters',
      'creditHours must be at most 4',
    ]);
  });

  it('DELETE returns 204, then GET returns 404', async () => {
    await request(app.getHttpServer()).delete('/api/courses/CS-321').expect(204);
    await request(app.getHttpServer()).get('/api/courses/CS-321').expect(404);
  });
});
