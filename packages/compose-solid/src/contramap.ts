import { createMemo, createComponent } from "solid-js"
import type {
  OuterPropsKind,
  TagKind,
  ComposedPolymorphicProps,
  ComposedPolymorphicComponent,
} from "./types.js"

export function contramap<
  Tag extends TagKind,
  PrevOuterProps extends OuterPropsKind,
  NextOuterProps extends OuterPropsKind,
  As extends TagKind = Tag,
>(
  component: ComposedPolymorphicComponent<Tag, PrevOuterProps>,
  fn: (
    next: ComposedPolymorphicProps<As, NextOuterProps>,
  ) => ComposedPolymorphicProps<Tag, PrevOuterProps>,
): ComposedPolymorphicComponent<As, NextOuterProps> {
  return function PolymorphicContramapComponent(next: any) {
    const props = createMemo(() => fn(next))
    return createComponent(component as never, props())
  }
}
