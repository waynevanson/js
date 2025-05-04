import { render } from "@solidjs/testing-library"
import { describe, test } from "vitest"
import { partial } from "./partial.js"
import { required } from "./required.js"
import { tag } from "./tag.js"

describe("partial", () => {
  test("should turn a required prop into a partial prop", () => {
    const First = tag("a")
    const Second = required(First, ["href"])
    const Third = partial(Second, { href: "/sds" })
    render(() => <Third />)
  })

  test("should turn a partial prop into a partial prop", () => {
    const First = tag("a")
    const Third = partial(First, { href: "" })

    render(() => <Third />)
  })
})
