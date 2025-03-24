import { describe, test, expect, expectTypeOf } from "vitest"
import { contramap } from "./contramap.js"
import { tag } from "./tag.js"
import { render } from "@solidjs/testing-library"
import {
  ComposedPolymorphicComponent,
  ComposedPolymorphicProps,
} from "./types.js"

describe("contramap", () => {
  test("should allow function identity", () => {
    const First = tag("a")
    const Second = contramap(First, (next) => next)
    const screen = render(() => <Second href="/hello/world" />)
    const link = () => screen.getByRole("link") as HTMLAnchorElement
    expect(link().attributes.getNamedItem("href")?.value).toBe("/hello/world")
  })

  test("should show no change in type", () => {
    const First = tag("a")
    const Second = contramap(First, (next) => next)
    expectTypeOf(First).toEqualTypeOf(Second)
  })

  test("should allow change of input type", () => {
    const First = tag("a")
    const Second = contramap(
      First,
      (next: ComposedPolymorphicProps<"a", { chair: string }>) => next,
    )
    expectTypeOf(Second).toEqualTypeOf<
      ComposedPolymorphicComponent<"a", { chair: string }>
    >()
  })
})
