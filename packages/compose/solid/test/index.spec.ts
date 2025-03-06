import { tag, optionals } from "../src/index"
import { describe, test, expect, expectTypeOf } from "vitest"
import { Component, JSX } from "solid-js"

describe("tag", () => {
  test("should create a component with the type sof that tag", () => {
    const Component = tag("a")
    expectTypeOf(Component).toEqualTypeOf<
      <Tag = "a">(
        props: JSX.IntrinsicElements["a"] & { as?: Tag }
      ) => JSX.Element
    >()
  })
})
