import { splitProps } from "solid-js"
import {
  TagKind,
  PolymorphicComponent,
  PolymorphicComponentProps,
} from "./types"

export function tag<Tag extends TagKind>(
  tag: Tag
): PolymorphicComponent<Tag, {}> {
  return function PolymorphicTagComponent<As extends TagKind = Tag>(
    props: PolymorphicComponentProps<As, {}>
  ) {
    const [, rest] = splitProps(props, ["as"])
    //@ts-ignore
    return createDynamic(() => props.as || tag, rest)
  }
}
