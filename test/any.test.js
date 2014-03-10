/*!
 * co-any - test/any.test.js
 * Copyright(c) 2014 dead_horse <dead_horse@qq.com>
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 */

var co = require('co');
var any = require('..');
var wait = require('co-wait');
var should = require('should');

describe('co-any', function () {
  describe('generator and generatorFunction', function () {
    it('should run ok', co(function *() {
      var res = yield any([gen1(), gen2]);
      res.should.eql({_key: 0, value: 1});
    }));

    it('should error ok', co(function *() {
      try {
        var res = yield any({
          normal: gen2,
          error: genError()
        });
        should(false).to.be.ok; // wont exec
      } catch (err) {
        err.message.should.equal('mock error');
        err._key.should.eql('error');
      }
    }));
  });

  describe('thunk and promise', function () {
    it('should run ok', co(function *() {
      var res = yield any([thunk(), promise()]);
      res.should.eql({_key: 1, value: 'promise'});
    }));

    it('should error ok', co(function *() {
      try {
        var res = yield any({
          normal: thunk(),
          error: promiseError()
        });
        should(false).to.be.ok; // wont exec
      } catch (err) {
        err.message.should.equal('mock error');
        err._key.should.eql('error');
      }
    }));
  });

  describe('empty', function () {
    it('should any empty to null', co(function *() {
      should.not.exist(yield any([]));
    }));
  });

  describe('invalid', function () {
    it('should catch invalid error', co(function *() {
      try {
        yield any([1, 2]);
        should(false).to.be.ok; // wont exec
      } catch (err) {
        err.message.should.equal('co.any accept only generator, generatorFunction, thunk, promise');
      }
    }));
  });

  describe('context', function () {
    it('should work with context', co(function *() {
      var res = yield any.call({a: 3}, gen1, genContext);
    }));
  });
});


function *gen1() {
  yield wait(100);
  return 1;
}

function *gen2() {
  yield wait(200);
  return 2;
}

function *genError() {
  yield wait(100);
  throw new Error('mock error');
}

function *genContext() {
  yield wait(50);
  return this.a;
}

function thunk() {
  return function (done) {
    setTimeout(function () {
      done(null, 'thunk');
    }, 200);
  }
}

function promise() {
  return {
    then: function (sucess, fail) {
      setTimeout(function () {
        sucess('promise');
      }, 100);
    }
  }
}

function promiseError() {
  return {
    then: function (sucess, fail) {
      setTimeout(function () {
        fail(new Error('mock error'));
      }, 100);
    }
  }
}
