
var wait = require('co-wait');
var co = require('co');
var any = require('./');

co(function *() {
  console.time('any');
  yield any([wait(200), wait(100), wait(300)]);
  console.timeEnd('any');
})();
