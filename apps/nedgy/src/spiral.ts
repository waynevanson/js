// apply a change, change directions 4 times, then go outside
export function* spiral() {
  yield { x: 0, y: 0 }

  let x = 1,
    y = 0,
    // -1,0,1
    dx = 0,
    // -1,0,1
    dy = 1,
    stepsMax = 2,
    stepsTaken = x,
    // 0,1,2,3,4
    directionsChanged = 0

  yield { x, y }

  // step
  while (true) {
    x += dx
    y += dy
    stepsTaken++

    yield { x, y }

    // change directions
    if (stepsTaken === stepsMax) {
      ;[dx, dy] = [-dy, dx]
      stepsTaken = 0
      directionsChanged++
    }

    // go to next ring
    if (directionsChanged === 4 && y === 0) {
      directionsChanged = 0
      stepsMax += 2
      x++
      stepsTaken = x
    }
  }
}
