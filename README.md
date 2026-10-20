# Lab 08 - NestJS: Dependency Injection and DTO Validation (CS-301L)

The Lab 07 Student API, rebuilt in NestJS (Lab 08 manual), plus the four
Lab 08 tasks:

- **Task 1 — Courses module:** a second feature built exactly like Students —
  thin controller, service, and a store chosen by a `useFactory` provider
  behind the `COURSE_STORE` Symbol token, plus a plain `CreditService`.
- **Task 2 — Fees module:** a pluggable fee policy. `FeesService` depends on
  the `FEE_POLICY` Symbol token, the `FEE_RATE` string token (`useValue: 5000`)
  and the exported `StudentsService` from `StudentsModule`. A factory picks
  `StandardFeePolicy` or `MeritFeePolicy` from the environment — swapping the
  policy never edits the service. A `useExisting` alias (`FEE_CALCULATOR`)
  powers `GET /api/fees/info`.
- **Task 3 — DTOs and validation:** `CreateCourseDto`, mapped types
  (`OmitType` / `PartialType`), `QueryCourseDto`, `CodeParamDto` and
  `FeeQueryDto`, all enforced by the global `ValidationPipe`
  (transform + whitelist + forbidNonWhitelisted). Real responses are in
  [RESULTS.md](RESULTS.md); the concept answers are in [ANSWERS.md](ANSWERS.md).
- **Task 4 — Tests and Postman:** unit, DTO and e2e suites plus the
  “Lab 08 Tasks” Postman collection (23 requests, re-runnable, passes twice
  in a row under Newman).

## Setup
```
npm install
```

## Run
```
npm run start:dev                  # auto-restart on save (http://localhost:3000)
STORAGE=memory npm run start:dev   # in-memory stores instead of the data/*.json files
LOG_TO_FILE=true npm run start:dev # FileAppLogger writes to logs/app.log
FEE_POLICY=merit npm run start:dev # merit fee policy (default: standard)
PORT=4000 npm run start:dev        # different port (default: 3000)
```
(Windows PowerShell: `$env:STORAGE="memory"; npm run start:dev`)

Environment variables combine, e.g. `STORAGE=memory LOG_TO_FILE=true FEE_POLICY=merit npm run start:dev`.

## Endpoints
| Area | Routes |
|---|---|
| Students | `GET /api/students`, `GET /api/students/stats`, `GET /api/students/:rollNumber`, `POST`, `PUT`, `PATCH`, `DELETE` |
| Courses | `GET /api/courses` (search, department, minCredits, sort=creditHours, order, limit), `GET /api/courses/stats`, `GET /api/courses/:code`, `POST` (201, 409 on duplicate), `PUT`, `PATCH`, `DELETE` (204) |
| Fees | `GET /api/fees/info`, `GET /api/fees/:rollNumber?creditHours=12` |

Courses data lives in `data/courses.json` (file storage) or `SEED_COURSES`
(memory storage): 6 courses, 17 credit hours in total.

## Test
```
npm test          # unit + DTO tests (35 tests, 5 suites)
npm run test:e2e  # end-to-end tests (18 tests, in-memory stores)
```

Postman: import `postman/Lab08_Nest_Student_API.postman_collection.json`
(the manual's Student API suite) and `postman/Lab08_Tasks.postman_collection.json`
(the Lab 08 tasks: 23 requests over Courses + Fees, variables `baseUrl` and
`newCode`), then run them with the Collection Runner. The tasks collection is
re-runnable: its DELETE removes the course its POST created. Headless:

```
npx newman run postman/Lab08_Tasks.postman_collection.json
```

Keep `data/students.json` equal to `data/students.seed.json` before the first run.

## Where things are
| Idea | File |
|---|---|
| String token + `useValue` | `src/core/app-config.ts`, `src/core/core.module.ts`, `FEE_RATE` in `src/fees/fees.module.ts` |
| Abstract-class token + `useClass` | `src/common/logger/app-logger.ts` |
| Symbol token + `useFactory` | `src/students/store/student-store.ts`, `src/courses/store/course-store.ts`, `src/fees/fee-policy.ts` |
| `useExisting` alias | `FEE_CALCULATOR` in `src/fees/fees.module.ts`, used by `src/fees/fees-info.controller.ts` |
| Constructor injection | `src/students/students.service.ts`, `src/courses/courses.service.ts`, `src/fees/fees.service.ts` |
| DTOs, validation, transformation | `src/students/dto/`, `src/courses/dto/`, `src/fees/dto/` |
| Global ValidationPipe | `src/common/pipes/app-validation.pipe.ts`, `src/main.ts` |
| Screenshots | `screenshots/` (npm test, e2e, Newman runner, file logger) |
