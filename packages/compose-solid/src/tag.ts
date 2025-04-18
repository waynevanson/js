import { splitProps } from "solid-js"
import { createDynamic } from "solid-js/web"
import type { TagKind, ComposedPolymorphicComponent } from "./types.js"

// Creates a component for a normal eelement,
// that binds `as` property to the target.
export function tag<Tag extends TagKind>(
  tag: Tag,
): ComposedPolymorphicComponent<Tag, {}> {
  return function PolymorphicTagComponent(props: any) {
    const [, rest] = splitProps(props, ["as"])
    return createDynamic(() => props.as || tag, rest)
  }
}
