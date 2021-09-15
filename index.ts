import * as O from "fp-ts/Option";
import * as E from "fp-ts/Either";
import * as T from "fp-ts/Task";
import * as TE from "fp-ts/TaskEither";
import * as A from "fp-ts/Array";
import * as NEA from "fp-ts/NonEmptyArray";
import { flow, pipe } from "fp-ts/function";
import Do from "fp-ts-contrib/Do";

// Option
const doubleOdd = (data: number): string =>
  pipe(
    data,
    O.fromNullable,
    O.filter((x) => x % 2 === 1),
    O.map((x) => x * 2),
    O.fold(
      () => "It's not a odd number",
      (value) => `The result is ${value}`
    )
  );

console.log(doubleOdd(3));
console.log(doubleOdd(8));

// Task for Either
type Form = any;

// Decoder
type FormValidation = (form: Form) => E.Either<NEA.NonEmptyArray<string>, Form>;

// TaskEither
type Item = {
  id: string;
  name: string;
};

// create function return TE.left and TE.right for these two type
type ItemIdsByList = (listId: string) => TE.TaskEither<string, string[]>;
type ItemDetailById = (itemId: string) => TE.TaskEither<string, Item>;

const fetchItemIdsByListRight = (
  listId: string
): TE.TaskEither<string, string[]> => TE.right(["1", "2", "3"]);
const fetchItemDetailByIdRight = (listId) => TE.left("There is no such list!");

const fetchItems =
  (fetchItemIdsByList: ItemIdsByList, fetchItemDetailById: ItemDetailById) =>
  (listId): T.Task<string> =>
    pipe(
      listId,
      E.fromNullable("The listId is not present!"),
      TE.fromEither,
      TE.fold(
        (left) => T.of(left),
        (right) => T.of(`The items are ${JSON.stringify(right)}`)
      )
    );

console.log(
  fetchItems(fetchItemIdsByListRight, fetchItemDetailByIdRight)("1")()
);
