import { JSX, splitProps } from "solid-js"
import { createDynamic } from "solid-js/web"
import type { TagKind, ComposedComponent } from "./types.js"

export function tag<Tag extends TagKind>(
  tag: Tag
): ComposedComponent<Tag, JSX.IntrinsicElements[Tag]> {
  return function PolymorphicTagComponent(props: any) {
    const [, rest] = splitProps(props, ["as"])
    return createDynamic(() => props.as || tag, rest)
  }
}
