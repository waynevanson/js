import {
  ComposedPolymorphicComponent,
  ComposedPolymorphicProps,
  PropsKind,
  TagKind,
} from "./types.js"
import { createComponent, mergeProps, splitProps } from "solid-js"

/**
 * @summary
 * Creates a new component where the default element tag is changed.
 * @param component The target component
 * @param as The tag to use for the component
 * @returns A new polymorphic component.
 *
 * @example
 * import { tag, as } from "@waynevanson/compose-solid"
 *
 * const First = tag('a')
 * const Second = as(First, 'button')
 */
export function as<
  TagPrev extends TagKind,
  OuterProps extends PropsKind,
  As extends TagKind,
>(
  component: ComposedPolymorphicComponent<TagPrev, OuterProps>,
  as: As,
): ComposedPolymorphicComponent<As, OuterProps> {
  return function ComposedAsComponent(
    props: ComposedPolymorphicProps<As, OuterProps>,
  ) {
    const [, rest] = splitProps(props, ["as"])
    const next = mergeProps(rest, {
      get as() {
        return props.as || as
      },
    })
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    return createComponent(component, next)
  }
}
