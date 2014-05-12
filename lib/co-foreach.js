/*jshint loopfunc: true */

'use strict';

var co = require('co');
var Q = require('q');
var assert = require('assert');

/**
 * Function for calling generator function with passed callback argument
 *
 * @param {GeneratorFunction} fn
 * @returns {GeneratorFunction}
 *
 * @api private
 */

function prepare(fn) {
  var args = Array.prototype.slice.call(arguments, 1);
  return function * () {
    return yield fn.apply(this, args);
  };
}

/**
 * Checking if function is GeneratorFunction
 *
 * @returns {Boolean}
 *
 * @api private
 */

function isGenerator(fn) {
  return fn && fn.constructor && fn.constructor.name === 'GeneratorFunction';
}

/**
 * Simulating native forEach
 *
 * @api private
 */

function forEach(array, cb) {
  for (var i = 0; i < array.length; ++i) {
    cb(array[i]);
  }
}

/**
 * Main function.
 *
 * @param {Array} array array of values to iterate
 * @param {Function|GeneratorFunction} cb callback which will be called on each array value
 * @returns {Promise}
 *
 * @api public
 */

module.exports = function(array, cb) {
  if (!Array.isArray(array)) {
    return Q.reject(new (assert.AssertionError)
    	({
    		message: 'co-foreach only accepts array as first argument!',
    		stackStartFunction: module.exports
    	}));
  }

  var len = array.length;
  if (len === 0) {
    return new Q();
  }

  if (!isGenerator(cb)) {
    return new Q(forEach(array, cb));
  }

  var deferred = Q.defer();

  forEach(array, function(item) {
    var alias = prepare(cb, item);

    co(alias)(function(err, res) {
      if (err) {
        return deferred.reject(err);
      }

      len--;
      if (len === 0) {
        return deferred.resolve();
      }
    });
  });

  return deferred.promise;
};
