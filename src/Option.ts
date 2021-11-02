import { O, pipe } from "./lib";

// Constructors
const someString = O.of("value");
const someNumber = O.some(1);
const none = O.none;
const fromNullableNone = O.fromNullable(null); // O.none
const fromNullableSome = O.fromNullable("string"); // O.some("string")

// Transformers
O.map((str: string) => str.length)(someString);
O.map((str: string) => str.length)(none);
O.chain((num: number) => O.some(num + 1))(someNumber);
O.chain((num: number) => O.none)(someNumber);
O.chain((num: number) => O.none)(none);
O.filter((str: string) => str.length > 3)(someString);
O.filterMap((x: number) => (x % 2 === 0 ? O.some(x * 2) : O.none))(O.some(1));

// De-constructors
O.fold(
  () => "",
  (str) => str
)(someString);
O.getOrElse(() => 0)(someNumber);
O.toNullable(someNumber);
O.toUndefined(someNumber);

// Examples

// Example1
export const doubleOdd = (data: number): O.Option<number> =>
  pipe(
    data,
    O.fromNullable,
    O.filter((x) => x % 2 === 1),
    O.map((x) => x * 2)
  );

// Example2
export type Address = {
  province: string;
  city: string;
  street1: O.Option<string>;
  street2: O.Option<string>;
};

export type Profile = {
  name: string;
  age: number;
  address: O.Option<Address>;
};
export type Job = any;
export type Title = any;

export type User = {
  profile: O.Option<Profile>;
  job: Job;
  title: Title;
};

export const getUserName = (user: User): string =>
  pipe(
    O.fromNullable(user),
    O.chain((user) => user.profile),
    O.map((profile) => profile.name),
    O.fold(
      () => "Unknown User",
      (name: string) => name
    )
  );

// Tasks: implement the following functions and pass the tests in Option.spec.ts
export declare function getUserStreet1(user: User): O.Option<string>;
export declare function getUserFullAddress(user: User): string;
