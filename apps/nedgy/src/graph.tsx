// in a grid, dots on a screen with edges runnin in between.
// drag and drop the nodes

// for now just do top left and we can think about layout later?
// well how to calculate nodes to connect the least?

// nodes with the most edges are in the middle, with less on the outsides.
// so figure out how many connecttions (degree) there is and put highest in the center.
import { createElementSize } from "@solid-primitives/resize-observer"
import { createMemo, For } from "solid-js"
import { Id } from "./types"

const EDGE_DISTANCE = 100

export interface GraphProps {
  nodes: Record<Id, Id>
  edges: Record<Id, Record<Id, Id>>
}

export function Graph(props: GraphProps) {
  let ref: undefined | HTMLElement

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
    Object.keys(props.nodes).sort(
      (left, right) => degrees()[right] - degrees()[left],
    ),
  )

  function take<T>(iterator: IterableIterator<T>, count: number): Array<T> {
    return Array.from({ length: count }, () => iterator.next().value)
  }

  const coords = createMemo(() =>
    take(spiral(useableSize() ?? { x: 1, y: 1 }), nodes.length).map(
      (coord, index) => ({
        ...coord,
        nodeId: nodes()[index],
      }),
    ),
  )

  // todo: put in a screen buffer thing

  // todo: put nodes on screen

  return (
    <article ref={ref}>
      <g>
        <For each={coords()}>
          {(node) => (
            <circle r={5} cx={node.x} cy={node.y}>
              <text>{node.nodeId}</text>
            </circle>
          )}
        </For>
      </g>
    </article>
  )
}

type Coordinate = Record<"x" | "y", number>

// start at radians 0
/**
 * @summary
 * Creates an iterator of `(x, y)` coordinates that start at 0,
 * spiralling out infinitely.
 *
 * @param ratio Coordinates that indicate the relaitonships between width and height.
 */
export function* spiral(ratio: Coordinate): Generator<Coordinate> {
  yield { x: 0, y: 0 }

  for (let ring = 1; true; ring++) {
    const total = Math.ceil((ratio.x / ratio.y) * ring * 8)

    let x = 0
    let y = 1

    for (let index = -total; index < total; index++) {
      // todo: how to know if I should use left or right?
      yield { x, y }
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
