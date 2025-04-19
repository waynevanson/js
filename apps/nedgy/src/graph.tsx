// in a grid, dots on a screen with edges runnin in between.
// drag and drop the nodes

// for now just do top left and we can think about layout later?
// well how to calculate nodes to connect the least?

// nodes with the most edges are in the middle, with less on the outsides.
// so figure out how many connecttions (degree) there is and put highest in the center.
import { createElementSize } from "@solid-primitives/resize-observer"
import { createMemo, For } from "solid-js"
import { Id } from "./types"

const EDGE_DISTANCE = 50

export interface GraphProps {
  nodes: Record<Id, Id>
  edges: Record<Id, Record<Id, Array<Id>>>
}

export function Graph(props: GraphProps) {
  let ref: undefined | SVGSVGElement

  const size = createElementSize(() => ref)

  const useableSize = createMemo(() => {
    if (size.height === null || size.width === null) return null

    const x = fit(size.width, EDGE_DISTANCE)
    const y = fit(size.height, EDGE_DISTANCE)

    return { x, y }
  })

  const degrees = createMemo(() => {
    const degrees = {} as Record<Id, number>

    for (const sourceId in props.nodes) {
      degrees[sourceId] = 0
    }

    for (const sourceId in props.nodes) {
      for (const targetId in props.edges[sourceId]) {
        degrees[sourceId]++
        degrees[targetId]++
      }
    }

    return degrees
  })

  const nodes = createMemo(() =>
    Object.entries(props.nodes).sort(
      ([left], [right]) => degrees()[right] - degrees()[left],
    ),
  )

  function take<T>(iterator: IterableIterator<T>, count: number): Array<T> {
    return Array.from({ length: count }, () => iterator.next().value)
  }

  const coords = createMemo(() => {
    const sized = useableSize()
    if (sized === null) return null

    const x = sized.x / 2
    const y = sized.y / 2

    console.log({ sized, x, y })
    return take(spiral(sized), nodes().length).map((coord, index) => ({
      cx: coord.x * EDGE_DISTANCE + x,
      cy: -coord.y * EDGE_DISTANCE + y,
      nodeId: nodes()[index][0],
    }))
  })

  return (
    <svg
      ref={ref}
      width="30rem"
      height="30rem"
      viewBox={`0 0 ${size.width ?? 0} ${size.height ?? 0}`}
    >
      <g>
        <For each={coords()}>
          {(node) => (
            <g>
              <circle r={10} cx={node.cx} cy={node.cy} fill="#aaa" />
              <text x={node.cx} y={node.cy}>
                {node.nodeId.slice(-3)}
              </text>
            </g>
          )}
        </For>
      </g>
    </svg>
  )
}

type Coordinate = Record<"x" | "y", number>

function createStep(ratio: Coordinate): Coordinate {
  if (ratio.x < ratio.y) {
    return { x: 1, y: ratio.x / ratio.y }
  } else {
    return { x: ratio.y / ratio.x, y: 1 }
  }
}

/**
 * @summary
 * Creates an iterator of `(x, y)` coordinates that start at 0,
 * spiralling out infinitely.
 *
 * @param ratio Coordinates that indicate the relaitonships between width and height.
 */
export function* spiral(ratio: Coordinate): Generator<Coordinate> {
  // origin
  yield { x: 0, y: 0 }

  let xCurrent = 0
  let yCurrent = 0

  const { x: xStep, y: yStep } = createStep(ratio)

  // ring
  while (true) {
    const x = xCurrent
    const y = yCurrent

    xCurrent += xStep
    yCurrent += yStep

    const xDo = xStep === 1 || Math.floor(xCurrent) - Math.floor(x) !== 0
    const yDo = yStep === 1 || Math.floor(yCurrent) - Math.floor(y) !== 0

    const xmax = Math.floor(xCurrent)
    const ymax = Math.floor(yCurrent)

    let tr = false
    let tl = false
    let bl = false
    let br = false

    // mid right to top right
    if (yDo) {
      const x = xmax
      for (let y = 0; y <= ymax; y++) {
        yield { x, y }
      }
      tr = true
    }

    // top right to top left
    if (xDo) {
      const offset = tr ? 1 : 0
      const y = ymax
      for (let x = xmax - offset; x >= -xmax; x--) {
        yield { x, y }
      }
      tl = true
    }

    // top left to bot right
    if (yDo) {
      const offset = tl ? 1 : 0
      const x = -xmax
      for (let y = ymax - offset; y >= -ymax; y--) {
        yield { x, y }
      }
      bl = true
    }

    // bot left to bot right
    if (xDo) {
      const offset = bl ? 1 : 0
      const y = -ymax
      for (let x = -xmax + offset; x <= xmax; x++) {
        yield { x, y }
      }
      br = true
    }

    // bot right to mid right
    if (yDo) {
      const offset = br ? 1 : 0
      const x = xmax
      for (let y = -xmax + offset; y < 0; y++) {
        yield { x, y }
      }
    }
  }
}

function fit(length: number, gap: number): number {
  return length - (length % gap)
}

// |0,0|
// |1,0|1,-1|0,-1|-1,-1|-1,0|-1,1|0,1|1,1| right first
// |2|

// 0, 1, 2, 3, 4
// 1, 3, 5, 7, 9
// 1, 8,16,24,36
// 1, 9,
