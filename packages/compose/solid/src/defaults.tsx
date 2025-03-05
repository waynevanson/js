import { mergeProps, createComponent } from "solid-js"
import {
  TagKind,
  OuterPropsKind,
  PolymorphicComponentProps,
  PolymorphicComponent,
} from "./types"

export function defaults<
  Tag extends TagKind,
  PrevOuterProps extends OuterPropsKind,
  NextOuterProps extends Partial<PolymorphicComponentProps<Tag, PrevOuterProps>>
>(
  Component: PolymorphicComponent<Tag, PrevOuterProps>,
  defaults: NextOuterProps
): PolymorphicComponent<Tag, {}> {
  return function PolymorphicDefaultsComponent(prev) {
    const props = mergeProps(defaults, prev)
    //@ts-expect-error
    return <Component {...props} />
  }
}
