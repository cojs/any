/*!
 * co-any - index.js
 * Copyright(c) 2014 dead_horse <dead_horse@qq.com>
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 */

var co = require('co');

/**
 * slice() reference.
 */

var slice = Array.prototype.slice;

module.exports = function (obj) {
  var ctx = this;

  // support
  //  any(fun1, fun2)
  //  any([fun1, fun2])
  if (typeof obj === 'function') {
    obj = slice.call(arguments);
  }

  return function(done) {
    var keys = Object.keys(obj);
    var isArray = Array.isArray(obj);
    var finished;

    function getkey(key) {
      return isArray ? Number(key) : key;
    }

    if (!keys.length) {
      setImmediate(function() {
        done(null, null);
      });
      return;
    }

    for (var i = 0; i < keys.length; i++) {
      run(obj[keys[i]], keys[i]);
    }

    function run(fn, key) {
      if (finished) return;
      try {
        fn = toThunk(fn, ctx);

        fn.call(ctx, function(err, res) {
          if (finished) return;
          finished = true;
          if (err) {
            err._key = getkey(key);
            return done(err);
          }
          done(null, {
            _key: getkey(key),
            value: res
          });
        });
      } catch (err) {
        finished = true;
        err._key = getkey(key);
        done(err);
      }
    }
  }
}

function toThunk(obj, ctx) {
  if (isGeneratorFunction(obj)) {
    return co(obj.call(ctx));
  }

  if (isGenerator(obj)) {
    return co(obj);
  }

  if (isPromise(obj)) {
    return promiseToThunk(obj);
  }

  if ('function' === typeof obj) {
    return obj;
  }
  throw new Error('co.any accept only generator, generatorFunction, thunk, promise');
}

/**
 * Convert `promise` to a thunk.
 *
 * @param {Object} promise
 * @return {Function}
 * @api private
 */

function promiseToThunk(promise) {
  return function(fn){
    promise.then(function(res) {
      fn(null, res);
    }, fn);
  }
}

/**
 * Check if `obj` is a promise.
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api private
 */

function isPromise(obj) {
  return obj && 'function' == typeof obj.then;
}

/**
 * Check if `obj` is a generator.
 *
 * @param {Mixed} obj
 * @return {Boolean}
 * @api private
 */

function isGenerator(obj) {
  return obj && 'function' == typeof obj.next && 'function' == typeof obj.throw;
}

/**
 * Check if `obj` is a generator function.
 *
 * @param {Mixed} obj
 * @return {Boolean}
 * @api private
 */

function isGeneratorFunction(obj) {
  return obj && obj.constructor && 'GeneratorFunction' == obj.constructor.name;
}
