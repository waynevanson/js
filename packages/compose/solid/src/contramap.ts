import { createMemo, createComponent } from "solid-js"
import { OuterPropsKind, PolymorphicComponent, TagKind } from "./types"

export function contramap<
  Tag extends TagKind,
  PrevOuterProps extends OuterPropsKind,
  NextOuterProps extends OuterPropsKind
>(
  component: PolymorphicComponent<Tag, PrevOuterProps>,
  fn: (next: NextOuterProps) => PrevOuterProps
): PolymorphicComponent<Tag, NextOuterProps> {
  return function PolymorphicContramapComponent(next) {
    const props = createMemo(() => fn(next))
    return createComponent(component, props())
  }
}
