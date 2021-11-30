import { string } from "fp-ts";
import { list } from "fp-ts-contrib/lib/List";
import { E, pipe, T, TE, A, O, RA } from "./lib";

// Constructors
const taskTE = TE.of("task");
const leftTE: TE.TaskEither<string, string> = TE.left<string, string>("left");
const rightTE = TE.right("right");

// Transformers
TE.map((value: string) => value.length)(taskTE);
TE.map((value: string) => value.length)(leftTE);
pipe(
  taskTE,
  TE.chain((value: string) => TE.of(value.length))
);
pipe(
  leftTE,
  TE.chain((value: string) => TE.of(value.length))
);
TE.getOrElse(() => T.of("some task"))(taskTE);
TE.getOrElse(() => T.of("some task"))(leftTE);
TE.filterOrElse(
  (value) => value === "task",
  () => TE.left("not a task")
);

// De-constructors
pipe(
  taskTE,
  TE.fold(
    () => T.of("It's a left"),
    (right) => T.of(right)
  ),
  (task) => task()
);

// Others functions
TE.sequenceArray;
TE.traverseArray;

// Examples
type Item = {
  id: number;
  name: string;
  description: string;
};

// create function return TE.left and TE.right for these two type
type ItemIdByName = (itemName: string) => TE.TaskEither<string, number>;
type ItemDetailById = (itemId: number) => TE.TaskEither<string, Item>;

const itemNames = [
  { id: 1, name: "firstItem" },
  { id: 2, name: "secondItem" },
  { id: 3, name: "itemThree" },
];

const itemDetails: Item[] = [
  {
    id: 2,
    description: "Some description about this item2",
    name: "secondItem",
  },
  {
    id: 3,
    description: "Some description about this item3",
    name: "itemThree",
  },
  {
    id: 4,
    description: "Some description about this item4",
    name: "itemFour",
  },
];

const fetchItemIdByName = (itemName: string): TE.TaskEither<string, number> =>
  pipe(
    itemNames,
    A.findFirst((item) => item.name === itemName),
    O.map((item) => item.id),
    E.fromOption(() => "Item does not exist!"),
    TE.fromEither
  );

const fetchItemDetailById = (itemId: number): TE.TaskEither<string, Item> =>
  pipe(
    itemDetails,
    A.findFirst((item) => item.id === itemId),
    E.fromOption(() => "Item detail is missing!"),
    TE.fromEither
  );

const fetchItem =
  (fetchItemIdByName: ItemIdByName, fetchItemDetailById: ItemDetailById) =>
  (itemName: string): TE.TaskEither<string, Item> =>
    pipe(itemName, fetchItemIdByName, TE.chain(fetchItemDetailById));

export const fetchItemByName = fetchItem(
  fetchItemIdByName,
  fetchItemDetailById
);

// Tasks
// implement the following two functions
type ItemIdsByListId = (listId: number) => TE.TaskEither<string, number[]>;
type listsType = { id: number; itemIds: number[] }[];

const lists: listsType = [
  { id: 1, itemIds: [2, 3] },
  { id: 2, itemIds: [1, 3] },
  { id: 3, itemIds: [2, 4] },
];

// export declare function fetchItemIdsByListId(
//   listId: number
// ): TE.TaskEither<string, number[]>;

// export declare function fetchItemsByListId(
//   listId: number
// ): TE.TaskEither<string, Item[]>;

export const fetchItemIdsByListId = (
  listId: number
): TE.TaskEither<string, number[]> =>
  pipe(
    lists,
    A.findFirst((entry) => entry.id === listId),
    O.map((entry) => entry.itemIds),
    E.fromOption(() => "List is missing!"),
    TE.fromEither
  );

const fetchItems =
  (
    fetchItemDetailById: ItemDetailById,
    fetchItemIdsByListId: ItemIdsByListId
  ) =>
  (listId: number): TE.TaskEither<string, Item[]> =>
    pipe(
      listId,
      fetchItemIdsByListId,
      TE.chain(TE.traverseArray(fetchItemDetailById)),
      TE.map(RA.toArray)
    );

export const fetchItemsByListId = fetchItems(
  fetchItemDetailById,
  fetchItemIdsByListId
);
