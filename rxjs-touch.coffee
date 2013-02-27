$.fn.tapAsObservable = (radius = 50) ->

  Rx.Observable.create (o) ->

    gestures = []

    inPageRange = (e1, e2, r) ->
      (
        Math.pow(e2.pageX - e1.pageX, 2) +
        Math.pow(e2.pageY - e1.pageY, 2)
      ) < r * r

    groups = $(this).onAsObservable("touchstart")
      .doAction((e)-> e.preventDefault())
      .selectMany((e) ->
        Rx.Observable.fromArray e.originalEvent.changedTouches
      )
      .select((e) ->
        console.log e
        pageX: e.pageX
        pageY: e.pageY
      )
      .groupByUntil(
        (e) ->
          return g for g in gestures when inPageRange e, g, radius
          return e
        (x) -> x
        (x) -> x.throttle(250).take 1
        (e) -> e.pageX + ":" + e.pageY
      )

    groups.subscribe (group) ->
      o.onNext group
      group.take(1).subscribe (e) ->
        gestures.push e
        group.takeLast(1).subscribe ->
          index = gestures.indexOf(e)
          gestures.splice index, 1