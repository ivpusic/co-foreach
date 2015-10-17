/*jshint expr:true */
/*jshint noyield:true */
/* globals describe, beforeEach, it */

'use strict';

var fs = require('fs');
var forEach = require('..');
var bluebird = require('bluebird');

function contains(array, obj) {
    for (var i = 0; i < array.length; i++) {
        if (array[i] === obj) {
            return true;
        }
    }
    return false;
}

describe('co-foreach', function () {
  var files;

  beforeEach(function () {
    files = ['./test/test1.txt', './test/test2.txt'];
  });

  it('should return promise when running generator callback', function () {
    var promise = forEach(files, function *() {});

    promise.should.have.property('then');
  });

  it('should return promise when running normal callback', function () {
    var promise = forEach(files, function () {});

    promise.should.have.property('then');
  });

  it('should be able to accept generator as forEach callback', function (done) {
    files.length.should.be.exactly(2);
    var foundCount = 0;

    forEach(files, function * (file) {
      (files.indexOf(file) !== -1).should.be.ok;

      var content = yield bluebird.promisify(fs.readFile)(file);

      content.should.be.ok;
      content.toString().should.be.ok;

      var index = files.indexOf(file);
      foundCount = index !== -1 ? foundCount++ : foundCount;
    }).then(function () {
      files.length.should.be.exactly(files.length);
      done();
    }).catch(done).done();
  });

  it('should be able to work if passed array is empty', function (done) {
    files = [];

    forEach(files, function * () {
      done('Should not go inside forEach callback!');
    }).then(function () {
      done();
    }).catch(done).done();
  });

  it('should return error if first argument is not an array', function (done) {
    files = 123;

    forEach(files, function () {
      done('Expected error!');
    }).then(function () {
      done('Expected error');
    }).catch(function (err) {
      err.should.equal('co-foreach only accepts array as first argument!');
      done();
    });
  });

  it('should work even is normal callback is provided', function (done) {
    forEach(files, function (file) {
      (contains(files, file)).should.be.true;
    }).then(function () {
      done();
    }).catch(done).done();
  });
});
