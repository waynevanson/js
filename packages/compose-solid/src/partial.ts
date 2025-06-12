import {
  ComposedMonomorphicProps,
  ComposedPolymorphicComponent,
  OuterPropsKind,
  Substitute,
  TagKind,
} from "./types.js"
import { createComponent, mergeProps } from "solid-js"

/**
 * @summary
 * Apply default values to existing properties.
 */
export function partial<
  Tag extends TagKind,
  OuterPropsPrev extends OuterPropsKind,
  Partials extends ComposedMonomorphicProps<Tag, OuterPropsPrev>,
>(
  Component: ComposedPolymorphicComponent<Tag, OuterPropsPrev>,
  partials: Partials,
): ComposedPolymorphicComponent<
  Tag,
  Substitute<OuterPropsPrev, Partial<Partials>>
> {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function ComposedPartialComponent(props: any) {
    const next = mergeProps(partials, props)
    return createComponent(Component, next as never)
  }
}
