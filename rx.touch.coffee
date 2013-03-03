do ($ = jQuery) ->

  Rx.Observable.prototype.normalizeTouch = (preventDefault) ->
    this
      .doAction((e) -> e.preventDefault() if preventDefault)
      .selectMany((e) ->
        Rx.Observable.fromArray(e.originalEvent.changedTouches)
          .select (touch) -> touch
      )

  Rx.Observable.prototype.normalizeMouse = (preventDefault) ->
    this
      .doAction((e) -> e.preventDefault() if preventDefault)

  $.fn.upAsObservable = (preventDefault = true) ->
    target = $ @

    Rx.Observable.amb(
      target.onAsObservable('touchend').normalizeTouch(preventDefault)
      target.onAsObservable('mouseup').normalizeMouse(preventDefault)
    )

  $.fn.downAsObservable = (preventDefault = true) ->
    target = $ @

    Rx.Observable.amb(
      target.onAsObservable('touchstart').normalizeTouch(preventDefault)
      target.onAsObservable('mousedown').normalizeMouse(preventDefault)
    )

  context = $ document

  $.fn.movesAsObservable = (preventDefault = true) ->
    target = $(@)

    up = context.upAsObservable(preventDefault)

    down = target.downAsObservable(preventDefault)
 
    move = Rx.Observable.amb(
      context.onAsObservable('touchmove').normalizeTouch(preventDefault)
      down.selectMany ->
        context.onAsObservable('mousemove').normalizeMouse(preventDefault)
          .takeUntil(up)
    )

    move.groupByUntil(
        (e) -> e.identifier
        (e) -> e
        (group) -> up.where (e) -> e.identifier is group.key
        (key) -> key
      )

  $.fn.tapAsObservable = (preventDefault = true, radius = 50) ->

    target = $ @

    gestures = []

    inPageRange = (e1, e2, r) ->
      (
        Math.pow(e2.pageX - e1.pageX, 2) +
        Math.pow(e2.pageY - e1.pageY, 2)
      ) < r * r

    Rx.Observable.createWithDisposable (o) ->

      groups = target.downAsObservable(preventDefault)
        .groupByUntil(
          (e) ->
            return g for g in gestures when inPageRange e, g, radius
            return e
          (x) -> x
          (x) -> x.throttle(350).take 1
          (e) -> e.pageX + ":" + e.pageY
        )

      groups.subscribe (group) ->
        o.onNext group
        group.take(1).subscribe (e) ->
          gestures.push e
          group.takeLast(1).subscribe ->
            index = gestures.indexOf(e)
            gestures.splice index, 1