import { render } from "@solidjs/testing-library"
import { describe, test, expect } from "vitest"
import { tag } from "./tag.js"
import { partial } from "./partial.js"
import { required } from "./required.js"

describe("partial", () => {
  test("should turn a required prop into a partial prop", () => {
    const First = tag("a")
    const Second = required(First, ["href"])
    const Third = partial(Second, { href: "/sds" })

    const result = render(() => <Third />)
  })

  test("should turn a partial prop into a partial prop", () => {
    const First = tag("a")
    const Third = partial(First, { href: "" })

    const result = render(() => <Third />)
  })
})
