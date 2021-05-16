# Understanding Promises

This repo serves as an example of various approaches to handling / using Promises. As they continue to confuse people, this attempts to demystify some aspects by being straightforward and obvious. Some of the choices made are dumb for the sake of simplicity and clarity.

## Study

Review `src/components/PriceHistory.vue` starting around the class declaration.

When the component is created, `update()` is called. This kicks of a `setTimeout` loops which executes every `interval` seconds. Within `update`, there are three paths of execution depending on the value of `type`.

- `then`: Uses Promises chaining where each `.then` returns another promise
- `all`: Uses the static Promise method `.all` to execute and wait on several promises at the same time
- `await`: Uses `async` / `await` syntax. Notice the use of `try` / `catch`.

## Requirements
You need a recent version of Node installed and functioning.

While not required, I recommend VS Code for messing with this repo. Linting, formatting, etc. have all been setup and work automatically.

## Setup
```
npm install
```

### Run
```
npm run serve
```
