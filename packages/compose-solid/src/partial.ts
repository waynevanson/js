import { createComponent, mergeProps } from "solid-js"
import {
  ComposedMonomorphicProps,
  ComposedPolymorphicComponent,
  OuterPropsKind,
  Substitute,
  TagKind,
} from "./types.js"

/**
 * @summary
 * Apply defaults to an existing component.
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
  // @ts-ignore
  return function ComposedPartialComponent(props: any) {
    const next = mergeProps(partials, props)
    return createComponent(Component, next as any)
  }
}
