import { A, E, O, NEA, pipe, flow, J, sequenceT } from "./lib";

// Constructors
const foo = E.right("foo");
const left = E.left("error");
const right = E.of("right");
const left2 = E.of(null);
const leftFromNullable = E.fromNullable(null);
const fromOption: E.Either<string, string> = E.fromOption(() => "not present")(
  O.some("some")
);

// Transformers
E.map((str: string) => str.length)(foo); // E.right(3)
E.map((str: string) => str.length)(left); // E.left("error")
E.chain((str: string) => E.of(str.length))(foo); // E.right(3)
E.chain((str: string) => E.left("str"))(foo); // E.left("str")
E.filterOrElse(
  (str: string) => str.length > 3,
  () => E.left("less or equal than 3")
)(foo); // E.left("less or equal than 3")
pipe(
  J.stringify({ a: "foo" }),
  E.map((str) => J.parse(str))
);

// De-constructors
E.fold(
  (left) => left,
  (right) => right
)(foo);
E.getOrElse(() => "default")(foo); // "foo"
E.orElse(() => right)(foo); // "foo"

// Others functions
E.isLeft(foo);
E.isRight(right);

/* Examples: Fail fast validation */
// Either
// input: one of [ "e708f630-f41c-461b-a1f9-11095f9adafe", undefined, null, "e708f630-f41c-461b-a1f9-11095f9adaf", "e708f630f41c--461b-a1f9-11095f9adaf", ""e708f630-f41c-461b-a1f9-11095f9adaF"]
// invalid input: null, undefined
// length: 36
// structure: 8-4-4-4-12
// character: [a-z0-9]

const uuidLengthValidation = (uuid: string) =>
  E.fromPredicate(
    (input: string) => input.length === 36,
    () => "The input length is not 36"
  )(uuid);
// need implement this function
// E.left<string, string>('The structure should be like ********-****-****-****-************')
const uuidStructureValidation = (uuid: string) =>
  E.fromPredicate(
    (input: string) => /\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/.test(input),
    () => "The structure should be like ********-****-****-****-************"
  )(uuid);
// need implement this function
const uuidCharacterValidation = (uuid: string) =>
  E.fromPredicate(
    (input: string) => /[-0-9a-f]{36}/.test(input),
    () => "The character should be [0-9] or [a-f] or -"
  )(uuid);

// Use chain to do the validate
export const validateUUIDv1 = (uuid: string | undefined | null): string =>
  pipe(
    O.fromNullable(uuid),
    E.fromOption(() => "The input is not present!"),
    E.chain(uuidLengthValidation),
    E.chain(uuidStructureValidation),
    E.chain(uuidCharacterValidation),
    E.fold(
      (left) => left,
      (right) => `The uuid is ${right}`
    )
  );

// If you want to make the validation extensible
type UuidValidationFn = (uuid: string) => E.Either<string, string>;
const composedValidation = (
  validationFunctions: Array<UuidValidationFn>
): UuidValidationFn =>
  pipe(
    validationFunctions,
    A.foldLeft(
      () => (input: string) => E.of(input),
      (acc: UuidValidationFn, tail: UuidValidationFn[]) =>
        flow(acc, E.chain(composedValidation(tail)))
    )
  );

export const uuidValidationFn = composedValidation([
  uuidLengthValidation,
  uuidStructureValidation,
  uuidCharacterValidation,
]);

export const validateUUID = (
  uuid: string | undefined | null,
  uuidValidationFn: UuidValidationFn
): string =>
  pipe(
    O.fromNullable(uuid),
    E.fromOption(() => "The input is not present!"),
    E.chain(uuidValidationFn),
    E.fold(
      (left) => left,
      (right) => `The uuid is ${right}`
    )
  );

console.log(validateUUID(undefined, uuidValidationFn));
console.log(
  validateUUID("e708f630-f41c-461b-a1f9-11095f9adafe", uuidValidationFn)
);

// Tasks
// Implement a Validation that can return all of the errors
type UUID = string;
type Maybe<T> = T | undefined | null;

// It could be like:
export declare function validateUUIDAll(
  uuid: Maybe<UUID>,
  uuidValidationFn: UuidValidationFn
): E.Either<NEA.NonEmptyArray<string>, string>;

type LiftedUuidValidationFn = (
  uuid: string
) => E.Either<NEA.NonEmptyArray<string>, string>;

const liftUuidValidation =
  (validation: UuidValidationFn): LiftedUuidValidationFn =>
  (uuid: string) =>
    pipe(
      validation(uuid),
      E.mapLeft((error) => [error])
    );

const uuidValidationsFn = (
  uuid: string
): E.Either<NEA.NonEmptyArray<string>, string> =>
  pipe(
    sequenceT(E.getApplicativeValidation(NEA.getSemigroup<string>()))(
      liftUuidValidation(uuidLengthValidation)(uuid),
      liftUuidValidation(uuidStructureValidation)(uuid),
      liftUuidValidation(uuidCharacterValidation)(uuid)
    ),
    E.map(() => uuid)
  );

const validateUUIDAllUseNEA = (
  uuid: string
): E.Either<NEA.NonEmptyArray<string>, string> =>
  pipe(
    O.fromNullable(uuid),
    E.fromOption(() => NEA.of("The input is not present!")),
    E.chain(uuidValidationsFn)
  );
