import { idText } from "typescript";
import { NEA, TE, T, pipe } from "./lib";
import { fetchItemByName, fetchItemsByListId } from "./TaskEither";

describe("TaskEither", () => {
  describe("getItemByItemName", () => {
    it("should return the item", async () => {
      const result = await pipe(
        fetchItemByName("secondItem"),
        TE.getOrElseW((error) => T.of(error))
      )();

      expect(result).toEqual({
        id: 2,
        description: "Some description about this item2",
        name: "secondItem",
      });
    });

    it("should return the item detail is missing", async () => {
      const result = await pipe(
        fetchItemByName("firstItem"),
        TE.getOrElseW((error) => T.of(error))
      )();

      expect(result).toEqual("Item detail is missing!");
    });

    it("should return the item does not exist", async () => {
      const result = await pipe(
        fetchItemByName("itemFour"),
        TE.getOrElseW((error) => T.of(error))
      )();

      expect(result).toEqual("Item does not exist!");
    });
  });

  describe("getItemsByListId", () => {
    it("should return all items", async () => {
      const result = await pipe(
        fetchItemsByListId(1),
        TE.getOrElseW((error) => T.of(error))
      )();

      expect(result).toEqual([
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
      ]);
    });

    it("should return list missing error", async () => {
      const result = await pipe(
        fetchItemsByListId(4),
        TE.getOrElseW((error) => T.of(error))
      )();

      expect(result).toEqual("List is missing!");
    });

    it("should return item missing error", async () => {
      const result = await pipe(
        fetchItemsByListId(2),
        TE.getOrElseW((error) => T.of(error))
      )();

      expect(result).toEqual("Item detail is missing!");
    });
  });
});
