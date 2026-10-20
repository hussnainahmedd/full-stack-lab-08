# Lab 08 — ANSWERS.md

## (a) Why can an interface not be an injection token?

An interface exists only at compile time: TypeScript erases it completely, so at runtime there is no object left for Nest to look up in its provider registry. Nest resolves every dependency by its token while the application starts, so the token has to be something that survives compilation — a class, a string, or a `Symbol`. That is why this project injects the stores and the fee policy through `Symbol` tokens (`STUDENT_STORE`, `COURSE_STORE`, `FEE_POLICY`) and the logger through the abstract class `AppLogger`, while the interfaces (`StudentStore`, `CourseStore`, `FeePolicy`) are only used as types.

## (b) What does it mean that a provider is a singleton?

It means Nest creates exactly one instance of the provider for the whole application and hands that same instance to every class that injects it. The instance is created once, lazily, the first time it is needed, and then cached, so all consumers share the same state — for example, every request sees the same in-memory student store, and `FeesService` and the `FEE_CALCULATOR` alias are literally the same object. Nothing is re-constructed per request.

## (c) What must you write so OtherModule can use CoursesService?

Two things: add `CoursesService` to the `exports` array of `CoursesModule` (a provider is private to its module until it is exported), and add `CoursesModule` to the `imports` array of `OtherModule`. After that, any provider or controller inside `OtherModule` can receive `CoursesService` through its constructor like any other dependency. This project does exactly that with `StudentsService`: `StudentsModule` exports it and `FeesModule` imports `StudentsModule`.
