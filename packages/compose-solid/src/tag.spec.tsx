import { ComposedPolymorphicComponent, tag, TagKind } from "./index.jsx"
import { describe, test, expect, expectTypeOf } from "vitest"
import { DOMElements } from "solid-js/web"
import { render } from "@solidjs/testing-library"

describe("tag", () => {
  test("should create a component with the type sof that tag", () => {
    const Component = tag("a")
    expectTypeOf(Component).toEqualTypeOf<
      ComposedPolymorphicComponent<"a", object>
    >()
  })

  const tags = Array.from(DOMElements.values()) as Array<TagKind>

  test.each(tags)(
    "should render component with the same tag name for %s",
    (tagName) => {
      const Component = tag(tagName)
      const screen = render(() => <Component />)
      expect(screen.container.children.item(0)?.localName).toBe(tagName)
    },
  )
})
