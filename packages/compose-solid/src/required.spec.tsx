import { render } from "@solidjs/testing-library"
import { describe, test } from "vitest"
import { required } from "./required.js"
import { tag } from "./tag.js"

describe("required", () => {
  test("should turn a partial prop into a required prop", () => {
    const First = tag("a")
    const Second = required(First, ["href"])

    //@ts-expect-error assertion
    render(() => <Second />)

    render(() => <Second href="" />)
  })

  test("should turn a required prop into a required prop", () => {
    throw new Error("")
  })
})
