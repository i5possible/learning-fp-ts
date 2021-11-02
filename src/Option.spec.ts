import { O } from "./lib";
import {
  getUserName,
  doubleOdd,
  getUserStreet1,
  getUserFullAddress,
} from "./Option";

const userWithoutProfile = {
  profile: O.none,
  job: "some job",
  title: "some title",
};

const userWithoutAddress = {
  profile: O.some({
    name: "John Doe",
    age: 30,
    address: O.none,
  }),
  job: "some job",
  title: "some title",
};

const userWithoutStreet1 = {
  profile: O.some({
    name: "John Doe",
    age: 30,
    address: O.some({
      province: "some province",
      city: "some city",
      street1: O.none,
      street2: O.some("some street2"),
    }),
  }),
  job: "some job",
  title: "some title",
};

const userWithAddressAndStreet1 = {
  profile: O.some({
    name: "John Doe",
    age: 30,
    address: O.some({
      province: "some province",
      city: "some city",
      street1: O.some("some street1"),
      street2: O.none,
    }),
  }),
  job: "some job",
  title: "some title",
};

const userWithEverything = {
  profile: O.some({
    name: "John Doe",
    age: 30,
    address: O.some({
      province: "some province",
      city: "some city",
      street1: O.some("some street1"),
      street2: O.some("some street2"),
    }),
  }),
  job: "some job",
  title: "some title",
};

describe("doubleOdd", () => {
  it("should double the odd numbers", () => {
    expect(doubleOdd(1)).toEqual(O.some(2));
    expect(doubleOdd(3)).toEqual(O.some(6));
    expect(doubleOdd(5)).toEqual(O.some(10));
  });

  it("should return none", () => {
    expect(doubleOdd(2)).toEqual(O.none);
    expect(doubleOdd(4)).toEqual(O.none);
    expect(doubleOdd(6)).toEqual(O.none);
  });
});

describe("getUserName", () => {
  it("should return the name of the user", () => {
    expect(getUserName(userWithEverything)).toEqual("John Doe");
  });

  it("should return Unknown User if the profile is missing", () => {
    expect(getUserName(userWithoutProfile)).toEqual("Unknown User");
  });
});

// remove the '.skip' to run this test suite when the function is implemented
describe.skip("getUserStreet1", () => {
  it("should return user street1", () => {
    expect(getUserStreet1(userWithAddressAndStreet1)).toEqual(
      O.some("some street1")
    );
    expect(getUserStreet1(userWithEverything)).toEqual(O.some("some street1"));
  });

  it("should return none", () => {
    expect(getUserStreet1(userWithoutProfile)).toEqual(O.none);
    expect(getUserStreet1(userWithoutAddress)).toEqual(O.none);
    expect(getUserStreet1(userWithoutStreet1)).toEqual(O.none);
  });
});

// remove the '.skip' to run this test suite when the function is implemented
describe.skip("getUserFullAddress", () => {
  it("should return the full address", () => {
    expect(getUserFullAddress(userWithEverything)).toEqual(
      "some street1, some street2, some city, some province"
    );
  });

  it("should return address with some part is missing", () => {
    expect(getUserFullAddress(userWithoutProfile)).toEqual("");
    expect(getUserFullAddress(userWithoutAddress)).toEqual("");
    expect(getUserFullAddress(userWithoutStreet1)).toEqual(
      "some street2, some city, some province"
    );
    expect(getUserFullAddress(userWithAddressAndStreet1)).toEqual(
      "some street1, some city, some province"
    );
  });
});
