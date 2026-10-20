# Lab 08 Task 3 — Real Responses (RESULTS.md)

Every response below was copied from a live run of this server
(`STORAGE=memory`, `FEE_POLICY=standard`, http://localhost:3000).
Each entry names the decorator that produced each message.

## 1. Valid course, cleaned by class-transformer

**Request**

```
POST /api/courses
{ "code": " cs-420 ", "title": "  Compilers ", "creditHours": 3,
  "instructor": "Dr. Hamza Rauf", "department": "Computer Science",
  "tags": ["Theory", "CORE"] }
```

**Response — 201 Created**

```json
{
  "code": "CS-420",
  "title": "Compilers",
  "creditHours": 3,
  "instructor": "Dr. Hamza Rauf",
  "department": "Computer Science",
  "tags": [
    "theory",
    "core"
  ]
}
```

**Comment:** `@Transform` on `code` trimmed and upper-cased it (`" cs-420 "` → `"CS-420"`),
`@Transform` on `title` trimmed it, and the `@Transform` on `tags` lower-cased every tag
(`"Theory"` → `"theory"`, `"CORE"` → `"core"`) before validation ran.
(The course was deleted again with `DELETE /api/courses/CS-420` → 204.)

## 2. Invalid course — three messages in `details`

**Request**

```
POST /api/courses
{ "code": "CS3", "title": "AI", "creditHours": 9,
  "instructor": "Dr. Hamza", "department": "Data Science" }
```

**Response — 400 Bad Request**

```json
{
  "statusCode": 400,
  "error": "Validation failed",
  "details": [
    "code must look like CS-301 or CS-301L",
    "title must be at least 3 characters",
    "creditHours must be at most 4"
  ]
}
```

**Comment:** `"code must look like CS-301 or CS-301L"` comes from `@Matches(/^CS-\d{3}L?$/)` on
`code` in `CreateCourseDto`; `"title must be at least 3 characters"` from `@MinLength(3)` on
`title`; `"creditHours must be at most 4"` from `@Max(4)` on `creditHours`.
`instructor` ("Dr. Hamza") passes `@MinLength(3)` and `department` ("Data Science") is a valid
`Department` value, so `@IsEnum` stays silent — exactly three messages.

## 3. `creditHours` sent as text

**Request**

```
POST /api/courses
{ "code": "CS-430", "title": "Operating Systems", "creditHours": "3",
  "instructor": "Dr. Hamza Rauf", "department": "Computer Science" }
```

**Response — 400 Bad Request**

```json
{
  "statusCode": 400,
  "error": "Validation failed",
  "details": [
    "creditHours must be at most 4",
    "creditHours must be at least 1",
    "creditHours must be a whole number"
  ]
}
```

**Comment:** `CreateCourseDto.creditHours` has no `@Type(() => Number)` conversion (unlike the
query DTOs), so the JSON string `"3"` reaches `@IsInt` unchanged and fails
`"creditHours must be a whole number"`; the numeric `@Min(1)` / `@Max(4)` checks fail on the
string too. Text is not a whole number — the request is refused.

## 4. Six tags

**Request**

```
POST /api/courses
{ "code": "CS-430", "title": "Operating Systems", "creditHours": 3,
  "instructor": "Dr. Hamza Rauf", "department": "Computer Science",
  "tags": ["a", "b", "c", "d", "e", "f"] }
```

**Response — 400 Bad Request**

```json
{
  "statusCode": 400,
  "error": "Validation failed",
  "details": [
    "tags must have at most 5 items"
  ]
}
```

**Comment:** produced by `@ArrayMaxSize(5)` on `tags` in `CreateCourseDto`.

## 5. Extra property `isAdmin` (whitelist + forbidNonWhitelisted)

**Request**

```
POST /api/courses
{ "code": "CS-430", "title": "Operating Systems", "creditHours": 3,
  "instructor": "Dr. Hamza Rauf", "department": "Computer Science",
  "isAdmin": true }
```

**Response — 400 Bad Request**

```json
{
  "statusCode": 400,
  "error": "Validation failed",
  "details": [
    "property isAdmin should not exist"
  ]
}
```

**Comment:** `isAdmin` is not a property of `CreateCourseDto`. The global pipe's
`whitelist: true` would strip it, and `forbidNonWhitelisted: true` turns that into a
400 with the message `"property isAdmin should not exist"`.

## 6. `GET /api/courses?minCredits=abc`

**Response — 400 Bad Request**

```json
{
  "statusCode": 400,
  "error": "Validation failed",
  "details": [
    "minCredits must be at most 4",
    "minCredits must be at least 1",
    "minCredits must be a whole number"
  ]
}
```

**Comment:** in `QueryCourseDto`, `@Type(() => Number)` converts the query text `"abc"` to
`NaN` first; `@IsInt` then fails (`"minCredits must be a whole number"`) and so do
`@Min(1)` / `@Max(4)`, because `NaN` satisfies no numeric comparison.

## 7. `GET /api/courses?sort=title`

**Response — 400 Bad Request**

```json
{
  "statusCode": 400,
  "error": "Validation failed",
  "details": [
    "sort can only be \"creditHours\""
  ]
}
```

**Comment:** produced by `@IsIn(['creditHours'])` on `sort` in `QueryCourseDto` — the only
sortable field is `creditHours`.

## 8. `GET /api/courses/abc` — 400, not 404

**Response — 400 Bad Request**

```json
{
  "statusCode": 400,
  "error": "Validation failed",
  "details": [
    "code must look like CS-301 or CS-301L"
  ]
}
```

**Comment:** `CodeParamDto` upper-cases the value (`"abc"` → `"ABC"`) with `@Transform`, then
`@Matches(/^CS-\d{3}L?$/)` rejects it. Validation happens before the service runs, so a
malformed code is a 400 — only a well-formed but unknown code (e.g. `CS-999`) reaches the
service and returns 404.

## 9. PATCH tries to change `code`

**Request**

```
PATCH /api/courses/CS-301L
{ "code": "CS-999" }
```

**Response — 400 Bad Request**

```json
{
  "statusCode": 400,
  "error": "Validation failed",
  "details": [
    "property code should not exist"
  ]
}
```

**Comment:** `UpdateCourseDto` is `PartialType(OmitType(CreateCourseDto, ['code']))`, so `code`
is not part of the DTO at all. With `forbidNonWhitelisted: true` the pipe rejects it with
`"property code should not exist"` — a course code can never be changed through PATCH (or PUT).

## 10. `GET /api/fees/BSCS-023` with no `creditHours`

**Response — 400 Bad Request**

```json
{
  "statusCode": 400,
  "error": "Validation failed",
  "details": [
    "creditHours must be at most 24",
    "creditHours must be at least 1",
    "creditHours must be a whole number"
  ]
}
```

**Comment:** `FeeQueryDto.creditHours` is required (no `@IsOptional`). A missing value becomes
`NaN` through `@Type(() => Number)`, so `@IsInt` fails with
`"creditHours must be a whole number"` and `@Min(1)` / `@Max(24)` fail with it.
