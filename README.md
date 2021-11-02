# learning-fp-ts

## Useful Monad

We won't explain what Monad is here. refer to [Getting started with fp-ts: Monad](https://dev.to/gcanti/getting-started-with-fp-ts-monad-6k) instead.

We know that the functional programming keen to be totality and no side effect. So we need to handle error and sync/async tasks.

### Option

`Option` is one way to handle the data missing. `Option.none` means that no value is present so that you need to deal with it. With `Option`, you could use the value safely by using `O.map` cause the value must be there.

### Either

If `Option` is one way to handle the data missing and ignore the potential bad consequence, the `Either` is trying to catch all possible errors that we should handle. Both business errors and system errors could be caught using Either. `Either` is not only an data type we could use here, but an idea to collect all kinds of the Errors and force the user to handle it.

### IO

`IO` represent that things you need to execute to get the result. We are not going to use it that much cause we have `Task` for async functions and it is used much more frequent than the `IO` in some project. You could use `IO` to build a really functional program but it's not necessary from my point of view.

### Task

`Task` give use the ability to handle the async call in fp way. Since error happens everywhere, so we use `TaskEither` more than `Task`;

### TaskEither

Finally, we have the `TaskEither`, it helps us handle the Errors and async function at the same time, which is perfect. We use it a lot to deal with the api request and database interaction. `TaskEither` is only an `Task` contain an `Either`, so you could use most of the functions defined in `Task` and `Either`.

## Orchestrate the functions

### pipe

Pipe is really useful when you want to do several things for an given input. It similar to the pipeline concept used in linux. So you could use pipe to integrate several functions as you like. The out put of the previous function is the input of the following function. The data goes into the pipe and return the final result.

### flow

Flow is used to create a function by given functions. It's similar to the pipe but no input is given. So it's more like construct the pipeline without an actual input. It's useful when you just want to compose some functions but not ready to use them.

### Do

Since pipe and flow only have one way, we may find it's hard if we want to reuse some result from previous steps. So you may need either extract some of the code to a function which takes the result as input and use it in several places. Or you could use Do to maintain an context which contains all of the values you'd like to use in the flow. You have the do syntax from fp-io as well as Do notation from fp-ts-contrib. You can refer to [Practical Guide to Fp-ts P6: The Do Notation](https://dev.to/ryanleecode/practical-guide-to-fp-ts-p6-the-do-notation-noj) to get more details. We think it's fine to use either way cause it doesn't have much differences for these two options.
