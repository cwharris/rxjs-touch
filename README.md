RxJS-Touch
==========

RxJS based gesture events

```javascript
$('body').tapAsObservable().subscribe(function(group) {
  group.toArray().subscribe(function(es) {
    var numTaps = es.length;
    var pageX = es.reduce(0, function(a, b) { a + b.pageX }) / numTaps;
    var pageY = es.reduce(0, function(a, b) { a + b.pageY }) / numTaps;
    console.log(pageX, pageY, numTaps);
  });
});
```
