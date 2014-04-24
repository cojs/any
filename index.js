/*!
 * any - index.js
 * Copyright(c) 2014 dead_horse <dead_horse@qq.com>
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 */

var toThunk = require('back-to-thunk');

/**
 * slice() reference.
 */

var slice = Array.prototype.slice;

/**
 * Expose `any`
 */

module.exports = any;

/**
 * Execute thunks in parallel and return after any of them return
 * support
 *   any(f1, f2, f3)
 *   any([f1, f2, f3])
 * @return {Thunk}
 * @api public
 */

function any(obj) {
  var ctx = this;

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
        if (typeof fn !== 'function') {
          done(new Error('co.any only accept yieldables'));
        }
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
