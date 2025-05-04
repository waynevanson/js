import { createComponent } from "solid-js"
import {
  ComposedMonomorphicProps,
  ComposedPolymorphicComponent,
  OuterPropsKind,
  Substitute,
  TagKind,
} from "./types.js"

export function required<
  Tag extends TagKind,
  OuterPropsPrev extends OuterPropsKind,
  RequiredProperties extends keyof PropsPrev,
  PropsPrev = ComposedMonomorphicProps<Tag, OuterPropsPrev>,
>(
  Component: ComposedPolymorphicComponent<Tag, OuterPropsPrev>,
  _requireds: Array<RequiredProperties>,
): ComposedPolymorphicComponent<
  Tag,
  Substitute<OuterPropsPrev, Required<Pick<PropsPrev, RequiredProperties>>>
> {
  // only changes are to the types
  return function ComposedRequiredComponent(props: any) {
    return createComponent(Component, props)
  }
}
