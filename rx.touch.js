// Generated by CoffeeScript 1.5.0
(function() {

  (function($) {
    var context;
    Rx.Observable.prototype.normalizeTouch = function(preventDefault) {
      return this.doAction(function(e) {
        if (preventDefault) {
          return e.preventDefault();
        }
      }).selectMany(function(e) {
        return Rx.Observable.fromArray(e.originalEvent.changedTouches).select(function(touch) {
          return {
            preventDefault: e.preventDefault.bind(e),
            identifier: touch.identifier,
            pageX: touch.pageX,
            pageY: touch.pageY
          };
        });
      });
    };
    Rx.Observable.prototype.normalizeMouse = function(preventDefault) {
      return this.doAction(function(e) {
        if (preventDefault) {
          return e.preventDefault();
        }
      }).select(function(mouse) {
        return {
          preventDefault: mouse.preventDefault.bind(mouse),
          identifier: 0,
          pageX: mouse.pageX,
          pageY: mouse.pageY
        };
      });
    };
    $.fn.upAsObservable = function(preventDefault) {
      var target;
      if (preventDefault == null) {
        preventDefault = true;
      }
      target = $(this);
      return Rx.Observable.amb(target.onAsObservable('touchend').normalizeTouch(preventDefault), target.onAsObservable('mouseup').normalizeMouse(preventDefault));
    };
    $.fn.downAsObservable = function(preventDefault) {
      var target;
      if (preventDefault == null) {
        preventDefault = true;
      }
      target = $(this);
      return Rx.Observable.amb(target.onAsObservable('touchstart').normalizeTouch(preventDefault), target.onAsObservable('mousedown').normalizeMouse(preventDefault));
    };
    context = $(document);
    $.fn.movesAsObservable = function(preventDefault) {
      var down, move, moves, target, up;
      if (preventDefault == null) {
        preventDefault = true;
      }
      target = $(this);
      up = context.upAsObservable(preventDefault);
      down = target.downAsObservable(preventDefault);
      move = Rx.Observable.amb(context.onAsObservable('touchmove').normalizeTouch(preventDefault), context.onAsObservable('mousemove').normalizeMouse(preventDefault));
      moves = down.selectMany(function(e) {
        return move.where(function(b) {
          return b.identifier === e.identifier;
        }).takeUntil(up.where(function(b) {
          return b.identifier === e.identifier;
        })).startWith(e);
      });
      return moves.groupByUntil(function(e) {
        return e.identifier;
      }, function(e) {
        return e;
      }, function(group) {
        return up.where(function(e) {
          return e.identifier === group.key;
        });
      }, function(key) {
        return key;
      });
    };
    return $.fn.tapAsObservable = function(preventDefault, radius) {
      var gestures, inPageRange, target;
      if (preventDefault == null) {
        preventDefault = true;
      }
      if (radius == null) {
        radius = 50;
      }
      target = $(this);
      gestures = [];
      inPageRange = function(e1, e2, r) {
        return (Math.pow(e2.pageX - e1.pageX, 2) + Math.pow(e2.pageY - e1.pageY, 2)) < r * r;
      };
      return Rx.Observable.createWithDisposable(function(o) {
        var groups;
        groups = target.downAsObservable(preventDefault).groupByUntil(function(e) {
          var g, _i, _len;
          for (_i = 0, _len = gestures.length; _i < _len; _i++) {
            g = gestures[_i];
            if (inPageRange(e, g, radius)) {
              return g;
            }
          }
          return e;
        }, function(x) {
          return x;
        }, function(x) {
          return x.throttle(350).take(1);
        }, function(e) {
          return e.pageX + ":" + e.pageY;
        });
        return groups.subscribe(function(group) {
          o.onNext(group);
          return group.take(1).subscribe(function(e) {
            gestures.push(e);
            return group.takeLast(1).subscribe(function() {
              var index;
              index = gestures.indexOf(e);
              return gestures.splice(index, 1);
            });
          });
        });
      });
    };
  })(jQuery);

}).call(this);
