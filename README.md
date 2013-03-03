RxJS-Touch
==========

Unified, cross-browser, cross-device, pointer/touch/mouse events as observable sequences.

Events
------

**Multi-Tap**
```javascript
$('body').tapAsObservable().subscribe(function(group) {
  group.toArray().subscribe(function(es) {
    var numTaps = es.length;
    var pageX = es.reduce(0, function(pageX, e) { return pageX + e.pageX; }) / numTaps;
    var pageY = es.reduce(0, function(pageY, e) { return pageY + e.pageY; }) / numTaps;
    console.log('tap', pageX, pageY, numTaps);
  });
});
```

**Moves**

You can think of these as individual drags of your pointer.

Each one is an observable which yields the events it is comprised of.

Keep in mind that the first and last event of a group may be the same event.

```javascript
$('body').movesAsObservable().subscribe(function(group) {
  
  group.take(1).subscribe(function (e) {
    console.log('start', e.pageX, e.pageY, e.deltaX, e.deltaY);
  });
  
  group.takeLast(1).subscribe(function (e) {
    console.log('end', e.pageX, e.pageY, e.deltaX, e.deltaY);
  });
  
  group.subscribe(function(e) {
    console.log('move', e.pageX, e.pageY, e.deltaX, e.deltaY);
  });
});
```

**Down**
```javascript
$('body').downAsObservable().subscribe(function(e) {
  console.log('down', e.pageX, e.pageY);
});
```

**Up**
```javascript
$('body').upAsObservable().subscribe(function(e) {
  console.log('up', e.pageX, e.pageY);
});
```
