import { describe, test, expect } from "vitest"
import { contramap } from "./contramap.js"
import { tag } from "./tag.js"
import { render } from "@solidjs/testing-library"

describe("contramap", () => {
  test("should allow function identity", () => {
    const First = tag("a")
    const Second = contramap(First, (next) => next)
    const screen = render(() => <Second href="/hello/world" />)
    const link = () => screen.getByRole("link") as HTMLAnchorElement
    expect(link().attributes.getNamedItem("href")?.value).toBe("/hello/world")
  })
})
