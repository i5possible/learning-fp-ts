import * as O from "fp-ts/Option";
import * as E from "fp-ts/Either";
import * as T from "fp-ts/Task";
import * as TE from "fp-ts/TaskEither";
import * as A from "fp-ts/Array";
import * as NEA from "fp-ts/NonEmptyArray";
import { pipe } from "fp-ts/function";
import Do from "fp-ts-contrib/Do";

const some1: O.Option<number> = O.some(1);

const doubleOdd = (data: number): string =>
  pipe(
    data,
    O.fromNullable,
    O.filter((x) => x % 2 === 1),
    O.map((x) => x * 2),
    O.fold(
      () => "It's not a even number",
      (value) => `The result is ${value}`
    )
  );

console.log(doubleOdd(3));
console.log(doubleOdd(8));
