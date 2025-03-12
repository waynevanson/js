import { createComponent, createMemo, mergeProps, splitProps } from "solid-js"
import { ComposedPolymorphicComponent, PropsKind, TagKind } from "./types.js"

export function as<
  Tag extends TagKind,
  OuterProps extends PropsKind,
  As extends TagKind = Tag,
>(
  component: ComposedPolymorphicComponent<Tag, OuterProps>,
  as: As,
): ComposedPolymorphicComponent<As, OuterProps> {
  return function ComposedAsComponent(props: any) {
    const [, rest] = splitProps(props, ["as"])
    const tag = createMemo(() => props.as || as)
    const next = mergeProps(rest, () => ({ as: tag() }))
    //@ts-expect-error
    return createComponent(component, next)
  }
}
