co-foreach
==========

Run generator function in each forEach loop callback for each element in array

### Installation

```
npm install co-foreach
```

### Example

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
  // success after all generator functions are finished
}, function (err) {
  // handle error
});
```

# License
**MIT**
