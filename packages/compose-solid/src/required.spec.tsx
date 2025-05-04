import { render } from "@solidjs/testing-library"
import { describe, test, expect, expectTypeOf } from "vitest"
import { tag } from "./tag.js"
import { required } from "./required.js"
import { ComposedPolymorphicComponent } from "./types.js"

describe("required", () => {
  test("should turn a partial prop into a required prop", () => {
    const First = tag("a")
    const Second = required(First, ["href"])

    let result

    //@ts-expect-error
    result = render(() => <Second />)

    result = render(() => <Second href="" />)
  })

  test.todo("should turn a required prop into a required prop")
})
