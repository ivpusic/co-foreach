co-foreach
==========
[![Build Status](https://travis-ci.org/ivpusic/co-foreach.svg?branch=master)](https://travis-ci.org/ivpusic/co-foreach)

Run generator function as forEach loop callback

### Installation

```
npm install co-foreach
```

### Example 1
```Javascript
var forEach = require('co-foreach');

// Every generator callback is wrapped into co function,
// so you can take advantage of all co features
forEach(array, function * (item) {
  // do something awesome with generators
}).then(handleFinish);
```

### Example 2

```Javascript
var forEach = require('co-foreach');
var Q = require('q');
var fs = require('fs');

var files = ['./test/test1.txt', './test/test2.txt'];

// co-foreach is returning promise 
forEach(files, function * (file) {
  var content = yield Q.nfcall(fs.readFile, file);
  // do something usefull
}).then(function () {
  // co-foreach is returning promise which is fulfilled
  // after all generator functions are successfully finished
}, function (err) {
  // handle error
});
```

### Example 3

```Javascript
var forEach = require('co-foreach');

// You can also use co-foreach with normal callbacks
forEach(array, function (item) {
});
```

# License
**MIT**
