/*jshint loopfunc: true */

'use strict';

var co = require('co');
var bluebird = require('bluebird');

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
  return function* () {
    return yield fn.apply(this, args);
  };
}

function isFunction(fn) {
  return typeof fn === 'function';
}

function isGenerator(fn) {
  return fn && isFunction(fn) && fn.constructor && fn.constructor.name === 'GeneratorFunction';
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
  return new bluebird(function (resolve, reject) {
    if (!Array.isArray(array)) {
      return reject('co-foreach accepts array as first argument!');
    }

    if (!isFunction(cb)) {
      return reject('co-foreach accepts function as second argument!');
    }

    if (!isGenerator(cb)) {
      return resolve(array.forEach.call(array, cb));
    }

    var len = array.length;
    if (len === 0) {
      return resolve();
    }

    for (var i = 0; i < array.length; ++i) {
      var alias = prepare(cb, array[i], i);

      co(alias).then(function () {
        if (--len === 0) {
          return resolve();
        }
      }).catch(function (err) {
        return reject(err);
      });
    }
  });
};
