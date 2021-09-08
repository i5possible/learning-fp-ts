import * as O from "fp-ts/Option";
import * as E from "fp-ts/Either";
import * as T from "fp-ts/Task";
import * as TE from "fp-ts/TaskEither";
import * as A from "fp-ts/Array";
import * as NEA from "fp-ts/NonEmptyArray";
import { pipe } from "fp-ts/function";
import Do from "fp-ts-contrib/Do";
import { string } from "yargs";

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

// Either
// input: one of [ "e708f630-f41c-461b-a1f9-11095f9adafe", undefined, null, "e708f630-f41c-461b-a1f9-11095f9adaf", "e708f630f41c--461b-a1f9-11095f9adaf", ""e708f630-f41c-461b-a1f9-11095f9adaF"]
// invalid input: null, undefined
// length: 32
// structure: 8-4-4-4-12
// character: [a-z0-9]
const validateUUID = (uuid: string | undefined | null): string =>
  pipe(
    O.fromNullable(uuid),
    E.fromOption(() => "The input is not present!"),
    E.fold(
      (left) => left,
      (right) => `The uuid is ${right}`
    )
  );

console.log(validateUUID(undefined));
console.log(validateUUID("e708f630-f41c-461b-a1f9-11095f9adafe"));

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
