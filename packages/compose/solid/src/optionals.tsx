import { mergeProps, createComponent } from "solid-js"
import {
  TagKind,
  OuterPropsKind,
  PolymorphicComponentProps,
  PolymorphicComponent,
} from "./types"

export function optionals<
  Tag extends TagKind,
  PrevOuterProps extends OuterPropsKind,
  NextOuterProps extends Partial<PolymorphicComponentProps<Tag, PrevOuterProps>>
>(
  Component: PolymorphicComponent<Tag, PrevOuterProps>,
  partials: NextOuterProps
): PolymorphicComponent<Tag, {}> {
  return function PolymorphicPartialComponent(prev) {
    const props = mergeProps(partials, prev)
    //@ts-expect-error
    return <Component {...props} />
  }
}
