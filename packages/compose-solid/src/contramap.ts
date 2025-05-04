import type {
  ComposedPolymorphicComponent,
  ComposedPolymorphicProps,
  OuterPropsKind,
  TagKind,
} from "./types.js"
import { createComponent, createMemo } from "solid-js"

/**
 * @summary
 * Changes the interface of a component, by providing a "reverse map" function
 * to change the props.
 *
 * @param component
 * @param fn
 * @returns
 *
 * @example
 * import { tag, contramap } from "@waynevanson/compose-solid"
 *
 * const Link = tag("a")
 * const Prefixed = contramap(Link, (props) =>  ({
 *   ...props,
 *   href: "/posts/" + props.href
 * }))
 */
export function contramap<
  Tag extends TagKind,
  PrevOuterProps extends OuterPropsKind,
  NextOuterProps extends OuterPropsKind = PrevOuterProps,
  As extends TagKind = Tag,
>(
  component: ComposedPolymorphicComponent<Tag, PrevOuterProps>,
  fn: (
    next: ComposedPolymorphicProps<As, NextOuterProps>,
  ) => ComposedPolymorphicProps<Tag, PrevOuterProps>,
): ComposedPolymorphicComponent<As, NextOuterProps> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function PolymorphicContramapComponent(next: any) {
    const props = createMemo(() => fn(next))
    return createComponent(component as never, props())
  }
}
