co-any [![Build Status](https://travis-ci.org/dead-horse/co-any.png)](https://travis-ci.org/dead-horse/co-any)
======

Execute thunks in parallel and return after any of them return

## Install

```
npm install co-any
```

## Usage

```
var wait = require('co-wait');
var generators = [wait(200), wait(100), wait(300)];

yield any(generators);
// or
yield any(wait(50), wait(100));
```

also you can pass `thunk`, `generatorFunction` and `promise` into any.

## Example

```js
var wait = require('co-wait');
var co = require('co');
var any = require('co-any');

co(function *() {
  console.time('any');
  yield any(wait(200), wait(100), wait(300));
  console.timeEnd('any'); // should arond 100ms
})();

```
## License
MIT
