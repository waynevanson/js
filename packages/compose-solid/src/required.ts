import { createComponent } from "solid-js"
import {
  ComposedPolymorphicComponent,
  ComposedPolymorphicProps,
  OuterPropsKind,
  TagKind,
} from "./types.js"

export function required<
  Tag extends TagKind,
  OuterPropsPrev extends OuterPropsKind,
  RequiredProperties extends keyof PropsPrev,
  PropsPrev = ComposedPolymorphicProps<Tag, OuterPropsPrev>,
  As extends TagKind = Tag,
  OuterPropsNext extends OuterPropsKind = Required<
    Pick<PropsPrev, RequiredProperties>
  >,
>(
  Component: ComposedPolymorphicComponent<Tag, OuterPropsPrev>,
  _requireds: Array<RequiredProperties>,
): ComposedPolymorphicComponent<As, OuterPropsNext> {
  // only changes are to the types
  return function ComposedRequiredComponent(props: any) {
    return createComponent(Component, props)
  }
}
