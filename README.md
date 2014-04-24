co-any
======

[![Build Status](https://travis-ci.org/cojs/any.svg)](https://travis-ci.org/cojs/any)

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
// or
yield any({
  first: wait(200),
  second: wait(100)
});
```
also you can pass `thunk`, `generatorFunction` and `promise` into any.

=>

```
{
  _key: 'key',
  value: 'value'
}
```

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
