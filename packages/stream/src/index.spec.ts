import { describe, expect } from "vitest"
import { fc, test } from "@fast-check/vitest"
import { StringReplaceTranformStream } from "./index.js"

function createInputStream(chunks: Array<string>) {
  return new ReadableStream<string>({
    start(controller) {
      for (const chunk of chunks) {
        controller.enqueue(chunk)
      }
      controller.close()
    },
  })
}

async function bufferToString(
  readable: ReadableStream<string>,
): Promise<string> {
  let buffer = ""

  for await (const value of readable.values()) {
    buffer += value
  }

  return buffer
}

function applyChunksToStream(
  chunks: Array<string>,
  transform: TransformStream<string>,
): Promise<string> {
  return bufferToString(createInputStream(chunks).pipeThrough(transform))
}

describe(StringReplaceTranformStream, () => {
  test("should replace", async () => {
    const search = "hello"
    const replace = "world"
    const stream = new StringReplaceTranformStream(search, replace)

    const input = search
    const result = await applyChunksToStream([input], stream)
    const expected = replace
    expect(result).toBe(expected)
  })

  test("should throw error when the search is empty", async () => {
    const search = ""
    const replace = "world"
    expect(() => new StringReplaceTranformStream(search, replace)).toThrowError(
      `Expected the search to be non empty`,
    )
  })

  const prop = fc
    .string({ minLength: 1 })
    .chain((string) =>
      fc.record({
        search: fc.constant(string),
        sizes: countdown(string.length),
      }),
    )
    .map(({ sizes, search }) => ({
      search,
      chunks: createChunksStringProp(search, sizes),
    }))

  test.prop([prop], { verbose: true })("proppy", async ({ chunks, search }) => {
    const replace = search
    const stream = new StringReplaceTranformStream(search, replace)

    const result = await applyChunksToStream(chunks, stream)
    const expected = replace
    expect(result).toBe(expected)
  })

  // search string broken up across many chunks
})

// recursive arbitrary calls

const bound = (max: number) => fc.integer({ min: 1, max })

// create f uct
function countdown(max: number): fc.Arbitrary<Array<number>> {
  return bound(max)
    .map((value) => ({ remaining: max - value, array: [value] }))
    .chain(({ remaining, array }) =>
      remaining <= 0
        ? fc.constant(array)
        : countdown(remaining).map((right) => array.concat(right)),
    )
}

// how to create the sections?
function createChunksStringProp(
  search: string,
  sizes: Array<number>,
): Array<string> {
  if (search.length === 0) {
    throw new Error("Expected search length to be greater than 0")
  }

  const nonPositives = sizes
    .map((size, index) => ({ size, index }))
    .filter(({ size }) => size <= 0)

  if (nonPositives.length > 0) {
    throw new Error("Expected sizes to be only positive values")
  }

  const chunks = sizes.map((size, index) => search.slice(index, index + size))

  return chunks
}
