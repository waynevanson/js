import {
  ComposedMonomorphicProps,
  ComposedPolymorphicComponent,
  Compute,
  OuterPropsKind,
  Substitute,
  TagKind,
} from "./types.js"
import { createComponent } from "solid-js"

/**
 * @summary
 * Makes the properties of the key required.
 * @todo Allow properties to be null
 */
export function required<
  Tag extends TagKind,
  OuterPropsPrev extends OuterPropsKind,
  RequiredProperties extends keyof PropsPrev,
  PropsPrev = ComposedMonomorphicProps<Tag, OuterPropsPrev>,
>(
  Component: ComposedPolymorphicComponent<Tag, OuterPropsPrev>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _requireds: Array<RequiredProperties>,
): ComposedPolymorphicComponent<
  Tag,
  Compute<
    Substitute<OuterPropsPrev, Required<Pick<PropsPrev, RequiredProperties>>>
  >
> {
  // only changes are to the types
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function ComposedRequiredComponent(props: any) {
    return createComponent(Component, props)
  }
}
