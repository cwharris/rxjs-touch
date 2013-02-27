RxJS-Touch
==========

RxJS based gesture events

```javascript

$('body').tapAsObservable().subscribe(function(group) {
  group.toArray().subscribe(function(es) {
    var numTaps = es.length;
    var pageX = es.reduce(0, function(pageX, e) { return pageX + e.pageX; }) / numTaps;
    var pageY = es.reduce(0, function(pageY, e) { return pageY + e.pageY; }) / numTaps;
    console.log(pageX, pageY, numTaps);
  });
});
```
