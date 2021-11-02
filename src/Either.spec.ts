import { validateUUIDAll, uuidValidationFn, validateUUID } from "./Either";
import { NEA, E } from "./lib";

describe("Either", () => {
  describe("validateUUID", () => {
    it("should return the uuid is right", () => {
      const validationResult = validateUUID(
        "574fd670-3ed4-455f-ad53-9998cfb292eb",
        uuidValidationFn
      );

      expect(validationResult).toEqual(
        "The uuid is 574fd670-3ed4-455f-ad53-9998cfb292eb"
      );
    });

    it("should return the input is not present", () => {
      const validationResult = validateUUID(undefined, uuidValidationFn);

      expect(validationResult).toEqual("The input is not present!");
    });

    it("should return the input length is not 32", () => {
      const validationResult = validateUUID("123123", uuidValidationFn);

      expect(validationResult).toEqual("The input length is not 36");
    });

    it("should return the input length is not 32", () => {
      const validationResult = validateUUID(
        "XX4fd670-3ed4-455f-ad53-9998cfb292eb",
        uuidValidationFn
      );

      expect(validationResult).toEqual(
        "The character should be [0-9] or [a-f] or -"
      );
    });
  });

  describe.skip("validateUUIDAll", () => {
    it("should return all errors", () => {
      expect(validateUUIDAll("123!", uuidValidationFn)).toEqual(
        E.left(
          NEA.of([
            "The input length is not 32",
            "The character should be digital or [a-f]",
            "The structure should be like ********-****-****-****-************",
          ])
        )
      );
    });
  });
});
