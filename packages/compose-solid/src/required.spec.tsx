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

  test("should not allow a required prop to be undefined", () => {
    const A = tag("a")
    const Case = required(A, ["href"])

    //@ts-expect-error assertion
    render(() => <Case href={undefined} />)
  })
})
