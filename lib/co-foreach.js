'use strict';

var _ = require('lodash');
var co = require('co');
var Q = require('q');

/**
 * Function for calling generator function with passed callback argument
 *
 * @param {Function} fn function to wrap
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
 * Main function.
 *
 * @param {Array} array array of values to iterate
 * @param {Function|GeneratorFunction} cb callback which will be called on each array value
 * @returns {Promise}
 *
 * @api public
 */

module.exports = function (array, cb) {
  if (!_.isArray(array)) {
    return new Q.reject('co-foreach accepts array as first argument!');
  }

  if (!isGenerator(cb)) {
    return new Q(_.forEach(array, cb));
  }

  var deferred = Q.defer();
  var len = array.length;
  if (len === 0) {
    return new Q();
  }

  _.forEach(array, function (item) {
    var alias = prepare(cb, item);

    co(alias)(function (err, res) {
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
