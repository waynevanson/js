import { StringReplaceTranformStream } from "./index.js"
import { describe, expect } from "vitest"
import { test, fc } from "@fast-check/vitest"

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

  // search string broken up across many chunks
})

// how to create the sections?
function createChunksStringProp(search: string, sections: Array<number>) {}
