import { describe, test, expect } from "vitest"
import { spiral } from "./graph"

function take<T>(iterator: IterableIterator<T>, count: number): Array<T> {
  return Array.from({ length: count }, () => iterator.next().value)
}

describe(spiral.name, () => {
  test("origin", () => {
    const result = take(spiral({ x: 1, y: 1 }), 1)
    const expected: Array<Record<"x" | "y", number>> = [{ x: 0, y: 0 }]
    expect(result).toStrictEqual(expected)
  })

  test.only("square", () => {
    const result = take(spiral({ x: 1, y: 1 }), 9)
    const expected: Array<Record<"x" | "y", number>> = [
      { x: 0, y: 0 },

      { x: 1, y: 0 },
      { x: 1, y: 1 },

      { x: 0, y: 1 },
      { x: -1, y: 1 },

      { x: -1, y: 0 },
      { x: -1, y: -1 },

      { x: 0, y: -1 },
      { x: 1, y: -1 },
    ]
    expect(result).toStrictEqual(expected)
  })
})
