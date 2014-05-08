/*jshint expr:true */

'use strict';

var fs = require('fs');
var forEach = require('..');
var Q = require('q');

describe('co-foreach', function () {

  var files;

  beforeEach(function () {
    files = ['./test/test1.txt', './test/test2.txt'];
  });

  it('should return promise when running generator callback', function * () {
    var promise = forEach(files, function (file) {});

    promise.should.have.property('then');
  });

  it('should return promise when running normal callback', function () {
    var promise = forEach(files, function (file) {});

    promise.should.have.property('then');
  });

  it('should be able to accept generator as forEach callback', function (done) {
    files.length.should.be.exactly(2);
    var foundCount = 0;

    forEach(files, function * (file) {
      (files.indexOf(file) !== -1).should.be.ok;

      var content = yield Q.nfcall(fs.readFile, file);

      content.should.be.ok;
      content.toString().should.be.ok;

      var index = files.indexOf(file);
      foundCount = index !== -1 ? foundCount++ : foundCount;
    }).then(function () {
      files.length.should.be.exactly(files.length);
      done();
    }, done).done();
  });

  it('should be able to work if passed array is empty', function (done) {
    files = [];

    forEach(files, function * (file) {
      done('Should not go inside forEach callback!');
    }).then(function () {
      done();
    }, done).done();
  });

  it('should return error if first argument is not an array', function (done) {
    files = 123;

    forEach(files, function (file) {
      done('Expected error!');
    }).then(function () {
      done('Expected error');
    }, function (err) {
      err.should.be.exactly('co-foreach accepts array as first argument!');
      done();
    });
  });

  it('should work even is normal callback is provided', function (done) {
    forEach(files, function (file) {
      (files.indexOf(file) !== -1).should.be.ok;
      file.should.be.ok;
    }).then(function () {
      done();
    }, done).done();
  });
});
