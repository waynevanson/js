import { describe, expect, test } from "vitest"
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

  test.each([1, 2, 3, 4, 5, 100000])("square with width/height of %d", (n) => {
    const result = take(spiral({ x: n, y: n }), 9)
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

  test.skip("rectangle twice as wide", () => {
    const result = take(spiral({ x: 2, y: 1 }), 3)
    const expected: Array<Record<"x" | "y", number>> = [
      { x: 0, y: 0 },

      { x: 1, y: 0 },
      { x: 1, y: -1 },
    ]
    expect(result).toStrictEqual(expected)
  })
})
