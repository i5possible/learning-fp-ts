import * as O from "fp-ts/Option";
import { pipe } from "fp-ts/function";

// Constructor
const someString = O.of("value");
const someNumber = O.some(1);
const none = O.none;
const fromNullableNone = O.fromNullable(null); // O.none
const fromNullableSome = O.fromNullable("string"); // O.some("string")

// Transform
O.map((str: string) => str.length)(someString);
O.map((str: string) => str.length)(none);
O.chain((num: number) => O.some(num + 1))(someNumber);
O.chain((num: number) => O.none)(someNumber);
O.chain((num: number) => O.none)(none);

// De-constructor
O.fold(
  () => "",
  (str) => str
)(someString);
O.getOrElse(() => 0)(someNumber);
O.toNullable(someNumber);
O.toUndefined(someNumber);

// Examples
type Address = {
  province: string;
  city: string;
  street1: O.Option<string>;
  street2: O.Option<string>;
};

type Profile = {
  name: string;
  age: number;
  address: O.Option<Address>;
};
type Job = any;
type Title = any;

type User = {
  profile: O.Option<Profile>;
  job: Job;
  title: Title;
};

const getUserName = (user: User): string =>
  pipe(
    O.fromNullable(user),
    O.chain((user) => user.profile),
    O.map((profile) => profile.name),
    O.fold(
      () => "Unknown User",
      (name: string) => name
    )
  );

// Tasks

/*
{
  address: {
    province: "province",
    stree1: "street1",
    stree2: null,
  }
}
getUserStreet1: O.some("street1")
getUserFullAddress: "province, street1"

{
  address: {
    province: "province",
    city: "city",
    stree2: "street2",
  }
}
getUserStreet1: O.none
getUserFullAddress: "province, city, street2"

*/
declare function getUserStreet1(user: User): O.Option<string>;
declare function getUserFullAddress(user: User): string;
