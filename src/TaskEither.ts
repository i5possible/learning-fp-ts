import { E, pipe, T, TE } from "./lib";

// Constructors

// Transformers

// De-constructors

// Others functions

// Examples
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

// Tasks
