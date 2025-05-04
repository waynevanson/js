import { describe, expect, it } from "vitest"
import { spiral } from "./spiral"

describe(spiral, () => {
  it("should work", () => {
    const result = take(spiral(), 9)
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

function take<T>(iterator: IterableIterator<T>, count: number): Array<T> {
  return Array.from({ length: count }, () => iterator.next().value)
}
