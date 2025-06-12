import { render } from "@solidjs/testing-library"
import { describe, test } from "vitest"
import { required } from "./required.js"
import { tag } from "./tag.js"

describe("required", () => {
  test("should turn a native partial prop into a required prop", () => {
    const First = tag("a")
    const Second = required(First, ["href"])

    //@ts-expect-error assertion
    render(() => <Second />)

    render(() => <Second href="" />)
  })

  test("should allow a required prop to have the value undefined", () => {
    const A = tag("a")
    const Case = required(A, ["href"])

    render(() => <Case href={undefined} />)
  })

  test("should turn a required prop into a required prop", () => {
    // throw new Error("")
  })
})
