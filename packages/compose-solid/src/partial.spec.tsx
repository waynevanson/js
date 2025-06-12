import { render } from "@solidjs/testing-library"
import { describe, expect, test } from "vitest"
import { partial } from "./partial.js"
import { required } from "./required.js"
import { tag } from "./tag.js"

describe("partial", () => {
  test("should turn a required prop into a partial prop", () => {
    const href = "/hello/world"
    const First = tag("a")
    const Second = required(First, ["href"])
    const Third = partial(Second, { href })
    const screen = render(() => <Third />)

    const element = () => screen.container.children.item(0)

    expect(element()?.getAttribute("href")).toBe(href)
  })

  test("should turn a partial prop into a partial prop", () => {
    const First = tag("a")
    const Third = partial(First, { href: "" })

    const screen = render(() => <Third />)
    const element = () => screen.container.children.item(0)

    expect(element()?.hasAttribute("href")).toBeTruthy()
  })
})
