import { createComponent, mergeProps } from "solid-js"
import {
  ComposedPolymorphicComponent,
  ComposedPolymorphicProps,
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
  Partials extends Partial<ComposedPolymorphicProps<Tag, OuterPropsPrev>>,
  As extends TagKind = Tag,
  OuterPropsNext extends OuterPropsKind = Substitute<
    OuterPropsPrev,
    Partial<Partials>
  >,
>(
  Component: ComposedPolymorphicComponent<Tag, OuterPropsPrev>,
  partials: Partials,
): ComposedPolymorphicComponent<As, OuterPropsNext> {
  return function ComposedPartialComponent(props: any) {
    const next = mergeProps(props, partials)
    return createComponent(Component, next as any)
  }
}
