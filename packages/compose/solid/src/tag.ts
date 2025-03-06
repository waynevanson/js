import { JSX, splitProps } from "solid-js"
import { TagKind, ComposedComponent } from "./types"

export function tag<Tag extends TagKind>(
  tag: Tag
): ComposedComponent<Tag, JSX.IntrinsicElements[Tag]> {
  return function PolymorphicTagComponent(props) {
    const [, rest] = splitProps(props, ["as"])
    //@ts-expect-error
    return createDynamic(() => props.as || tag, rest)
  }
}
