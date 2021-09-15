import { A, E, O, pipe, flow, J } from "./lib";

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

// Examples: Fail fast validation

const uuidLengthValidation = (uuid: string) =>
  E.fromPredicate(
    (input: string) => input.length === 32,
    () => "The input length is not 32"
  )(uuid);
const uuidStructureValidation = (uuid: string) =>
  E.right<string, string>("e708f630-f41c-461b-a1f9-11095f9adafe");
const uuidCharacterValidation = (uuid: string) =>
  E.left<string, string>("Not valid character");

// Use chain to do the validate
// const validateUUID = (uuid: string | undefined | null): string =>
//   pipe(
//     O.fromNullable(uuid),
//     E.fromOption(() => "The input is not present!"),
//     E.chain(uuidLengthValidation),
//     E.chain(uuidStructureValidation),
//     E.chain(uuidCharacterValidation),
//     E.fold(
//       (left) => left,
//       (right) => `The uuid is ${right}`
//     )
//   );

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

const uuidValidationFn = composedValidation([
  uuidLengthValidation,
  uuidStructureValidation,
  uuidCharacterValidation,
]);

const validateUUID = (
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

// Implement a Validation that can return all of the errors
