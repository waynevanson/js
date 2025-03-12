import { StringReplaceTranformStream } from "./index.js"
import { describe, expect, test } from "vitest"

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
})
